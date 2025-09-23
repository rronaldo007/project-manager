from django.contrib import admin
from .models import Task, TaskComment, TaskAttachment


class TaskCommentInline(admin.TabularInline):
    model = TaskComment
    extra = 0
    readonly_fields = ['created_at', 'updated_at']


class TaskAttachmentInline(admin.TabularInline):
    model = TaskAttachment
    extra = 0
    readonly_fields = ['uploaded_at']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'assigned_to', 'created_by', 'status', 'priority', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'project', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'project__title', 'assigned_to__username', 'created_by__username']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [TaskCommentInline, TaskAttachmentInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'project')
        }),
        ('Assignment & Status', {
            'fields': ('assigned_to', 'created_by', 'status', 'priority')
        }),
        ('Timeline & Effort', {
            'fields': ('due_date', 'estimated_hours', 'actual_hours', 'completed_at')
        }),
        ('Hierarchy', {
            'fields': ('parent_task',),
            'classes': ['collapse']
        }),
        ('Additional Information', {
            'fields': ('tags',),
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ['collapse']
        })
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('project', 'assigned_to', 'created_by', 'parent_task')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if 'parent_task' in form.base_fields:
            form.base_fields['parent_task'].queryset = Task.objects.filter(parent_task=None)
        return form


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'author', 'content_preview', 'created_at']
    list_filter = ['created_at', 'task__project']
    search_fields = ['content', 'task__title', 'author__username']
    readonly_fields = ['created_at', 'updated_at']

    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('task', 'author')


@admin.register(TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = ['filename', 'task', 'uploaded_by', 'uploaded_at']
    list_filter = ['uploaded_at', 'task__project']
    search_fields = ['filename', 'task__title', 'uploaded_by__username']
    readonly_fields = ['uploaded_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('task', 'uploaded_by')
