from django.contrib import admin
from .models import Project, ProjectActivity, ProjectLink

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'status', 'priority', 'progress_percentage', 'start_date', 'end_date', 'created_at']
    list_filter = ['status', 'priority', 'owner', 'created_at']
    search_fields = ['title', 'description', 'owner__username', 'owner__email']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['members']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'owner')
        }),
        ('Project Settings', {
            'fields': ('status', 'priority', 'progress_percentage')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date')
        }),
        ('Team', {
            'fields': ('members',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new project
            obj.owner = request.user
        super().save_model(request, obj, form, change)

@admin.register(ProjectActivity)
class ProjectActivityAdmin(admin.ModelAdmin):
    list_display = ['project', 'user', 'activity_type', 'created_at']
    list_filter = ['activity_type', 'created_at', 'project']
    search_fields = ['project__title', 'user__username', 'description']
    readonly_fields = ['created_at']
    raw_id_fields = ['project', 'user']
    
    fieldsets = (
        ('Activity Details', {
            'fields': ('project', 'user', 'activity_type', 'description')
        }),
        ('Metadata', {
            'fields': ('metadata',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(ProjectLink)
class ProjectLinkAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'link_type', 'is_active', 'created_at', 'created_by']
    list_filter = ['link_type', 'is_active', 'created_at']
    search_fields = ['title', 'url', 'project__title', 'description']
    readonly_fields = ['created_at', 'created_by']
    raw_id_fields = ['project', 'created_by']
    
    fieldsets = (
        ('Link Information', {
            'fields': ('project', 'title', 'url', 'link_type', 'description')
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new link
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
