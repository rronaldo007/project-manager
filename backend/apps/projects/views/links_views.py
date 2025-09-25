from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Project, ProjectLink
from ..serializers import ProjectLinkSerializer
    
from ..ProjectHelper import log_project_activity

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
