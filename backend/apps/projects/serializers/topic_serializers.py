from rest_framework import serializers
from ..models import ProjectTopic, TopicNote, TopicLink, TopicMedia, TopicTag, TopicComment
from .base_serializers import UserSerializer


class TopicTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicTag
        fields = ['id', 'name', 'color', 'created_at']


class TopicCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = TopicComment
        fields = ['id', 'content', 'created_at', 'updated_at', 'author', 'parent', 'replies']
        read_only_fields = ['created_at', 'updated_at', 'author']
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return TopicCommentSerializer(obj.replies.all(), many=True).data
        return []
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class TopicNoteSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    last_edited_by = UserSerializer(read_only=True)
    
    class Meta:
        model = TopicNote
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'created_by', 'last_edited_by']
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['last_edited_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class TopicLinkSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = TopicLink
        fields = ['id', 'title', 'url', 'description', 'link_type', 'created_at', 'created_by']
        read_only_fields = ['created_at', 'created_by']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TopicMediaSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = TopicMedia
        fields = ['id', 'title', 'file', 'media_type', 'description', 'file_size', 'duration', 'uploaded_at', 'uploaded_by']
        read_only_fields = ['uploaded_at', 'uploaded_by', 'file_size', 'media_type']
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        file_obj = validated_data.get('file')
        if file_obj:
            validated_data['file_size'] = file_obj.size
            # Determine media type based on file extension or content type
            content_type = file_obj.content_type or ''
            if content_type.startswith('image/'):
                validated_data['media_type'] = 'image'
            elif content_type.startswith('video/'):
                validated_data['media_type'] = 'video'
            elif content_type.startswith('audio/'):
                validated_data['media_type'] = 'audio'
            elif content_type in ['application/pdf', 'text/plain', 'application/msword']:
                validated_data['media_type'] = 'document'
            else:
                validated_data['media_type'] = 'other'
        return super().create(validated_data)


class ProjectTopicSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    notes_count = serializers.SerializerMethodField()
    links_count = serializers.SerializerMethodField()
    media_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    tags = TopicTagSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProjectTopic
        fields = ['id', 'title', 'description', 'color', 'created_at', 'updated_at', 'created_by', 
                 'notes_count', 'links_count', 'media_count', 'comments_count', 'tags']
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def get_notes_count(self, obj):
        return obj.notes.count()
    
    def get_links_count(self, obj):
        return obj.topic_links.count()
    
    def get_media_count(self, obj):
        return obj.media.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ProjectTopicDetailSerializer(ProjectTopicSerializer):
    notes = TopicNoteSerializer(many=True, read_only=True)
    topic_links = TopicLinkSerializer(many=True, read_only=True)
    media = TopicMediaSerializer(many=True, read_only=True)
    comments = TopicCommentSerializer(many=True, read_only=True)
    
    class Meta(ProjectTopicSerializer.Meta):
        fields = ProjectTopicSerializer.Meta.fields + ['notes', 'topic_links', 'media', 'comments']
