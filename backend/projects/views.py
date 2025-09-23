from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.utils import timezone

from .models import Project, BusinessPlan, ProjectLink, ProjectMilestone
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer, ProjectCreateUpdateSerializer,
    BusinessPlanSerializer, ProjectLinkSerializer, ProjectMilestoneSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'owner']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'deadline', 'progress']
    ordering = ['-created_at']

    def get_queryset(self):
        return Project.objects.filter(
            models.Q(owner=self.request.user) | models.Q(members=self.request.user)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateUpdateSerializer
        return ProjectDetailSerializer

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        if user_id:
            project.members.add(user_id)
            return Response({'status': 'member added'})
        return Response({'error': 'user_id required'}, status=400)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        if user_id:
            project.members.remove(user_id)
            return Response({'status': 'member removed'})
        return Response({'error': 'user_id required'}, status=400)


class BusinessPlanViewSet(viewsets.ModelViewSet):
    serializer_class = BusinessPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BusinessPlan.objects.filter(
            project__owner=self.request.user
        ).union(
            BusinessPlan.objects.filter(project__members=self.request.user)
        )


class ProjectLinkViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectLinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectLink.objects.filter(
            project__owner=self.request.user
        ).union(
            ProjectLink.objects.filter(project__members=self.request.user)
        )


class ProjectMilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectMilestone.objects.filter(
            project__owner=self.request.user
        ).union(
            ProjectMilestone.objects.filter(project__members=self.request.user)
        )

    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        milestone = self.get_object()
        milestone.is_completed = True
        milestone.completed_at = timezone.now()
        milestone.save()
        return Response({'status': 'milestone completed'})
