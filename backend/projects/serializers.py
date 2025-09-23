from rest_framework import serializers
from .models import Project, BusinessPlan, ProjectLink, ProjectMilestone
from users.serializers import UserSerializer


class ProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectLink
        fields = ['id', 'title', 'url', 'description', 'created_at']


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = ['id', 'title', 'description', 'due_date', 'is_completed', 'completed_at', 'created_at']


class BusinessPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessPlan
        fields = [
            'id', 'executive_summary', 'market_analysis', 'target_audience',
            'revenue_model', 'marketing_strategy', 'financial_projections',
            'risk_analysis', 'implementation_timeline', 'created_at', 'updated_at'
        ]


class ProjectListSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'owner',
            'start_date', 'end_date', 'deadline', 'progress', 'budget',
            'tags', 'is_archived', 'created_at', 'updated_at', 'member_count'
        ]

    def get_member_count(self, obj):
        return obj.members.count()


class ProjectDetailSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    business_plan = BusinessPlanSerializer(read_only=True)
    links = ProjectLinkSerializer(many=True, read_only=True)
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'owner',
            'members', 'start_date', 'end_date', 'deadline', 'progress',
            'budget', 'tags', 'is_archived', 'created_at', 'updated_at',
            'business_plan', 'links', 'milestones', 'task_count'
        ]

    def get_task_count(self, obj):
        return obj.tasks.count()


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'status', 'priority', 'members',
            'start_date', 'end_date', 'deadline', 'progress', 'budget', 'tags'
        ]

    def create(self, validated_data):
        members = validated_data.pop('members', [])
        project = Project.objects.create(
            owner=self.context['request'].user,
            **validated_data
        )
        project.members.set(members)
        return project