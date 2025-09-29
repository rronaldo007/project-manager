from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Avg, Sum
from django.db import transaction
from django.utils import timezone
from django.contrib.auth.models import User

from .models import (
    Task, TaskList, TaskComment, TaskAttachment, 
    TaskActivity, TaskTimeLog, TaskTemplate
)
from .serializers import (
    TaskDetailSerializer, TaskBasicSerializer, TaskCreateUpdateSerializer,
    TaskListSerializer, TaskCommentSerializer, TaskAttachmentSerializer,
    TaskActivitySerializer, TaskTimeLogSerializer, TaskTemplateSerializer,
    TaskBulkUpdateSerializer
)
from apps.projects.models import Project


class TaskListViewSet(viewsets.ModelViewSet):
    """ViewSet for task lists - can be project-based or standalone"""
    serializer_class = TaskListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')
        
        if project_id:
            # Project-specific task lists
            project = get_object_or_404(Project, id=project_id)
            # Add permission check for project access
            return TaskList.objects.filter(project=project).prefetch_related('tasks')
        else:
            # User's personal task lists (standalone)
            return TaskList.objects.filter(
                created_by=self.request.user,
                project__isnull=True
            ).prefetch_related('tasks')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['project_id'] = self.kwargs.get('project_pk')
        return context

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_pk')
        
        if project_id:
            # Creating within a project
            project = get_object_or_404(Project, id=project_id)
            # Add permission check for project write access
            serializer.save(project=project, created_by=self.request.user)
        else:
            # Creating a personal task list
            serializer.save(project=None, created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def reorder_tasks(self, request, project_pk=None, pk=None):
        """Reorder tasks within a task list"""
        task_list = self.get_object()
        task_ids = request.data.get('task_ids', [])
        
        if not isinstance(task_ids, list):
            return Response(
                {'error': 'task_ids must be a list'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update task positions
        with transaction.atomic():
            for index, task_id in enumerate(task_ids):
                Task.objects.filter(
                    id=task_id, 
                    task_list=task_list
                ).update(position=index)
        
        return Response({'message': 'Tasks reordered successfully'})


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for tasks - supports project, idea, or standalone contexts"""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')
        idea_id = self.kwargs.get('idea_pk')
        
        if project_id:
            # Project-specific tasks
            project = get_object_or_404(Project, id=project_id)
            # Add permission check for project access
            queryset = Task.objects.filter(project=project)
            
        elif idea_id:
            # Idea-specific tasks
            # Add idea model import and permission check
            queryset = Task.objects.filter(idea_id=idea_id)
            
        else:
            # Personal/standalone tasks or all user's tasks
            queryset = Task.objects.filter(
                Q(created_by=self.request.user) |
                Q(assignee=self.request.user)
            ).distinct()
        
        # Apply common select_related and prefetch_related
        queryset = queryset.select_related(
            'assignee', 'created_by', 'task_list', 'idea', 'parent_task', 'project'
        ).prefetch_related(
            'subtasks', 'dependencies', 'dependent_tasks', 'comments', 
            'attachments', 'activities', 'time_logs'
        )
        
        # Apply filters
        return self._apply_filters(queryset)
    
    def _apply_filters(self, queryset):
        """Apply query parameter filters"""
        # Status filter
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Priority filter
        priority_filter = self.request.query_params.get('priority')
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        # Assignee filter
        assignee_filter = self.request.query_params.get('assignee')
        if assignee_filter:
            if assignee_filter == 'me':
                queryset = queryset.filter(assignee=self.request.user)
            elif assignee_filter == 'unassigned':
                queryset = queryset.filter(assignee__isnull=True)
            else:
                queryset = queryset.filter(assignee_id=assignee_filter)
        
        # Context filter
        context_filter = self.request.query_params.get('context')
        if context_filter:
            if context_filter == 'project':
                queryset = queryset.filter(project__isnull=False)
            elif context_filter == 'idea':
                queryset = queryset.filter(idea__isnull=False)
            elif context_filter == 'standalone':
                queryset = queryset.filter(project__isnull=True, idea__isnull=True)
        
        # Search filter
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(tags__icontains=search)
            )
        
        # Due date filters
        due_filter = self.request.query_params.get('due')
        if due_filter == 'overdue':
            queryset = queryset.filter(
                due_date__lt=timezone.now(),
                status__in=['todo', 'in_progress', 'in_review', 'blocked']
            )
        elif due_filter == 'today':
            today = timezone.now().date()
            queryset = queryset.filter(due_date__date=today)
        elif due_filter == 'week':
            week_from_now = timezone.now() + timezone.timedelta(days=7)
            queryset = queryset.filter(
                due_date__gte=timezone.now(),
                due_date__lte=week_from_now
            )
        
        return queryset

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TaskCreateUpdateSerializer
        elif self.action == 'retrieve':
            return TaskDetailSerializer
        return TaskBasicSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        project_id = self.kwargs.get('project_pk')
        idea_id = self.kwargs.get('idea_pk')
        
        if project_id:
            context['project'] = get_object_or_404(Project, id=project_id)
        if idea_id:
            # Add idea context when implemented
            pass
        
        return context

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get task dashboard for the current user"""
        user_tasks = Task.objects.filter(
            Q(assignee=request.user) |
            Q(created_by=request.user)
        ).distinct()
        
        dashboard_data = {
            'my_tasks_summary': {
                'total': user_tasks.count(),
                'todo': user_tasks.filter(status='todo').count(),
                'in_progress': user_tasks.filter(status='in_progress').count(),
                'done': user_tasks.filter(status='done').count(),
                'overdue': user_tasks.filter(
                    due_date__lt=timezone.now(),
                    status__in=['todo', 'in_progress', 'in_review', 'blocked']
                ).count(),
            },
            'by_context': {
                'project_tasks': user_tasks.filter(project__isnull=False).count(),
                'idea_tasks': user_tasks.filter(idea__isnull=False).count(),
                'standalone_tasks': user_tasks.filter(
                    project__isnull=True, 
                    idea__isnull=True
                ).count(),
            },
            'recent_tasks': TaskBasicSerializer(
                user_tasks.order_by('-updated_at')[:10],
                many=True,
                context={'request': request}
            ).data,
            'upcoming_deadlines': TaskBasicSerializer(
                user_tasks.filter(
                    due_date__isnull=False,
                    status__in=['todo', 'in_progress', 'in_review']
                ).order_by('due_date')[:5],
                many=True,
                context={'request': request}
            ).data
        }
        
        return Response(dashboard_data)

    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update multiple tasks"""
        serializer = TaskBulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        task_ids = serializer.validated_data['task_ids']
        action = serializer.validated_data['action']
        value = serializer.validated_data.get('value', '')
        
        tasks = Task.objects.filter(id__in=task_ids)
        updated_count = 0
        
        with transaction.atomic():
            if action == 'update_status':
                updated_count = tasks.update(status=value)
                # Update completed_at for done tasks
                if value == 'done':
                    tasks.filter(status='done').update(completed_at=timezone.now())
                elif value != 'done':
                    tasks.exclude(status='done').update(completed_at=None)
                    
            elif action == 'update_priority':
                updated_count = tasks.update(priority=value)
                
            elif action == 'update_assignee':
                assignee = User.objects.get(id=value) if value else None
                updated_count = tasks.update(assignee=assignee)
                
            elif action == 'add_tags':
                for task in tasks:
                    existing_tags = set(task.tag_list)
                    new_tags = set(tag.strip() for tag in value.split(',') if tag.strip())
                    all_tags = existing_tags.union(new_tags)
                    task.tags = ','.join(sorted(all_tags))
                    task.save(update_fields=['tags'])
                updated_count = tasks.count()
                
            elif action == 'delete':
                updated_count = tasks.count()
                tasks.delete()
        
        return Response({
            'message': f'Successfully {action} {updated_count} tasks',
            'updated_count': updated_count
        })

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark task as complete"""
        task = self.get_object()
        
        if task.status == 'done':
            return Response({'message': 'Task is already completed'})
        
        task.status = 'done'
        task.completed_at = timezone.now()
        task.save(update_fields=['status', 'completed_at'])
        
        TaskActivity.objects.create(
            task=task,
            action='status_changed',
            description='Task completed',
            user=request.user
        )
        
        return Response({'message': 'Task completed successfully'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get task statistics based on context"""
        project_id = self.kwargs.get('project_pk')
        idea_id = self.kwargs.get('idea_pk')
        
        if project_id:
            # Project-specific stats
            project = get_object_or_404(Project, id=project_id)
            tasks = Task.objects.filter(project=project)
            context_name = f"Project: {project.title}"
            
        elif idea_id:
            # Idea-specific stats
            tasks = Task.objects.filter(idea_id=idea_id)
            context_name = f"Idea: {idea_id}"
            
        else:
            # User's overall stats
            tasks = Task.objects.filter(
                Q(created_by=request.user) |
                Q(assignee=request.user)
            ).distinct()
            context_name = "All Your Tasks"
        
        stats = {
            'context': context_name,
            'total_tasks': tasks.count(),
            'by_status': dict(tasks.values('status').annotate(count=Count('id')).values_list('status', 'count')),
            'by_priority': dict(tasks.values('priority').annotate(count=Count('id')).values_list('priority', 'count')),
            'by_context': {
                'project_tasks': tasks.filter(project__isnull=False).count(),
                'idea_tasks': tasks.filter(idea__isnull=False).count(),
                'standalone_tasks': tasks.filter(project__isnull=True, idea__isnull=True).count(),
            },
            'overdue_tasks': tasks.filter(
                due_date__lt=timezone.now(),
                status__in=['todo', 'in_progress', 'in_review', 'blocked']
            ).count(),
            'total_time_logged': tasks.aggregate(
                total=Sum('time_logs__hours')
            )['total'] or 0
        }
        
        return Response(stats)


class TaskCommentViewSet(viewsets.ModelViewSet):
    """ViewSet for task comments"""
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        task_id = self.kwargs.get('task_pk')
        task = get_object_or_404(Task, id=task_id)
        
        return TaskComment.objects.filter(task=task, parent__isnull=True).select_related(
            'author', 'task'
        ).prefetch_related('replies__author')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['task_id'] = self.kwargs.get('task_pk')
        return context


class TaskAttachmentViewSet(viewsets.ModelViewSet):
    """ViewSet for task attachments"""
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        task_id = self.kwargs.get('task_pk')
        task = get_object_or_404(Task, id=task_id)
        
        return TaskAttachment.objects.filter(task=task).select_related('uploaded_by')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['task_id'] = self.kwargs.get('task_pk')
        return context


class TaskTimeLogViewSet(viewsets.ModelViewSet):
    """ViewSet for task time logs"""
    serializer_class = TaskTimeLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        task_id = self.kwargs.get('task_pk')
        task = get_object_or_404(Task, id=task_id)
        
        return TaskTimeLog.objects.filter(task=task).select_related('user')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['task_id'] = self.kwargs.get('task_pk')
        return context


class TaskTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for task templates"""
    serializer_class = TaskTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # User can see their own templates and public templates
        return TaskTemplate.objects.filter(
            Q(created_by=self.request.user) | Q(is_public=True)
        ).select_related('created_by')

    @action(detail=True, methods=['post'])
    def create_task(self, request, pk=None):
        """Create a task from this template"""
        template = self.get_object()
        project_id = request.data.get('project_id')
        idea_id = request.data.get('idea_id')
        task_list_id = request.data.get('task_list_id')
        
        project = None
        idea = None
        task_list = None
        
        if project_id:
            project = get_object_or_404(Project, id=project_id)
        
        if task_list_id:
            task_list = get_object_or_404(TaskList, id=task_list_id)
        
        # Create task from template
        task = template.create_task(
            project=project,
            idea=idea,
            task_list=task_list,
            created_by=request.user
        )
        
        serializer = TaskDetailSerializer(task, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
