from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, ProjectActivity, ProjectLink, ProjectFile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    is_overdue = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'start_date', 'end_date', 'created_at', 'updated_at',
            'owner', 'members', 'member_ids', 'progress_percentage',
            'is_overdue', 'days_remaining'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']
    
    def create(self, validated_data):
        member_ids = validated_data.pop('member_ids', [])
        project = Project.objects.create(**validated_data)
        
        if member_ids:
            members = User.objects.filter(id__in=member_ids)
            project.members.set(members)
        
        return project
    
    def update(self, instance, validated_data):
        member_ids = validated_data.pop('member_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if member_ids is not None:
            members = User.objects.filter(id__in=member_ids)
            instance.members.set(members)
        
        return instance

class ProjectActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectActivity
        fields = [
            'id', 'activity_type', 'activity_type_display', 'description', 
            'metadata', 'created_at', 'user', 'time_ago'
        ]
    
    def get_time_ago(self, obj):
        from django.utils import timezone
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hours ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minutes ago"
        else:
            return "Just now"

class ProjectLinkSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    link_type_display = serializers.CharField(source='get_link_type_display', read_only=True)
    
    class Meta:
        model = ProjectLink
        fields = [
            'id', 'title', 'url', 'link_type', 'link_type_display', 
            'description', 'is_active', 'created_at', 'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']

class ProjectFileSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    file_extension = serializers.ReadOnlyField()
    formatted_file_size = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectFile
        fields = [
            'id', 'title', 'description', 'file', 'file_url', 'file_type', 
            'file_size', 'file_extension', 'formatted_file_size',
            'uploaded_by', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'uploaded_by', 'file_size']
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None
    
    def create(self, validated_data):
        # Get file size from uploaded file
        if 'file' in validated_data and validated_data['file']:
            validated_data['file_size'] = validated_data['file'].size
        # Ensure is_active is True by default
        validated_data.setdefault('is_active', True)
        return super().create(validated_data)
