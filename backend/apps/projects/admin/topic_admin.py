from django.contrib import admin
from ..models import ProjectTopic, TopicNote, TopicLink, TopicMedia, TopicTag, TopicComment


@admin.register(ProjectTopic)
class ProjectTopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'color_display', 'created_by', 'notes_count', 'created_at']
    list_filter = ['created_at', 'updated_at', 'project__status']
    search_fields = ['title', 'description', 'project__title', 'created_by__email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-updated_at']
    list_per_page = 30
    
    def color_display(self, obj):
        return f'<div style="width: 20px; height: 20px; background-color: {obj.color}; border-radius: 50%; display: inline-block;"></div> {obj.color}'
    color_display.allow_tags = True
    color_display.short_description = "Color"
    
    def notes_count(self, obj):
        return obj.notes.count()
    notes_count.short_description = "Notes"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('project', 'created_by').prefetch_related('notes')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'project', 'created_by')
        }),
        ('Appearance', {
            'fields': ('color',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TopicNote)
class TopicNoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'topic', 'created_by', 'last_edited_by', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at', 'topic__project']
    search_fields = ['title', 'content', 'topic__title', 'created_by__email']
    readonly_fields = ['created_at', 'updated_at', 'created_by']
    ordering = ['-updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('topic', 'created_by', 'last_edited_by')
    
    fieldsets = (
        ('Note Information', {
            'fields': ('title', 'content', 'topic')
        }),
        ('Metadata', {
            'fields': ('created_by', 'last_edited_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TopicLink)
class TopicLinkAdmin(admin.ModelAdmin):
    list_display = ['title', 'topic', 'link_type', 'url_display', 'created_by', 'created_at']
    list_filter = ['link_type', 'created_at', 'topic__project']
    search_fields = ['title', 'url', 'description', 'topic__title', 'created_by__email']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def url_display(self, obj):
        if len(obj.url) > 60:
            return obj.url[:57] + "..."
        return obj.url
    url_display.short_description = "URL"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('topic', 'created_by')


@admin.register(TopicMedia)
class TopicMediaAdmin(admin.ModelAdmin):
    list_display = ['title', 'topic', 'media_type', 'file_size_display', 'duration_display', 'uploaded_by', 'uploaded_at']
    list_filter = ['media_type', 'uploaded_at', 'topic__project']
    search_fields = ['title', 'description', 'topic__title', 'uploaded_by__email']
    readonly_fields = ['uploaded_at', 'file_size', 'media_type']
    ordering = ['-uploaded_at']
    
    def file_size_display(self, obj):
        if obj.file_size:
            if obj.file_size < 1024:
                return f"{obj.file_size} B"
            elif obj.file_size < 1024**2:
                return f"{obj.file_size/1024:.1f} KB"
            elif obj.file_size < 1024**3:
                return f"{obj.file_size/(1024**2):.1f} MB"
            else:
                return f"{obj.file_size/(1024**3):.1f} GB"
        return "Unknown"
    file_size_display.short_description = "File Size"
    
    def duration_display(self, obj):
        if obj.duration:
            total_seconds = int(obj.duration.total_seconds())
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60
            if hours > 0:
                return f"{hours}:{minutes:02d}:{seconds:02d}"
            else:
                return f"{minutes}:{seconds:02d}"
        return "-"
    duration_display.short_description = "Duration"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('topic', 'uploaded_by')


@admin.register(TopicTag)
class TopicTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'topic', 'color_display', 'created_at']
    list_filter = ['created_at', 'topic__project']
    search_fields = ['name', 'topic__title']
    ordering = ['topic', 'name']
    
    def color_display(self, obj):
        return f'<div style="width: 15px; height: 15px; background-color: {obj.color}; border-radius: 3px; display: inline-block;"></div> {obj.color}'
    color_display.allow_tags = True
    color_display.short_description = "Color"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('topic')


@admin.register(TopicComment)
class TopicCommentAdmin(admin.ModelAdmin):
    list_display = ['content_preview', 'topic', 'author', 'parent', 'replies_count', 'created_at']
    list_filter = ['created_at', 'updated_at', 'topic__project']
    search_fields = ['content', 'topic__title', 'author__email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    def content_preview(self, obj):
        if len(obj.content) > 50:
            return obj.content[:47] + "..."
        return obj.content
    content_preview.short_description = "Content"
    
    def replies_count(self, obj):
        return obj.replies.count()
    replies_count.short_description = "Replies"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('topic', 'author', 'parent').prefetch_related('replies')
