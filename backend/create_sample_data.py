#!/usr/bin/env python
"""
Script to create sample data for the project management application
"""
import os
import sys
import django
from django.conf import settings
from datetime import datetime, timedelta

# Add the backend directory to the Python path
sys.path.append('/home/ronaldo/LEARNINGHUB/web/projects/project-manager/backend')

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projectmanager.settings')

# Setup Django
django.setup()

from django.contrib.auth import get_user_model
from projects.models import Project, ProjectMilestone
from tasks.models import Task

User = get_user_model()

# Get users
demo_user = User.objects.get(email='demo@projectmanager.com')
john = User.objects.get(email='john@projectmanager.com')
jane = User.objects.get(email='jane@projectmanager.com')
pm_user = User.objects.get(email='pm@projectmanager.com')

print("Creating sample projects...")

# Create sample projects
projects_data = [
    {
        'title': 'Website Redesign',
        'description': 'Complete redesign of the company website with modern UI/UX',
        'status': 'active',
        'priority': 'high',
        'progress': 65,
        'owner': demo_user,
        'members': [john, jane],
        'start_date': datetime.now().date() - timedelta(days=30),
        'deadline': datetime.now() + timedelta(days=30),
    },
    {
        'title': 'Mobile App Development',
        'description': 'Native mobile app for iOS and Android platforms',
        'status': 'active',
        'priority': 'urgent',
        'progress': 30,
        'owner': pm_user,
        'members': [demo_user, jane],
        'start_date': datetime.now().date() - timedelta(days=15),
        'deadline': datetime.now() + timedelta(days=60),
    },
    {
        'title': 'Marketing Campaign Q4',
        'description': 'Quarterly marketing campaign for product launch',
        'status': 'planning',
        'priority': 'medium',
        'progress': 10,
        'owner': jane,
        'members': [demo_user, john],
        'start_date': datetime.now().date() + timedelta(days=7),
        'deadline': datetime.now() + timedelta(days=90),
    },
    {
        'title': 'Data Migration',
        'description': 'Migrate legacy data to new database system',
        'status': 'completed',
        'priority': 'high',
        'progress': 100,
        'owner': john,
        'members': [demo_user],
        'start_date': datetime.now().date() - timedelta(days=60),
        'deadline': datetime.now() - timedelta(days=10),
    }
]

created_projects = []
for project_data in projects_data:
    members = project_data.pop('members')
    project = Project.objects.create(**project_data)
    project.members.set(members)
    created_projects.append(project)
    print(f"✅ Created project: {project.title}")

print(f"\nCreating sample tasks...")

# Create sample tasks
tasks_data = [
    # Website Redesign tasks
    {
        'title': 'Design Homepage Mockup',
        'description': 'Create visual mockups for the new homepage design',
        'project': created_projects[0],
        'assigned_to': jane,
        'created_by': demo_user,
        'status': 'done',
        'priority': 'high',
        'due_date': datetime.now() + timedelta(days=5),
    },
    {
        'title': 'Implement Responsive Layout',
        'description': 'Code the responsive CSS for mobile and tablet views',
        'project': created_projects[0],
        'assigned_to': john,
        'created_by': demo_user,
        'status': 'in_progress',
        'priority': 'high',
        'due_date': datetime.now() + timedelta(days=10),
    },
    {
        'title': 'Content Migration',
        'description': 'Migrate existing content to new site structure',
        'project': created_projects[0],
        'assigned_to': demo_user,
        'created_by': demo_user,
        'status': 'todo',
        'priority': 'medium',
        'due_date': datetime.now() + timedelta(days=15),
    },

    # Mobile App tasks
    {
        'title': 'App Architecture Planning',
        'description': 'Design the overall app architecture and tech stack',
        'project': created_projects[1],
        'assigned_to': pm_user,
        'created_by': pm_user,
        'status': 'done',
        'priority': 'urgent',
        'due_date': datetime.now() + timedelta(days=3),
    },
    {
        'title': 'User Authentication Module',
        'description': 'Implement user login and registration functionality',
        'project': created_projects[1],
        'assigned_to': john,
        'created_by': pm_user,
        'status': 'in_progress',
        'priority': 'urgent',
        'due_date': datetime.now() + timedelta(days=7),
    },
    {
        'title': 'Push Notifications Setup',
        'description': 'Configure Firebase for push notifications',
        'project': created_projects[1],
        'assigned_to': jane,
        'created_by': pm_user,
        'status': 'todo',
        'priority': 'medium',
        'due_date': datetime.now() + timedelta(days=20),
    },

    # Marketing Campaign tasks
    {
        'title': 'Market Research',
        'description': 'Research target audience and competitor analysis',
        'project': created_projects[2],
        'assigned_to': jane,
        'created_by': jane,
        'status': 'in_progress',
        'priority': 'medium',
        'due_date': datetime.now() + timedelta(days=12),
    },
    {
        'title': 'Creative Asset Development',
        'description': 'Create banners, videos, and promotional materials',
        'project': created_projects[2],
        'assigned_to': demo_user,
        'created_by': jane,
        'status': 'todo',
        'priority': 'low',
        'due_date': datetime.now() + timedelta(days=25),
    },
]

for task_data in tasks_data:
    task = Task.objects.create(**task_data)
    print(f"✅ Created task: {task.title}")

# Create some milestones
milestones_data = [
    {
        'project': created_projects[0],
        'title': 'Design Phase Complete',
        'description': 'All design mockups and wireframes completed',
        'due_date': datetime.now() + timedelta(days=10),
        'is_completed': True,
    },
    {
        'project': created_projects[0],
        'title': 'Development Phase Complete',
        'description': 'All frontend development completed',
        'due_date': datetime.now() + timedelta(days=25),
        'is_completed': False,
    },
    {
        'project': created_projects[1],
        'title': 'MVP Release',
        'description': 'Minimum viable product ready for beta testing',
        'due_date': datetime.now() + timedelta(days=45),
        'is_completed': False,
    },
]

print(f"\nCreating project milestones...")
for milestone_data in milestones_data:
    milestone = ProjectMilestone.objects.create(**milestone_data)
    print(f"✅ Created milestone: {milestone.title}")

print(f"\n🎉 Sample data creation completed!")
print(f"📊 Projects: {Project.objects.count()}")
print(f"📋 Tasks: {Task.objects.count()}")
print(f"🎯 Milestones: {ProjectMilestone.objects.count()}")