from rest_framework import serializers
from ..models import ProjectActivity
from .base_serializers import UserSerializer


class ProjectActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
        
    class Meta:
        model = ProjectActivity
        fields = ['id', 'action', 'description', 'created_at', 'user']
        read_only_fields = ['created_at', 'user']
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
