from django.contrib import admin
from .models import Document, DocumentVersion, DocumentShare


class DocumentVersionInline(admin.TabularInline):
    model = DocumentVersion
    extra = 0
    readonly_fields = ['created_at']


class DocumentShareInline(admin.TabularInline):
    model = DocumentShare
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'document_type', 'uploaded_by', 'is_public', 'version', 'created_at']
    list_filter = ['document_type', 'is_public', 'project', 'created_at']
    search_fields = ['title', 'description', 'project__title', 'uploaded_by__username']
    readonly_fields = ['file_size', 'mime_type', 'created_at', 'updated_at']
    inlines = [DocumentVersionInline, DocumentShareInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'project', 'uploaded_by')
        }),
        ('Document Details', {
            'fields': ('document_type', 'version', 'is_public')
        }),
        ('File Information', {
            'fields': ('file', 'external_url', 'content'),
            'classes': ['collapse']
        }),
        ('Metadata', {
            'fields': ('file_size', 'mime_type', 'tags'),
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ['collapse']
        })
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('project', 'uploaded_by')


@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ['document', 'version_number', 'created_by', 'created_at']
    list_filter = ['created_at', 'document__project']
    search_fields = ['document__title', 'version_number', 'change_notes']
    readonly_fields = ['created_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('document', 'created_by')


@admin.register(DocumentShare)
class DocumentShareAdmin(admin.ModelAdmin):
    list_display = ['document', 'shared_with', 'permission', 'shared_by', 'expires_at', 'created_at']
    list_filter = ['permission', 'created_at', 'expires_at']
    search_fields = ['document__title', 'shared_with__username', 'shared_by__username']
    readonly_fields = ['created_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('document', 'shared_with', 'shared_by')
