#!/usr/bin/env python
"""
Script to create a Django superuser programmatically
"""
import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append('/home/ronaldo/LEARNINGHUB/web/projects/project-manager/backend')

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projectmanager.settings')

# Setup Django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create superuser if it doesn't exist
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@projectmanager.com',
        password='admin123',
        first_name='Admin',
        last_name='User'
    )
    print("✅ Superuser 'admin' created successfully!")
    print("Username: admin")
    print("Password: admin123")
    print("Email: admin@projectmanager.com")
else:
    print("ℹ️  Superuser 'admin' already exists")