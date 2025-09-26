from django.db import models
from django.contrib.auth import get_user_model
from apps.projects.models import Project

User = get_user_model()

class Idea(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('concept', 'Concept'),
        ('in_development', 'In Development'),
        ('implemented', 'Implemented'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]

    # Core fields
    title = models.CharField(max_length=200)
    description = models.TextField()
    problem_statement = models.TextField(blank=True, help_text="What problem does this idea solve?")
    solution_overview = models.TextField(blank=True, help_text="High-level overview of the solution")
    target_audience = models.TextField(blank=True, help_text="Who would benefit from this idea?")
    
    # Business aspects
    market_potential = models.TextField(blank=True, help_text="Market size, opportunity, etc.")
    revenue_model = models.TextField(blank=True, help_text="How would this generate revenue?")
    competition_analysis = models.TextField(blank=True, help_text="Existing competitors and differentiation")
    
    # Technical aspects
    technical_requirements = models.TextField(blank=True, help_text="Key technical requirements and constraints")
    estimated_effort = models.CharField(max_length=100, blank=True, help_text="Time/effort estimate")
    
    # Metadata
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    tags = models.TextField(blank=True, help_text="Comma-separated tags")
    
    # Relationships
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_ideas')
    projects = models.ManyToManyField(Project, related_name='ideas', blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.title
    
    @property
    def tag_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []


class IdeaMembership(models.Model):
    """Members who can collaborate on an idea"""
    ROLE_CHOICES = [
        ('viewer', 'Viewer'),
        ('contributor', 'Contributor'),
        ('editor', 'Editor'),
    ]
    
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='idea_invitations_sent')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['idea', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.idea.title} ({self.role})"


class IdeaNote(models.Model):
    """Additional notes and thoughts about an idea"""
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.idea.title} - {self.title}"


class IdeaResource(models.Model):
    """Links and resources related to an idea"""
    RESOURCE_TYPES = [
        ('research', 'Research'),
        ('reference', 'Reference'),
        ('inspiration', 'Inspiration'),
        ('competitor', 'Competitor'),
        ('tool', 'Tool'),
        ('other', 'Other'),
    ]
    
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='resources')
    title = models.CharField(max_length=200)
    url = models.URLField()
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, default='reference')
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.idea.title} - {self.title}"
