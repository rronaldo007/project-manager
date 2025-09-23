from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, BusinessPlanViewSet, ProjectLinkViewSet, ProjectMilestoneViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'business-plans', BusinessPlanViewSet, basename='businessplan')
router.register(r'links', ProjectLinkViewSet, basename='projectlink')
router.register(r'milestones', ProjectMilestoneViewSet, basename='projectmilestone')

urlpatterns = [
    path('', include(router.urls)),
]