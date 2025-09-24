from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Project, ProjectActivity, ProjectLink, ProjectFile
from .serializers import ProjectSerializer, ProjectActivitySerializer, ProjectLinkSerializer, ProjectFileSerializer

def create_activity(project, user, activity_type, description, metadata=None):
    """Helper function to create project activities"""
    ProjectActivity.objects.create(
        project=project,
        user=user,
        activity_type=activity_type,
        description=description,
        metadata=metadata or {}
    )

class ProjectListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get all projects for the authenticated user"""
        projects = Project.objects.filter(
            Q(owner=request.user) | Q(members=request.user)
        ).distinct()
        
        status_filter = request.query_params.get('status')
        if status_filter:
            projects = projects.filter(status=status_filter)
        
        priority_filter = request.query_params.get('priority')
        if priority_filter:
            projects = projects.filter(priority=priority_filter)
        
        search = request.query_params.get('search')
        if search:
            projects = projects.filter(title__icontains=search)
        
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Create a new project"""
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save(owner=request.user)
            
            # Create activity
            create_activity(
                project=project,
                user=request.user,
                activity_type='created',
                description=f'Project "{project.title}" was created'
            )
            
            project_serializer = ProjectSerializer(project)
            return Response(project_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk, user):
        try:
            return Project.objects.get(
                Q(pk=pk) & (Q(owner=user) | Q(members=user))
            )
        except Project.DoesNotExist:
            return None
    
    def get(self, request, pk):
        project = self.get_object(pk, request.user)
        if not project:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Update project (owner only)"""
        project = get_object_or_404(Project, pk=pk, owner=request.user)
        old_data = {
            'status': project.status,
            'progress_percentage': project.progress_percentage,
            'priority': project.priority
        }
        
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            updated_project = serializer.save()
            
            # Create activities for significant changes
            changes = []
            if old_data['status'] != updated_project.status:
                changes.append(f'Status changed from {old_data["status"]} to {updated_project.status}')
                create_activity(
                    project=updated_project,
                    user=request.user,
                    activity_type='status_changed',
                    description=f'Status changed from {old_data["status"]} to {updated_project.status}',
                    metadata={'old_status': old_data['status'], 'new_status': updated_project.status}
                )
            
            if old_data['progress_percentage'] != updated_project.progress_percentage:
                changes.append(f'Progress updated from {old_data["progress_percentage"]}% to {updated_project.progress_percentage}%')
                create_activity(
                    project=updated_project,
                    user=request.user,
                    activity_type='progress_updated',
                    description=f'Progress updated from {old_data["progress_percentage"]}% to {updated_project.progress_percentage}%',
                    metadata={'old_progress': old_data['progress_percentage'], 'new_progress': updated_project.progress_percentage}
                )
            
            if old_data['priority'] != updated_project.priority:
                changes.append(f'Priority changed from {old_data["priority"]} to {updated_project.priority}')
            
            if changes:
                create_activity(
                    project=updated_project,
                    user=request.user,
                    activity_type='updated',
                    description=f'Project updated: {", ".join(changes)}'
                )
            
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        project = get_object_or_404(Project, pk=pk, owner=request.user)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProjectStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user_projects = Project.objects.filter(
            Q(owner=request.user) | Q(members=request.user)
        ).distinct()
        
        stats = {
            'total_projects': user_projects.count(),
            'by_status': {
                'planning': user_projects.filter(status='planning').count(),
                'in_progress': user_projects.filter(status='in_progress').count(),
                'on_hold': user_projects.filter(status='on_hold').count(),
                'completed': user_projects.filter(status='completed').count(),
                'cancelled': user_projects.filter(status='cancelled').count(),
            },
            'by_priority': {
                'low': user_projects.filter(priority='low').count(),
                'medium': user_projects.filter(priority='medium').count(),
                'high': user_projects.filter(priority='high').count(),
                'urgent': user_projects.filter(priority='urgent').count(),
            },
            'overdue_projects': len([p for p in user_projects if p.is_overdue]),
            'owned_projects': user_projects.filter(owner=request.user).count(),
            'member_projects': user_projects.filter(members=request.user).count(),
        }
        
        return Response(stats)

class ProjectActivityListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, project_pk):
        """Get activities for a specific project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        activities = project.activities.all()[:50]  # Last 50 activities
        serializer = ProjectActivitySerializer(activities, many=True)
        return Response(serializer.data)
    
    def post(self, request, project_pk):
        """Add a new activity (like comment)"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        activity_type = request.data.get('activity_type', 'comment_added')
        description = request.data.get('description', '')
        metadata = request.data.get('metadata', {})
        
        if not description:
            return Response(
                {"error": "Description is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        activity = ProjectActivity.objects.create(
            project=project,
            user=request.user,
            activity_type=activity_type,
            description=description,
            metadata=metadata
        )
        
        serializer = ProjectActivitySerializer(activity)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectLinkListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, project_pk):
        """Get links for a specific project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        links = project.links.filter(is_active=True)
        serializer = ProjectLinkSerializer(links, many=True)
        return Response(serializer.data)
    
    def post(self, request, project_pk):
        """Add a new link to the project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectLinkSerializer(data=request.data)
        if serializer.is_valid():
            link = serializer.save(project=project, created_by=request.user)
            
            # Create activity for link addition
            create_activity(
                project=project,
                user=request.user,
                activity_type='updated',
                description=f'Added link: {link.title} ({link.get_link_type_display()})',
                metadata={'link_type': link.link_type, 'link_title': link.title}
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectLinkDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk, project_pk, user):
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=user) | Q(members=user))
            )
            return project.links.get(pk=pk)
        except (Project.DoesNotExist, ProjectLink.DoesNotExist):
            return None
    
    def put(self, request, project_pk, pk):
        """Update a project link"""
        link = self.get_object(pk, project_pk, request.user)
        if not link:
            return Response(
                {"error": "Link not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectLinkSerializer(link, data=request.data, partial=True)
        if serializer.is_valid():
            updated_link = serializer.save()
            
            # Create activity for link update
            create_activity(
                project=link.project,
                user=request.user,
                activity_type='updated',
                description=f'Updated link: {updated_link.title}'
            )
            
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, project_pk, pk):
        """Delete a project link"""
        link = self.get_object(pk, project_pk, request.user)
        if not link:
            return Response(
                {"error": "Link not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        link_title = link.title
        link.delete()
        
        # Create activity for link deletion
        create_activity(
            project=link.project,
            user=request.user,
            activity_type='updated',
            description=f'Removed link: {link_title}'
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProjectLinkListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, project_pk):
        """Get links for a specific project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        links = project.links.filter(is_active=True)
        serializer = ProjectLinkSerializer(links, many=True)
        return Response(serializer.data)
    
    def post(self, request, project_pk):
        """Add a new link to the project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectLinkSerializer(data=request.data)
        if serializer.is_valid():
            link = serializer.save(project=project, created_by=request.user)
            
            # Create activity for link addition
            create_activity(
                project=project,
                user=request.user,
                activity_type='updated',
                description=f'Added link: {link.title} ({link.get_link_type_display()})',
                metadata={'link_type': link.link_type, 'link_title': link.title}
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectLinkDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk, project_pk, user):
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=user) | Q(members=user))
            )
            return project.links.get(pk=pk)
        except (Project.DoesNotExist, ProjectLink.DoesNotExist):
            return None
    
    def put(self, request, project_pk, pk):
        """Update a project link"""
        link = self.get_object(pk, project_pk, request.user)
        if not link:
            return Response(
                {"error": "Link not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectLinkSerializer(link, data=request.data, partial=True)
        if serializer.is_valid():
            updated_link = serializer.save()
            
            # Create activity for link update
            create_activity(
                project=link.project,
                user=request.user,
                activity_type='updated',
                description=f'Updated link: {updated_link.title}'
            )
            
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, project_pk, pk):
        """Delete a project link"""
        link = self.get_object(pk, project_pk, request.user)
        if not link:
            return Response(
                {"error": "Link not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        link_title = link.title
        link.delete()
        
        # Create activity for link deletion
        create_activity(
            project=link.project,
            user=request.user,
            activity_type='updated',
            description=f'Removed link: {link_title}'
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProjectFileListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, project_pk):
        """Get files for a specific project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        files = project.files.filter(is_active=True)
        serializer = ProjectFileSerializer(files, many=True)
        return Response(serializer.data)
    
    def post(self, request, project_pk):
        """Upload a new file to the project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectFileSerializer(data=request.data)
        if serializer.is_valid():
            file_obj = serializer.save(project=project, uploaded_by=request.user, is_active=True)
            
            # Create activity for file upload
            create_activity(
                project=project,
                user=request.user,
                activity_type='file_uploaded',
                description=f'Uploaded file: {file_obj.title}',
                metadata={'file_type': file_obj.file_type, 'file_name': file_obj.title}
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectFileDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk, project_pk, user):
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=user) | Q(members=user))
            )
            return project.files.get(pk=pk)
        except (Project.DoesNotExist, ProjectFile.DoesNotExist):
            return None
    
    def get(self, request, project_pk, pk):
        """Get file details"""
        file_obj = self.get_object(pk, project_pk, request.user)
        if not file_obj:
            return Response(
                {"error": "File not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectFileSerializer(file_obj)
        return Response(serializer.data)
    
    def put(self, request, project_pk, pk):
        """Update file metadata"""
        file_obj = self.get_object(pk, project_pk, request.user)
        if not file_obj:
            return Response(
                {"error": "File not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectFileSerializer(file_obj, data=request.data, partial=True)
        if serializer.is_valid():
            updated_file = serializer.save()
            
            # Create activity for file update
            create_activity(
                project=file_obj.project,
                user=request.user,
                activity_type='updated',
                description=f'Updated file: {updated_file.title}'
            )
            
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, project_pk, pk):
        """Delete a file"""
        file_obj = self.get_object(pk, project_pk, request.user)
        if not file_obj:
            return Response(
                {"error": "File not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        file_title = file_obj.title
        
        # Delete the actual file from storage
        if file_obj.file:
            try:
                file_obj.file.delete(save=False)
            except:
                pass  # Continue even if file deletion fails
        
        file_obj.delete()
        
        # Create activity for file deletion
        create_activity(
            project=file_obj.project,
            user=request.user,
            activity_type='updated',
            description=f'Deleted file: {file_title}'
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProjectFileListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, project_pk):
        """Get files for a specific project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        files = project.files.filter(is_active=True)
        serializer = ProjectFileSerializer(files, many=True)
        return Response(serializer.data)
    
    def post(self, request, project_pk):
        """Upload a new file to the project"""
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=request.user) | Q(members=request.user))
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectFileSerializer(data=request.data)
        if serializer.is_valid():
            file_obj = serializer.save(project=project, uploaded_by=request.user, is_active=True)
            
            # Create activity for file upload
            create_activity(
                project=project,
                user=request.user,
                activity_type='file_uploaded',
                description=f'Uploaded file: {file_obj.title}',
                metadata={'file_type': file_obj.file_type, 'file_name': file_obj.title}
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectFileDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk, project_pk, user):
        try:
            project = Project.objects.get(
                Q(pk=project_pk) & (Q(owner=user) | Q(members=user))
            )
            return project.files.get(pk=pk)
        except (Project.DoesNotExist, ProjectFile.DoesNotExist):
            return None
    
    def put(self, request, project_pk, pk):
        """Update file metadata"""
        file_obj = self.get_object(pk, project_pk, request.user)
        if not file_obj:
            return Response(
                {"error": "File not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectFileSerializer(file_obj, data=request.data, partial=True)
        if serializer.is_valid():
            updated_file = serializer.save()
            
            # Create activity for file update
            create_activity(
                project=file_obj.project,
                user=request.user,
                activity_type='updated',
                description=f'Updated file: {updated_file.title}'
            )
            
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, project_pk, pk):
        """Delete a file"""
        file_obj = self.get_object(pk, project_pk, request.user)
        if not file_obj:
            return Response(
                {"error": "File not found or access denied"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        file_title = file_obj.title
        
        # Delete the actual file from storage
        if file_obj.file:
            try:
                file_obj.file.delete(save=False)
            except:
                pass  # Continue even if file deletion fails
        
        file_obj.delete()
        
        # Create activity for file deletion
        create_activity(
            project=file_obj.project,
            user=request.user,
            activity_type='updated',
            description=f'Deleted file: {file_title}'
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)
