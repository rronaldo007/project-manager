from rest_framework import serializers
from ..models import ProjectFile
from .base_serializers import UserSerializer


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
