from django.db import models
from django.contrib.auth.models import User
from .project import Project


class ProjectTopic(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color for UI
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_topics')
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = ['project', 'title']
    
    def __str__(self):
        return f'{self.project.title} - {self.title}'


class TopicNote(models.Model):
    topic = models.ForeignKey(ProjectTopic, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topic_notes')
    last_edited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='edited_notes', null=True, blank=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f'{self.topic.title} - {self.title}'


class TopicLink(models.Model):
    topic = models.ForeignKey(ProjectTopic, on_delete=models.CASCADE, related_name='topic_links')
    title = models.CharField(max_length=255)
    url = models.URLField()
    description = models.TextField(blank=True)
    link_type = models.CharField(max_length=50, choices=[
        ('resource', 'Resource'),
        ('reference', 'Reference'),
        ('tool', 'Tool'),
        ('inspiration', 'Inspiration'),
        ('other', 'Other'),
    ], default='resource')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topic_links')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.topic.title} - {self.title}'


class TopicMedia(models.Model):
    topic = models.ForeignKey(ProjectTopic, on_delete=models.CASCADE, related_name='media')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='topic_media/')
    media_type = models.CharField(max_length=50, choices=[
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('document', 'Document'),
        ('other', 'Other'),
    ])
    description = models.TextField(blank=True)
    file_size = models.IntegerField(default=0)
    duration = models.DurationField(null=True, blank=True)  # For audio/video
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topic_media')
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f'{self.topic.title} - {self.title}'


class TopicTag(models.Model):
    topic = models.ForeignKey(ProjectTopic, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#10B981')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['topic', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f'{self.topic.title} - {self.name}'


class TopicComment(models.Model):
    topic = models.ForeignKey(ProjectTopic, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topic_comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f'{self.topic.title} - Comment by {self.author.email}'
