from django.urls import path
from . import views

urlpatterns = [
    # Project URLs
    path('', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', views.project_detail, name='project-detail'),
    path('stats/', views.project_stats, name='project-stats'),
    path('users/search/', views.search_users, name='search-users'),
    
    # Member URLs
    path('<int:project_id>/members/', views.project_members, name='project-members'),
    path('<int:project_id>/members/<int:member_id>/', views.project_member_detail, name='project-member-detail'),
    
    # File URLs
    path('<int:project_id>/files/', views.project_files, name='project-files'),
    path('<int:project_id>/files/<int:file_id>/', views.project_file_detail, name='project-file-detail'),
    
    # Link URLs
    path('<int:project_id>/links/', views.project_links, name='project-links'),
    path('<int:project_id>/links/<int:link_id>/', views.project_link_detail, name='project-link-detail'),
    
    # Activity URLs
    path('<int:project_id>/activities/', views.project_activities, name='project-activities'),
    
    # Topic URLs - Main topic operations
    path('<int:project_id>/topics/', views.project_topics, name='project-topics'),
    path('<int:project_id>/topics/<int:topic_id>/', views.topic_detail, name='topic-detail'),
    
    # Topic Notes URLs
    path('<int:project_id>/topics/<int:topic_id>/notes/', views.topic_notes, name='topic-notes'),
    path('<int:project_id>/topics/<int:topic_id>/notes/<int:note_id>/', views.topic_note_detail, name='topic-note-detail'),
    
    # Topic Links URLs
    path('<int:project_id>/topics/<int:topic_id>/links/', views.topic_links, name='topic-links'),
    path('<int:project_id>/topics/<int:topic_id>/links/<int:link_id>/', views.topic_link_detail, name='topic-link-detail'),
    
    # Topic Media URLs
    path('<int:project_id>/topics/<int:topic_id>/media/', views.topic_media, name='topic-media'),
    path('<int:project_id>/topics/<int:topic_id>/media/<int:media_id>/', views.topic_media_detail, name='topic-media-detail'),
    
    # Topic Comments URLs
    path('<int:project_id>/topics/<int:topic_id>/comments/', views.topic_comments, name='topic-comments'),
    path('<int:project_id>/topics/<int:topic_id>/comments/<int:comment_id>/', views.topic_comment_detail, name='topic-comment-detail'),
    
    # Topic Tags URLs
    path('<int:project_id>/topics/<int:topic_id>/tags/', views.topic_tags, name='topic-tags'),
    path('<int:project_id>/topics/<int:topic_id>/tags/<int:tag_id>/', views.topic_tag_detail, name='topic-tag-detail'),
]
