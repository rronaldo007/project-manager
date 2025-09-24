from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Project(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Dates
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Relationships
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    members = models.ManyToManyField(User, related_name='projects', blank=True)
    
    # Progress tracking
    progress_percentage = models.IntegerField(default=0, help_text="Progress from 0 to 100")
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.title
    
    @property
    def is_overdue(self):
        if self.end_date and self.status not in ['completed', 'cancelled']:
            return timezone.now().date() > self.end_date
        return False
    
    @property
    def days_remaining(self):
        if self.end_date:
            delta = self.end_date - timezone.now().date()
            return delta.days
        return None

class ProjectActivity(models.Model):
    ACTIVITY_TYPES = [
        ('created', 'Project Created'),
        ('updated', 'Project Updated'),
        ('status_changed', 'Status Changed'),
        ('progress_updated', 'Progress Updated'),
        ('member_added', 'Member Added'),
        ('member_removed', 'Member Removed'),
        ('comment_added', 'Comment Added'),
        ('file_uploaded', 'File Uploaded'),
        ('deadline_changed', 'Deadline Changed'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)  # Store additional data like old/new values
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Project Activities'
    
    def __str__(self):
        return f"{self.user.username} - {self.get_activity_type_display()}"

class ProjectLink(models.Model):
    LINK_TYPES = [
        ('github', 'GitHub Repository'),
        ('gitlab', 'GitLab Repository'),
        ('bitbucket', 'Bitbucket Repository'),
        ('documentation', 'Documentation'),
        ('deployment', 'Live Deployment'),
        ('staging', 'Staging Environment'),
        ('design', 'Design Files'),
        ('figma', 'Figma Design'),
        ('trello', 'Trello Board'),
        ('slack', 'Slack Channel'),
        ('other', 'Other'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='links')
    title = models.CharField(max_length=200)
    url = models.URLField()
    link_type = models.CharField(max_length=20, choices=LINK_TYPES, default='other')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['link_type', 'title']
    
    def __str__(self):
        return f"{self.title} - {self.project.title}"
