from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Project, ProjectFile
from ..serializers import ProjectFileSerializer
    
from ..ProjectHelper import log_project_activity

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