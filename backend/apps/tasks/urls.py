from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    TaskViewSet, TaskListViewSet, TaskCommentViewSet, 
    TaskAttachmentViewSet, TaskTimeLogViewSet, TaskTemplateViewSet
)

# Simple router for basic endpoints
router = DefaultRouter()
router.register(r'templates', TaskTemplateViewSet, basename='task-templates')
router.register(r'tasks', TaskViewSet, basename='all-tasks')

urlpatterns = [
    # Main task endpoints
    path('', include(router.urls)),
    
    # Personal task lists
    path('personal-task-lists/', TaskListViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='personal-task-lists'),
    path('personal-task-lists/<int:pk>/', TaskListViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
    }), name='personal-task-list-detail'),
    
    # Project-specific endpoints
    path('projects/<int:project_pk>/task-lists/', TaskListViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='project-task-lists'),
    path('projects/<int:project_pk>/task-lists/<int:pk>/', TaskListViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
    }), name='project-task-list-detail'),
    
    path('projects/<int:project_pk>/tasks/', TaskViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='project-tasks'),
    path('projects/<int:project_pk>/tasks/<int:pk>/', TaskViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
    }), name='project-task-detail'),
    path('projects/<int:project_pk>/tasks/stats/', TaskViewSet.as_view({
        'get': 'stats'
    }), name='project-task-stats'),
    path('projects/<int:project_pk>/tasks/bulk-update/', TaskViewSet.as_view({
        'post': 'bulk_update'
    }), name='project-task-bulk-update'),
    
    # Task sub-resources
    path('tasks/<int:task_pk>/comments/', TaskCommentViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='task-comments'),
    path('tasks/<int:task_pk>/comments/<int:pk>/', TaskCommentViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
    }), name='task-comment-detail'),
    
    path('tasks/<int:task_pk>/attachments/', TaskAttachmentViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='task-attachments'),
    path('tasks/<int:task_pk>/attachments/<int:pk>/', TaskAttachmentViewSet.as_view({
        'get': 'retrieve', 'delete': 'destroy'
    }), name='task-attachment-detail'),
    
    path('tasks/<int:task_pk>/time-logs/', TaskTimeLogViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='task-time-logs'),
    path('tasks/<int:task_pk>/time-logs/<int:pk>/', TaskTimeLogViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
    }), name='task-time-log-detail'),
]
