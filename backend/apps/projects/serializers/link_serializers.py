from rest_framework import serializers
from ..models import ProjectLink
from .base_serializers import UserSerializer


class ProjectLinkSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
        
    class Meta:
        model = ProjectLink
        fields = ['id', 'title', 'url', 'description', 'created_at', 'created_by']
        read_only_fields = ['created_at', 'created_by']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
