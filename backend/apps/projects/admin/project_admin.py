from django.contrib import admin
from ..models import Project, ProjectMembership


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
