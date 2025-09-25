from django.urls import path
from .views import (
    ProjectListCreateView, 
    project_detail, 
    project_stats,
    search_users,
    project_members,
    project_member_detail,
    project_files,
    project_links,
    project_activities,
)

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', project_detail, name='project-detail'),
    path('stats/', project_stats, name='project-stats'),
    path('users/search/', search_users, name='search-users'),
    path('<int:project_id>/members/', project_members, name='project-members'),
    path('<int:project_id>/members/<int:member_id>/', project_member_detail, name='project-member-detail'),
    path('<int:project_id>/files/', project_files, name='project-files'),
    path('<int:project_id>/links/', project_links, name='project-links'),
    path('<int:project_id>/activities/', project_activities, name='project-activities'),
]
