from django.db import models
from django.contrib.auth.models import User
from .project import Project


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
