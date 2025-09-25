from django.contrib import admin
from ..models import ProjectFile


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
