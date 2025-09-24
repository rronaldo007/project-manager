from django.urls import path
from .views import (
    ProjectListCreateView,
    ProjectDetailView,
    ProjectStatsView,
    ProjectActivityListView,
    ProjectLinkListCreateView,
    ProjectLinkDetailView
)

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('stats/', ProjectStatsView.as_view(), name='project-stats'),
    path('<int:project_pk>/activities/', ProjectActivityListView.as_view(), name='project-activities'),
    path('<int:project_pk>/links/', ProjectLinkListCreateView.as_view(), name='project-links'),
    path('<int:project_pk>/links/<int:pk>/', ProjectLinkDetailView.as_view(), name='project-link-detail'),
]
