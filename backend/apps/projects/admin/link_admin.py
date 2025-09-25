from django.contrib import admin
from ..models import ProjectLink


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
