from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth.models import User
from ..models import Project, ProjectMembership
from ..serializers import ProjectMembershipSerializer, UserSerializer
    


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



