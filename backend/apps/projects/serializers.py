from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, ProjectMembership

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
