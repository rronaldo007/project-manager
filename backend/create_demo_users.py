#!/usr/bin/env python
"""
Script to create demo users for the project management application
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

# Create demo user for login
demo_user_data = {
    'username': 'demo',
    'email': 'demo@projectmanager.com',
    'password': 'demo123',
    'first_name': 'Demo',
    'last_name': 'User'
}

if not User.objects.filter(email=demo_user_data['email']).exists():
    demo_user = User.objects.create_user(**demo_user_data)
    print("✅ Demo user created successfully!")
    print(f"Email: {demo_user_data['email']}")
    print(f"Password: {demo_user_data['password']}")
else:
    print("ℹ️  Demo user already exists")

# Create additional test users
test_users = [
    {
        'username': 'john_doe',
        'email': 'john@projectmanager.com',
        'password': 'test123',
        'first_name': 'John',
        'last_name': 'Doe'
    },
    {
        'username': 'jane_smith',
        'email': 'jane@projectmanager.com',
        'password': 'test123',
        'first_name': 'Jane',
        'last_name': 'Smith'
    },
    {
        'username': 'project_manager',
        'email': 'pm@projectmanager.com',
        'password': 'pm123',
        'first_name': 'Project',
        'last_name': 'Manager'
    }
]

print("\n=== Creating Additional Test Users ===")
for user_data in test_users:
    if not User.objects.filter(email=user_data['email']).exists():
        user = User.objects.create_user(**user_data)
        print(f"✅ User created: {user_data['email']} (password: {user_data['password']})")
    else:
        print(f"ℹ️  User already exists: {user_data['email']}")

print(f"\n📊 Total users in database: {User.objects.count()}")