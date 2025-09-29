from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Task, TaskList, TaskComment, TaskAttachment, 
    TaskActivity, TaskTimeLog, TaskTemplate
)
from apps.projects.models import Project


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user serializer for task assignments"""
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']


class ProjectBasicSerializer(serializers.ModelSerializer):
    """Basic project serializer for task context"""
    class Meta:
        model = Project
        fields = ['id', 'title', 'description']


class IdeaBasicSerializer(serializers.ModelSerializer):
    """Basic idea serializer for task context"""
    class Meta:
        fields = ['id', 'title', 'description']


class TaskListSerializer(serializers.ModelSerializer):
    """Serializer for task lists"""
    created_by = UserBasicSerializer(read_only=True)
    tasks_count = serializers.SerializerMethodField()
    completed_tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = TaskList
        fields = [
            'id', 'name', 'description', 'position', 
            'created_at', 'updated_at', 'created_by',
            'tasks_count', 'completed_tasks_count'
        ]

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    def get_completed_tasks_count(self, obj):
        return obj.tasks.filter(status='done').count()

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        project_id = self.context.get('project_id')
        if project_id:
            validated_data['project_id'] = project_id
        return super().create(validated_data)


class TaskBasicSerializer(serializers.ModelSerializer):
    """Basic task serializer for lists and references"""
    assignee = UserBasicSerializer(read_only=True)
    created_by = UserBasicSerializer(read_only=True)
    tag_list = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    progress_percentage = serializers.ReadOnlyField()
    context_type = serializers.ReadOnlyField()
    context_display = serializers.ReadOnlyField()
    subtasks_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    attachments_count = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'due_date', 'start_date', 'completed_at', 'estimated_hours', 'actual_hours',
            'position', 'tags', 'tag_list', 'created_at', 'updated_at',
            'assignee', 'created_by', 'task_list', 'idea', 'parent_task', 'project',
            'is_overdue', 'progress_percentage', 'context_type', 'context_display',
            'subtasks_count', 'comments_count', 'attachments_count'
        ]

    def get_subtasks_count(self, obj):
        return obj.subtasks.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_attachments_count(self, obj):
        return obj.attachments.count()


class TaskDetailSerializer(TaskBasicSerializer):
    """Detailed task serializer with all relationships"""
    project = ProjectBasicSerializer(read_only=True)
    idea = IdeaBasicSerializer(read_only=True)
    parent_task = TaskBasicSerializer(read_only=True)
    subtasks = TaskBasicSerializer(many=True, read_only=True)
    dependencies = TaskBasicSerializer(many=True, read_only=True)
    dependent_tasks = TaskBasicSerializer(many=True, read_only=True)
    total_time_logged = serializers.SerializerMethodField()
    can_start = serializers.ReadOnlyField()
    blocked_dependencies = TaskBasicSerializer(many=True, read_only=True, source='get_blocked_dependencies')

    class Meta(TaskBasicSerializer.Meta):
        fields = TaskBasicSerializer.Meta.fields + [
            'subtasks', 'dependencies', 'dependent_tasks',
            'total_time_logged', 'can_start', 'blocked_dependencies'
        ]

    def get_total_time_logged(self, obj):
        return sum(log.hours for log in obj.time_logs.all())


class TaskCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating tasks"""
    assignee_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    task_list_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    project_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    idea_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    parent_task_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    dependency_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False, 
        allow_empty=True
    )

    class Meta:
        model = Task
        fields = [
            'title', 'description', 'status', 'priority',
            'due_date', 'start_date', 'estimated_hours', 'tags',
            'assignee_id', 'task_list_id', 'project_id', 'idea_id', 
            'parent_task_id', 'dependency_ids'
        ]

    def validate_assignee_id(self, value):
        if value is not None:
            try:
                user = User.objects.get(id=value)
                return value
            except User.DoesNotExist:
                raise serializers.ValidationError("User not found")
        return value

    def create(self, validated_data):
        # Extract related field IDs
        assignee_id = validated_data.pop('assignee_id', None)
        task_list_id = validated_data.pop('task_list_id', None)
        project_id = validated_data.pop('project_id', None)
        idea_id = validated_data.pop('idea_id', None)
        parent_task_id = validated_data.pop('parent_task_id', None)
        dependency_ids = validated_data.pop('dependency_ids', [])

        # Set required fields
        validated_data['created_by'] = self.context['request'].user

        # Set context relationships
        if project_id:
            validated_data['project_id'] = project_id
        elif self.context.get('project'):
            validated_data['project'] = self.context['project']
        
        if idea_id:
            validated_data['idea_id'] = idea_id
        elif self.context.get('idea'):
            validated_data['idea'] = self.context['idea']

        # Set other optional relationships
        if assignee_id:
            validated_data['assignee_id'] = assignee_id
        if task_list_id:
            validated_data['task_list_id'] = task_list_id
        if parent_task_id:
            validated_data['parent_task_id'] = parent_task_id

        # Create task
        task = super().create(validated_data)

        # Set dependencies
        if dependency_ids:
            task.dependencies.set(dependency_ids)

        # Log activity
        from .models import TaskActivity
        context_desc = task.context_display
        TaskActivity.objects.create(
            task=task,
            action='created',
            description=f'Task "{task.title}" was created in {context_desc}',
            user=self.context['request'].user
        )

        return task


class TaskCommentSerializer(serializers.ModelSerializer):
    """Serializer for task comments"""
    author = UserBasicSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = TaskComment
        fields = [
            'id', 'content', 'author', 'parent', 
            'created_at', 'updated_at', 'replies'
        ]

    def get_replies(self, obj):
        if obj.replies.exists():
            return TaskCommentSerializer(obj.replies.all(), many=True, context=self.context).data
        return []

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        validated_data['task_id'] = self.context['task_id']
        return super().create(validated_data)


class TaskAttachmentSerializer(serializers.ModelSerializer):
    """Serializer for task attachments"""
    uploaded_by = UserBasicSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = TaskAttachment
        fields = [
            'id', 'file', 'file_url', 'original_name', 
            'file_size', 'file_type', 'uploaded_by', 'uploaded_at'
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None

    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        validated_data['task_id'] = self.context['task_id']
        
        # Extract file metadata
        file = validated_data['file']
        validated_data['original_name'] = file.name
        validated_data['file_size'] = file.size
        validated_data['file_type'] = file.content_type or 'application/octet-stream'
        
        return super().create(validated_data)


class TaskActivitySerializer(serializers.ModelSerializer):
    """Serializer for task activities"""
    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = TaskActivity
        fields = [
            'id', 'action', 'description', 'old_value', 
            'new_value', 'user', 'created_at'
        ]


class TaskTimeLogSerializer(serializers.ModelSerializer):
    """Serializer for time logs"""
    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = TaskTimeLog
        fields = [
            'id', 'description', 'hours', 'date', 
            'user', 'created_at'
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['task_id'] = self.context['task_id']
        return super().create(validated_data)


class TaskTemplateSerializer(serializers.ModelSerializer):
    """Serializer for task templates"""
    created_by = UserBasicSerializer(read_only=True)
    tag_list = serializers.SerializerMethodField()

    class Meta:
        model = TaskTemplate
        fields = [
            'id', 'name', 'description', 'title_template', 
            'description_template', 'priority', 'estimated_hours', 
            'tags', 'tag_list', 'created_by', 'is_public', 'created_at'
        ]

    def get_tag_list(self, obj):
        return [tag.strip() for tag in obj.tags.split(',') if tag.strip()]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskBulkUpdateSerializer(serializers.Serializer):
    """Serializer for bulk task operations"""
    task_ids = serializers.ListField(child=serializers.IntegerField())
    action = serializers.ChoiceField(choices=[
        'update_status', 'update_priority', 'update_assignee', 
        'update_task_list', 'add_tags', 'remove_tags', 'delete'
    ])
    value = serializers.CharField(required=False, allow_blank=True)

    def validate_task_ids(self, value):
        if not value:
            raise serializers.ValidationError("At least one task ID is required")
        return value

    def validate(self, data):
        action = data['action']
        value = data.get('value', '')

        if action in ['update_status', 'update_priority', 'update_assignee', 'update_task_list'] and not value:
            raise serializers.ValidationError(f"Value is required for action: {action}")

        # Validate specific action values
        if action == 'update_status' and value not in dict(Task.STATUS_CHOICES):
            raise serializers.ValidationError("Invalid status value")
        
        if action == 'update_priority' and value not in dict(Task.PRIORITY_CHOICES):
            raise serializers.ValidationError("Invalid priority value")

        return data
