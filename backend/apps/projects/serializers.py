from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, ProjectMembership, ProjectFile, ProjectLink, ProjectActivity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']

class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectMembership
        fields = ['id', 'user', 'role', 'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    memberships = ProjectMembershipSerializer(many=True, read_only=True)
    user_role = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'priority', 'owner', 
                 'created_at', 'updated_at', 'due_date', 'progress', 'memberships', 'user_role']
    
    def get_user_role(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        
        if obj.owner == request.user:
            return 'owner'
        
        membership = obj.memberships.filter(user=request.user).first()
        return membership.role if membership else None
    
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class ProjectFileSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectFile
        fields = ['id', 'title', 'file', 'description', 'file_size', 'file_type', 'uploaded_at', 'uploaded_by']
        read_only_fields = ['file_size', 'file_type', 'uploaded_at', 'uploaded_by']
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        file_obj = validated_data.get('file')
        if file_obj:
            validated_data['file_size'] = file_obj.size
            validated_data['file_type'] = file_obj.content_type
        return super().create(validated_data)


class ProjectLinkSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectLink
        fields = ['id', 'title', 'url', 'description', 'created_at', 'created_by']
        read_only_fields = ['created_at', 'created_by']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class ProjectActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectActivity
        fields = ['id', 'action', 'description', 'created_at', 'user']
        read_only_fields = ['created_at', 'user']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)