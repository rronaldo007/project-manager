from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import models
from .models import Idea, IdeaNote, IdeaResource, IdeaMembership
from apps.projects.models import Project

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']


class ProjectSerializer(serializers.ModelSerializer):
    """Lightweight project serializer for idea associations"""
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status']


class IdeaMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    added_by = UserSerializer(read_only=True)
    user_email = serializers.EmailField(write_only=True, required=False)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = IdeaMembership
        fields = [
            'id', 'user', 'role', 'added_by', 'created_at',
            'user_email', 'user_id'
        ]
    
    def validate(self, data):
        if not data.get('user_email') and not data.get('user_id'):
            raise serializers.ValidationError(
                "Either user_email or user_id must be provided"
            )
        return data
    
    def create(self, validated_data):
        user_email = validated_data.pop('user_email', None)
        user_id = validated_data.pop('user_id', None)
        
        # Find user by email or ID
        user = None
        if user_email:
            try:
                user = User.objects.get(email=user_email)
            except User.DoesNotExist:
                raise serializers.ValidationError(f"User with email {user_email} not found")
        elif user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise serializers.ValidationError(f"User with ID {user_id} not found")
        
        # Check if membership already exists
        idea = validated_data['idea']
        if IdeaMembership.objects.filter(idea=idea, user=user).exists():
            raise serializers.ValidationError("User is already a member of this idea")
        
        # Don't allow adding the owner as a member
        if idea.owner == user:
            raise serializers.ValidationError("The idea owner cannot be added as a member")
        
        validated_data['user'] = user
        return super().create(validated_data)


class IdeaResourceSerializer(serializers.ModelSerializer):
    added_by = UserSerializer(read_only=True)
    
    class Meta:
        model = IdeaResource
        fields = [
            'id', 'title', 'url', 'description', 'resource_type',
            'added_by', 'created_at'
        ]


class IdeaNoteSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = IdeaNote
        fields = [
            'id', 'title', 'content', 'author', 
            'created_at', 'updated_at'
        ]


class IdeaSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    project_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="List of project IDs to associate with this idea"
    )
    
    # Related data
    notes = IdeaNoteSerializer(many=True, read_only=True)
    resources = IdeaResourceSerializer(many=True, read_only=True)
    memberships = IdeaMembershipSerializer(many=True, read_only=True)
    
    # Computed fields
    tag_list = serializers.ReadOnlyField()
    notes_count = serializers.SerializerMethodField()
    resources_count = serializers.SerializerMethodField()
    projects_count = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()
    
    # User permissions
    user_role = serializers.SerializerMethodField()
    user_permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = Idea
        fields = [
            'id', 'title', 'description', 'problem_statement', 
            'solution_overview', 'target_audience', 'market_potential',
            'revenue_model', 'competition_analysis', 'technical_requirements',
            'estimated_effort', 'priority', 'status', 'tags', 'tag_list',
            'owner', 'projects', 'project_ids', 'notes', 'resources', 'memberships',
            'notes_count', 'resources_count', 'projects_count', 'members_count',
            'user_role', 'user_permissions', 'created_at', 'updated_at'
        ]
    
    def get_notes_count(self, obj):
        return obj.notes.count()
    
    def get_resources_count(self, obj):
        return obj.resources.count()
    
    def get_projects_count(self, obj):
        return obj.projects.count()
    
    def get_members_count(self, obj):
        return obj.memberships.count()
    
    def get_user_role(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        
        user = request.user
        if obj.owner == user:
            return 'owner'
        
        try:
            membership = obj.memberships.get(user=user)
            return membership.role
        except IdeaMembership.DoesNotExist:
            return None
    
    def get_user_permissions(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return {
                'can_view': False,
                'can_edit': False,
                'can_contribute': False,
                'can_manage_members': False,
                'can_delete': False
            }
        
        user = request.user
        role = self.get_user_role(obj)
        
        if role == 'owner':
            return {
                'can_view': True,
                'can_edit': True,
                'can_contribute': True,
                'can_manage_members': True,
                'can_delete': True
            }
        elif role == 'editor':
            return {
                'can_view': True,
                'can_edit': True,
                'can_contribute': True,
                'can_manage_members': True,
                'can_delete': False
            }
        elif role == 'contributor':
            return {
                'can_view': True,
                'can_edit': False,
                'can_contribute': True,
                'can_manage_members': False,
                'can_delete': False
            }
        elif role == 'viewer':
            return {
                'can_view': True,
                'can_edit': False,
                'can_contribute': False,
                'can_manage_members': False,
                'can_delete': False
            }
        else:
            return {
                'can_view': False,
                'can_edit': False,
                'can_contribute': False,
                'can_manage_members': False,
                'can_delete': False
            }
    
    def create(self, validated_data):
        project_ids = validated_data.pop('project_ids', [])
        idea = Idea.objects.create(**validated_data)
        
        if project_ids:
            # Only allow user to associate projects they have access to
            user = self.context['request'].user
            accessible_projects = Project.objects.filter(
                id__in=project_ids
            ).filter(
                models.Q(owner=user) |
                models.Q(memberships__user=user)
            ).distinct()
            
            idea.projects.set(accessible_projects)
        
        return idea
    
    def update(self, instance, validated_data):
        project_ids = validated_data.pop('project_ids', None)
        
        # Update idea fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update project associations if provided
        if project_ids is not None:
            user = self.context['request'].user
            accessible_projects = Project.objects.filter(
                id__in=project_ids
            ).filter(
                models.Q(owner=user) |
                models.Q(memberships__user=user)
            ).distinct()
            
            instance.projects.set(accessible_projects)
        
        return instance


class IdeaListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    owner = UserSerializer(read_only=True)
    tag_list = serializers.ReadOnlyField()
    notes_count = serializers.SerializerMethodField()
    resources_count = serializers.SerializerMethodField()
    projects_count = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    
    class Meta:
        model = Idea
        fields = [
            'id', 'title', 'description', 'priority', 'status',
            'tags', 'tag_list', 'owner', 'notes_count', 
            'resources_count', 'projects_count', 'members_count',
            'user_role', 'created_at', 'updated_at'
        ]
    
    def get_notes_count(self, obj):
        return obj.notes.count()
    
    def get_resources_count(self, obj):
        return obj.resources.count()
    
    def get_projects_count(self, obj):
        return obj.projects.count()
    
    def get_members_count(self, obj):
        return obj.memberships.count()
    
    def get_user_role(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        
        user = request.user
        if obj.owner == user:
            return 'owner'
        
        try:
            membership = obj.memberships.get(user=user)
            return membership.role
        except IdeaMembership.DoesNotExist:
            return None
