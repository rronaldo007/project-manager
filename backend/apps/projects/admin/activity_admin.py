from django.contrib import admin
from ..models import ProjectActivity


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
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
