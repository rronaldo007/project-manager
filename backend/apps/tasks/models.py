from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.projects.models import Project


class TaskList(models.Model):
    """Task lists organize tasks within projects or as standalone lists"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='task_lists', null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    position = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_task_lists')

    class Meta:
        ordering = ['position', 'created_at']

    def __str__(self):
        if self.project:
            return f"{self.project.title} - {self.name}"
        return f"Personal - {self.name}"


class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('in_review', 'In Review'),
        ('done', 'Done'),
        ('blocked', 'Blocked'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    # Core fields
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    # Relationships - flexible associations
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
    idea = models.ForeignKey('ideas.Idea', on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
    task_list = models.ForeignKey(TaskList, on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
    
    # Core relationships
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    
    # Task hierarchy and dependencies
    parent_task = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subtasks')
    dependencies = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='dependent_tasks')
    
    # Dates and tracking
    due_date = models.DateTimeField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    estimated_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    actual_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Organization
    position = models.PositiveIntegerField(default=0)
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['position', 'created_at']
        indexes = [
            models.Index(fields=['project', 'status']),
            models.Index(fields=['assignee', 'status']),
            models.Index(fields=['due_date']),
            models.Index(fields=['priority', 'status']),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        """Validate that task has at least one context (project, idea, or is standalone)"""
        from django.core.exceptions import ValidationError
        
        # If task has a task_list, the task_list must belong to the same project (if any)
        if self.task_list and self.project and self.task_list.project != self.project:
            raise ValidationError("Task list must belong to the same project as the task")
        
        # If task has a task_list with a project, the task should also belong to that project
        if self.task_list and self.task_list.project and not self.project:
            self.project = self.task_list.project

    @property
    def context_type(self):
        """Return the context type of this task"""
        if self.project and self.idea:
            return 'project_idea'
        elif self.project:
            return 'project'
        elif self.idea:
            return 'idea'
        else:
            return 'standalone'

    @property
    def context_display(self):
        """Return a human-readable context description"""
        if self.project and self.idea:
            return f"Project: {self.project.title} | Idea: {self.idea.title}"
        elif self.project:
            return f"Project: {self.project.title}"
        elif self.idea:
            return f"Idea: {self.idea.title}"
        else:
            return "Personal Task"

    @property
    def tag_list(self):
        """Return tags as a list"""
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]

    @property
    def is_overdue(self):
        """Check if task is overdue"""
        if not self.due_date or self.status in ['done', 'cancelled']:
            return False
        from django.utils import timezone
        return timezone.now() > self.due_date

    @property
    def progress_percentage(self):
        """Calculate progress based on subtasks completion"""
        subtasks = self.subtasks.all()
        if not subtasks.exists():
            return 100 if self.status == 'done' else 0
        
        completed_subtasks = subtasks.filter(status='done').count()
        return (completed_subtasks / subtasks.count()) * 100

    def can_start(self):
        """Check if task can be started based on dependencies"""
        for dependency in self.dependencies.all():
            if dependency.status != 'done':
                return False
        return True

    def get_blocked_dependencies(self):
        """Get list of incomplete dependencies blocking this task"""
        return self.dependencies.exclude(status='done')


class TaskComment(models.Model):
    """Comments on tasks for collaboration"""
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment on {self.task.title} by {self.author.get_full_name()}"


class TaskAttachment(models.Model):
    """File attachments for tasks"""
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='task_attachments/')
    original_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    file_type = models.CharField(max_length=100)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.original_name} - {self.task.title}"


class TaskActivity(models.Model):
    """Activity log for task changes"""
    ACTION_CHOICES = [
        ('created', 'Task Created'),
        ('updated', 'Task Updated'),
        ('status_changed', 'Status Changed'),
        ('assigned', 'Task Assigned'),
        ('unassigned', 'Task Unassigned'),
        ('comment_added', 'Comment Added'),
        ('attachment_added', 'Attachment Added'),
        ('due_date_changed', 'Due Date Changed'),
        ('priority_changed', 'Priority Changed'),
        ('moved', 'Task Moved'),
        ('dependency_added', 'Dependency Added'),
        ('dependency_removed', 'Dependency Removed'),
    ]

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    old_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} - {self.task.title}"


class TaskTimeLog(models.Model):
    """Time tracking for tasks"""
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='time_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    hours = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.1)])
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.hours}h on {self.task.title} by {self.user.get_full_name()}"


class TaskTemplate(models.Model):
    """Reusable task templates"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    title_template = models.CharField(max_length=200)
    description_template = models.TextField(blank=True)
    priority = models.CharField(max_length=20, choices=Task.PRIORITY_CHOICES, default='medium')
    estimated_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    tags = models.CharField(max_length=500, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def create_task(self, project=None, idea=None, task_list=None, **kwargs):
        """Create a task from this template"""
        task_data = {
            'title': self.title_template,
            'description': self.description_template,
            'priority': self.priority,
            'estimated_hours': self.estimated_hours,
            'tags': self.tags,
            'project': project,
            'idea': idea,
            'task_list': task_list,
            'created_by': kwargs.get('created_by'),
        }
        task_data.update(kwargs)
        return Task.objects.create(**task_data)
