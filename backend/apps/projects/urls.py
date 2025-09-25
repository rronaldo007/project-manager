from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', views.project_detail, name='project-detail'),
    path('stats/', views.project_stats, name='project-stats'),
    path('users/search/', views.search_users, name='search-users'),
    path('<int:project_id>/members/', views.project_members, name='project-members'),
    path('<int:project_id>/members/<int:member_id>/', views.project_member_detail, name='project-member-detail'),
    path('<int:project_id>/files/', views.project_files, name='project-files'),
    path('<int:project_id>/links/', views.project_links, name='project-links'),
    path('<int:project_id>/links/<int:link_id>/', views.project_link_detail, name='project-link-detail'),
    path('<int:project_id>/activities/', views.project_activities, name='project-activities'),
]
