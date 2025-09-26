# backend/apps/ideas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IdeaViewSet, IdeaNoteViewSet, IdeaResourceViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'', IdeaViewSet, basename='idea')  # Empty string since prefix is in main urls.py

# Custom URL patterns for nested resources
urlpatterns = [
    # Include router URLs (gives us the basic CRUD operations)
    path('', include(router.urls)),
    
    # Nested routes for notes
    path('<int:idea_id>/notes/', 
         IdeaNoteViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='idea-notes-list'),
    
    path('<int:idea_id>/notes/<int:pk>/', 
         IdeaNoteViewSet.as_view({
             'get': 'retrieve', 
             'put': 'update', 
             'patch': 'partial_update', 
             'delete': 'destroy'
         }), 
         name='idea-note-detail'),
    
    # Nested routes for resources
    path('<int:idea_id>/resources/', 
         IdeaResourceViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='idea-resources-list'),
    
    path('<int:idea_id>/resources/<int:pk>/', 
         IdeaResourceViewSet.as_view({
             'get': 'retrieve', 
             'put': 'update', 
             'patch': 'partial_update', 
             'delete': 'destroy'
         }), 
         name='idea-resource-detail'),
]