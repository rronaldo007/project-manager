import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_manager.settings')
django.setup()

from django.contrib.auth.models import User
from apps.projects.models import Project, ProjectActivity

# Get first user and project
user = User.objects.first()
project = Project.objects.first()

if user and project:
    # Create some test activities
    activities = [
        {
            'activity_type': 'created',
            'description': f'Project "{project.title}" was created',
        },
        {
            'activity_type': 'status_changed',
            'description': f'Status changed from planning to in_progress',
            'metadata': {'old_status': 'planning', 'new_status': 'in_progress'}
        },
        {
            'activity_type': 'progress_updated',
            'description': f'Progress updated from 0% to 25%',
            'metadata': {'old_progress': 0, 'new_progress': 25}
        },
        {
            'activity_type': 'comment_added',
            'description': 'Great progress on the project so far! Keep up the good work.',
            'metadata': {'comment_type': 'user_comment'}
        },
    ]
    
    for activity_data in activities:
        ProjectActivity.objects.create(
            project=project,
            user=user,
            **activity_data
        )
    
    print(f"Created {len(activities)} test activities for project: {project.title}")
else:
    print("No user or project found. Please create a project first.")
