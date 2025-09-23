from django.contrib import admin
from .models import Team, TeamMembership, ProjectComment, Notification, ActivityLog


class TeamMembershipInline(admin.TabularInline):
    model = TeamMembership
    extra = 0
    readonly_fields = ['joined_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'member_count', 'project_count', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'description', 'owner__username']
    filter_horizontal = ['projects']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [TeamMembershipInline]

    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = 'Members'

    def project_count(self, obj):
        return obj.projects.count()
    project_count.short_description = 'Projects'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('owner').prefetch_related('members', 'projects')


@admin.register(TeamMembership)
class TeamMembershipAdmin(admin.ModelAdmin):
    list_display = ['user', 'team', 'role', 'joined_at']
    list_filter = ['role', 'joined_at', 'team']
    search_fields = ['user__username', 'user__email', 'team__name']
    readonly_fields = ['joined_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'team')


@admin.register(ProjectComment)
class ProjectCommentAdmin(admin.ModelAdmin):
    list_display = ['project', 'author', 'content_preview', 'is_internal', 'created_at']
    list_filter = ['is_internal', 'created_at', 'project']
    search_fields = ['content', 'project__title', 'author__username']
    readonly_fields = ['created_at', 'updated_at']

    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('project', 'author', 'parent_comment')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'recipient', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'message', 'recipient__username', 'sender__username']
    readonly_fields = ['created_at']

    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected notifications as read"

    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
    mark_as_unread.short_description = "Mark selected notifications as unread"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('recipient', 'sender', 'project', 'task')


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action_type', 'object_type', 'description_preview', 'project', 'timestamp']
    list_filter = ['action_type', 'object_type', 'timestamp', 'project']
    search_fields = ['description', 'user__username', 'project__title']
    readonly_fields = ['timestamp']

    def description_preview(self, obj):
        return obj.description[:50] + "..." if len(obj.description) > 50 else obj.description
    description_preview.short_description = 'Description'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'project')
