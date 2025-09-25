from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='planning')
    priority = models.CharField(max_length=20, default='medium')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(null=True, blank=True)
    progress = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title

class ProjectMembership(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_memberships')
    role = models.CharField(max_length=20, default='viewer')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['project', 'user']
    
    def __str__(self):
        return f'{self.user.email} - {self.project.title} ({self.role})'
    

class ProjectFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='project_files/')
    description = models.TextField(blank=True)
    file_size = models.IntegerField(default=0)
    file_type = models.CharField(max_length=100, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f'{self.title} - {self.project.title}'

class ProjectLink(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='links')
    title = models.CharField(max_length=255)
    url = models.URLField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_links')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.title} - {self.project.title}'

class ProjectActivity(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_activities')
    action = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Project Activities'
    
    def __str__(self):
        return f'{self.project.title} - {self.action}'
