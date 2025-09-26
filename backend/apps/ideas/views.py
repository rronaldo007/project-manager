from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Idea, IdeaNote, IdeaResource, IdeaMembership
from .serializers import (
    IdeaSerializer, IdeaListSerializer, 
    IdeaNoteSerializer, IdeaResourceSerializer,
    IdeaMembershipSerializer
)
from apps.projects.models import Project


class IdeaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return ideas owned by or shared with the current user"""
        user = self.request.user
        queryset = Idea.objects.filter(
            Q(owner=user) | Q(memberships__user=user)
        ).distinct()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by priority
        priority_filter = self.request.query_params.get('priority')
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        # Search in title and description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(problem_statement__icontains=search) |
                Q(tags__icontains=search)
            )
        
        # Filter by project
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(projects__id=project_id)
        
        return queryset.prefetch_related('projects', 'notes', 'resources', 'memberships')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return IdeaListSerializer
        return IdeaSerializer
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    def has_permission_for_idea(self, idea, required_role=None):
        """Check if user has permission for this idea"""
        user = self.request.user
        
        # Owner has all permissions
        if idea.owner == user:
            return True
        
        # Check membership permissions
        try:
            membership = IdeaMembership.objects.get(idea=idea, user=user)
            if not required_role:
                return True
            
            # Role hierarchy: editor > contributor > viewer
            role_hierarchy = {'viewer': 1, 'contributor': 2, 'editor': 3}
            user_level = role_hierarchy.get(membership.role, 0)
            required_level = role_hierarchy.get(required_role, 0)
            
            return user_level >= required_level
        except IdeaMembership.DoesNotExist:
            return False
    
    def update(self, request, *args, **kwargs):
        idea = self.get_object()
        if not self.has_permission_for_idea(idea, 'editor'):
            return Response(
                {'error': 'You need editor permissions to modify this idea'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        idea = self.get_object()
        if idea.owner != request.user:
            return Response(
                {'error': 'Only the owner can delete this idea'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get idea statistics for the current user"""
        queryset = self.get_queryset()
        
        stats = {
            'total_ideas': queryset.count(),
            'by_status': {},
            'by_priority': {},
            'recent_ideas': list(queryset[:5].values('id', 'title', 'created_at'))
        }
        
        # Count by status
        for status_choice in Idea.STATUS_CHOICES:
            status_key = status_choice[0]
            count = queryset.filter(status=status_key).count()
            stats['by_status'][status_key] = count
        
        # Count by priority
        for priority_choice in Idea.PRIORITY_CHOICES:
            priority_key = priority_choice[0]
            count = queryset.filter(priority=priority_key).count()
            stats['by_priority'][priority_key] = count
        
        return Response(stats)
    
    @action(detail=True, methods=['get', 'post'])
    def members(self, request, pk=None):
        """Manage idea members"""
        idea = self.get_object()
        
        if request.method == 'GET':
            memberships = IdeaMembership.objects.filter(idea=idea)
            serializer = IdeaMembershipSerializer(memberships, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            # Only owner and editors can add members
            if not self.has_permission_for_idea(idea, 'editor') and idea.owner != request.user:
                return Response(
                    {'error': 'You do not have permission to add members'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = IdeaMembershipSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(idea=idea, added_by=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], url_path='members/(?P<user_id>[^/.]+)')
    def remove_member(self, request, pk=None, user_id=None):
        """Remove a member from the idea"""
        idea = self.get_object()
        
        # Only owner and editors can remove members
        if not self.has_permission_for_idea(idea, 'editor') and idea.owner != request.user:
            return Response(
                {'error': 'You do not have permission to remove members'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            membership = IdeaMembership.objects.get(idea=idea, user_id=user_id)
            membership.delete()
            return Response({'message': 'Member removed successfully'})
        except IdeaMembership.DoesNotExist:
            return Response(
                {'error': 'Member not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def my_user_projects(self, request):
        """Get projects accessible to the current user for idea association"""
        user = request.user
        projects = Project.objects.filter(
            Q(owner=user) | Q(memberships__user=user)
        ).distinct().values('id', 'title', 'description', 'status')
        
        return Response(list(projects))


class IdeaNoteViewSet(viewsets.ModelViewSet):
    serializer_class = IdeaNoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        idea_id = self.kwargs.get('idea_id')
        return IdeaNote.objects.filter(
            idea_id=idea_id,
            idea__in=Idea.objects.filter(
                Q(owner=self.request.user) | Q(memberships__user=self.request.user)
            )
        )
    
    def perform_create(self, serializer):
        idea_id = self.kwargs.get('idea_id')
        idea = Idea.objects.get(id=idea_id)
        
        # Check permissions - contributors and above can add notes
        idea_viewset = IdeaViewSet()
        idea_viewset.request = self.request
        if not idea_viewset.has_permission_for_idea(idea, 'contributor'):
            raise PermissionError('You need contributor permissions to add notes')
        
        serializer.save(
            idea_id=idea_id,
            author=self.request.user
        )


class IdeaResourceViewSet(viewsets.ModelViewSet):
    serializer_class = IdeaResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        idea_id = self.kwargs.get('idea_id')
        return IdeaResource.objects.filter(
            idea_id=idea_id,
            idea__in=Idea.objects.filter(
                Q(owner=self.request.user) | Q(memberships__user=self.request.user)
            )
        )
    
    def perform_create(self, serializer):
        idea_id = self.kwargs.get('idea_id')
        idea = Idea.objects.get(id=idea_id)
        
        # Check permissions - contributors and above can add resources
        idea_viewset = IdeaViewSet()
        idea_viewset.request = self.request
        if not idea_viewset.has_permission_for_idea(idea, 'contributor'):
            raise PermissionError('You need contributor permissions to add resources')
        
        serializer.save(
            idea_id=idea_id,
            added_by=self.request.user
        )
