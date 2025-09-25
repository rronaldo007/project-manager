from django.contrib import admin
from .models import Project, ProjectMembership, ProjectFile, ProjectLink, ProjectActivity

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'priority', 'owner', 'progress', 'created_at', 'due_date']
    list_filter = ['status', 'priority', 'created_at', 'owner']
    search_fields = ['title', 'description', 'owner__email', 'owner__first_name', 'owner__last_name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    list_per_page = 25
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'owner')
        }),
        ('Project Details', {
            'fields': ('status', 'priority', 'progress', 'due_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ProjectMembership)
class ProjectMembershipAdmin(admin.ModelAdmin):
    list_display = ['project', 'user', 'role', 'created_at']
    list_filter = ['role', 'created_at', 'project__status']
    search_fields = ['project__title', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('project', 'user')

@admin.register(ProjectFile)
class ProjectFileAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'file_type', 'file_size_display', 'uploaded_by', 'uploaded_at']
    list_filter = ['file_type', 'uploaded_at', 'project__status']
    search_fields = ['title', 'description', 'project__title', 'uploaded_by__email']
    readonly_fields = ['uploaded_at', 'file_size', 'file_type']
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
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('project', 'uploaded_by')

@admin.register(ProjectLink)
class ProjectLinkAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'url_display', 'created_by', 'created_at']
    list_filter = ['created_at', 'project__status']
    search_fields = ['title', 'description', 'url', 'project__title', 'created_by__email']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def url_display(self, obj):
        if len(obj.url) > 50:
            return obj.url[:47] + "..."
        return obj.url
    url_display.short_description = "URL"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('project', 'created_by')

@admin.register(ProjectActivity)
class ProjectActivityAdmin(admin.ModelAdmin):
    list_display = ['project', 'action', 'user', 'created_at']
    list_filter = ['action', 'created_at', 'project__status', 'user']
    search_fields = ['action', 'description', 'project__title', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    list_per_page = 50
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('project', 'user')
    
    # Make it read-only since activities are auto-generated
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser  # Only superusers can delete activities

# Custom admin site configuration
admin.site.site_header = "Project Manager Admin"
admin.site.site_title = "Project Manager"
admin.site.index_title = "Project Management Dashboard"