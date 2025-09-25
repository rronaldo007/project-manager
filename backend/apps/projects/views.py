from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth.models import User
from .models import Project, ProjectMembership, ProjectLink
from .serializers import ProjectSerializer, ProjectMembershipSerializer, UserSerializer, \
    ProjectFileSerializer, ProjectLinkSerializer, ProjectActivitySerializer
    
from .ProjectHelper import log_project_activity

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(
            Q(owner=user) | Q(memberships__user=user)
        ).distinct()

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProjectSerializer(project, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProjectSerializer(project, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if project.owner != request.user:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_stats(request):
    user = request.user
    projects = Project.objects.filter(Q(owner=user) | Q(memberships__user=user)).distinct()
    
    return Response({
        'totalProjects': projects.count(),
        'activeProjects': projects.filter(status='in_progress').count(),
        'completedProjects': projects.filter(status='completed').count(),
        'onHoldProjects': projects.filter(status='on_hold').count(),
        'planningProjects': projects.filter(status='planning').count(),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get('q', '')
    if len(query) < 2:
        return Response([])
    
    users = User.objects.filter(
        Q(first_name__icontains=query) | 
        Q(last_name__icontains=query) | 
        Q(email__icontains=query)
    ).exclude(id=request.user.id)[:10]
    
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def project_members(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    
    # Check if user has access to the project
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # Return all project members
        memberships = project.memberships.all()
        serializer = ProjectMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        print(f'DEBUG: POST request to add member')
        print(f'DEBUG: Request data: {request.data}')
        print(f'DEBUG: Project ID: {project_id}')
        print(f'DEBUG: Project owner: {project.owner.email}')
        print(f'DEBUG: Current user: {request.user.email}')
        
        # Add new member (only owner can do this)
        if project.owner != request.user:
            print(f'DEBUG: Permission denied - not owner')
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        user_email = request.data.get('user_email')
        role = request.data.get('role', 'viewer')
        
        print(f'DEBUG: user_email: {user_email}, role: {role}')
        
        if not user_email:
            print(f'DEBUG: No user_email provided')
            return Response({'user_email': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_to_add = User.objects.get(email=user_email)
            print(f'DEBUG: Found user to add: {user_to_add.email}')
        except User.DoesNotExist:
            print(f'DEBUG: User not found: {user_email}')
            return Response({'user_email': ['User with this email does not exist.']}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user is already a member
        if project.memberships.filter(user=user_to_add).exists():
            print(f'DEBUG: User already a member')
            return Response({'user_email': ['User is already a member of this project.']}, status=status.HTTP_400_BAD_REQUEST)
        
        # Don't add the owner as a member
        if user_to_add == project.owner:
            print(f'DEBUG: Cannot add owner as member')
            return Response({'user_email': ['Project owner cannot be added as a member.']}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create membership
        try:
            membership = ProjectMembership.objects.create(
                project=project,
                user=user_to_add,
                role=role,
                
            )
            print(f'DEBUG: Created membership: {membership.id}')
            
            # Log the activity
            log_project_activity(
                project=project,
                user=request.user,
                action="Added team member",
                description=f"Added {user_to_add.first_name or user_to_add.email} as {role}"
            )
            
            serializer = ProjectMembershipSerializer(membership)
            print(f'DEBUG: Serialized data: {serializer.data}')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f'DEBUG: Error creating membership: {str(e)}')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def project_member_detail(request, project_id, member_id):
    project = get_object_or_404(Project, pk=project_id)
    membership = get_object_or_404(ProjectMembership, pk=member_id, project=project)
    
    if project.owner != request.user:
        return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'PATCH':
        role = request.data.get('role')
        if role in ['viewer', 'editor']:
            membership.role = role
            membership.save()
            # Log the activity
            log_project_activity(
                project=project,
                user=request.user,
                action="Updated member role",
                description=f"Changed {membership.user.first_name or membership.user.email}'s role from {old_role} to {role}"
            )
            serializer = ProjectMembershipSerializer(membership)
            return Response(serializer.data)
        else:
            return Response({'role': ['Invalid role.']}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Placeholder endpoints
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def project_files(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        files = project.files.all()
        serializer = ProjectFileSerializer(files, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProjectFileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            file_instance = serializer.save(project=project)
            
            # Log the activity
            log_project_activity(
                project=project,
                user=request.user,
                action="Uploaded file",
                description=f"Uploaded file: {file_instance.title}"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def project_links(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        links = project.links.all()
        serializer = ProjectLinkSerializer(links, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProjectLinkSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            link_instance = serializer.save(project=project)
            
            # Log the activity
            log_project_activity(
                project=project,
                user=request.user,
                action="Added link",
                description=f"Added link: {link_instance.title} ({link_instance.url})"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def project_link_detail(request, project_id, link_id):
    project = get_object_or_404(Project, pk=project_id)
    link = get_object_or_404(ProjectLink, pk=link_id, project=project)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProjectLinkSerializer(link)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        old_data = {
            'title': project.title,
            'status': project.status,
            'priority': project.priority
        }
        
        serializer = ProjectLinkSerializer(link, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            changes = []
            if 'title' in request.data and request.data['title'] != old_data['title']:
                changes.append(f"title from '{old_data['title']}' to '{request.data['title']}'")
            if 'status' in request.data and request.data['status'] != old_data['status']:
                changes.append(f"status from '{old_data['status']}' to '{request.data['status']}'")
            if 'priority' in request.data and request.data['priority'] != old_data['priority']:
                changes.append(f"priority from '{old_data['priority']}' to '{request.data['priority']}'")
            
            if changes:
                log_project_activity(
                    project=project,
                    user=request.user,
                    action="Updated project",
                    description=f"Updated {', '.join(changes)}"
                )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        link.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def project_activities(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        activities = project.activities.all()
        serializer = ProjectActivitySerializer(activities, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProjectActivitySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def project_file_detail(request, project_id, file_id):
    project = get_object_or_404(Project, pk=project_id)
    file_obj = get_object_or_404(ProjectFile, pk=file_id, project=project)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check write permissions
    membership = project.memberships.filter(user=request.user).first()
    user_role = 'owner' if project.owner == request.user else membership.role if membership else None
    
    if user_role not in ['owner', 'editor']:
        return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    file_title = file_obj.title
    file_obj.delete()
    
    # Log the activity
    log_project_activity(
        project=project,
        user=request.user,
        action='Deleted file',
        description=f'Deleted file: {file_title}'
    )
    
    return Response(status=status.HTTP_204_NO_CONTENT)
