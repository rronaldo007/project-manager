from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Project
from ..serializers import ProjectActivitySerializer
    

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