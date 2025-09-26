# backend/apps/ideas/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Idea, IdeaMembership, IdeaNote, IdeaResource


@admin.register(Idea)
class IdeaAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'owner', 'status', 'priority', 'projects_count', 
        'notes_count', 'resources_count', 'members_count', 'created_at'
    ]
    list_filter = ['status', 'priority', 'created_at', 'updated_at']
    search_fields = ['title', 'description', 'tags', 'owner__email']
    readonly_fields = ['created_at', 'updated_at', 'tag_list']
    filter_horizontal = ['projects']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'owner', 'status', 'priority')
        }),
        ('Problem & Solution', {
            'fields': ('problem_statement', 'solution_overview', 'target_audience'),
            'classes': ('collapse',)
        }),
        ('Business Analysis', {
            'fields': ('market_potential', 'revenue_model', 'competition_analysis'),
            'classes': ('collapse',)
        }),
        ('Technical Details', {
            'fields': ('technical_requirements', 'estimated_effort'),
            'classes': ('collapse',)
        }),
        ('Categorization', {
            'fields': ('tags', 'tag_list', 'projects')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def projects_count(self, obj):
        count = obj.projects.count()
        if count > 0:
            return format_html(
                '<span style="color: green; font-weight: bold;">{}</span>',
                count
            )
        return count
    projects_count.short_description = 'Projects'
    
    def notes_count(self, obj):
        count = obj.notes.count()
        if count > 0:
            return format_html(
                '<span style="color: blue; font-weight: bold;">{}</span>',
                count
            )
        return count
    notes_count.short_description = 'Notes'
    
    def resources_count(self, obj):
        count = obj.resources.count()
        if count > 0:
            return format_html(
                '<span style="color: orange; font-weight: bold;">{}</span>',
                count
            )
        return count
    resources_count.short_description = 'Resources'
    
    def members_count(self, obj):
        count = obj.memberships.count()
        if count > 0:
            return format_html(
                '<span style="color: purple; font-weight: bold;">{}</span>',
                count
            )
        return count
    members_count.short_description = 'Members'
    
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related(
            'projects', 'notes', 'resources', 'memberships'
        )


@admin.register(IdeaMembership)
class IdeaMembershipAdmin(admin.ModelAdmin):
    list_display = ['idea', 'user', 'role', 'added_by', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['idea__title', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Membership Details', {
            'fields': ('idea', 'user', 'role', 'added_by')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'idea', 'user', 'added_by'
        )


@admin.register(IdeaNote)
class IdeaNoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'idea', 'author', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['title', 'content', 'idea__title', 'author__email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Note Details', {
            'fields': ('title', 'content', 'idea', 'author')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'idea', 'author'
        )


@admin.register(IdeaResource)
class IdeaResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'idea', 'resource_type', 'url_link', 'added_by', 'created_at']
    list_filter = ['resource_type', 'created_at']
    search_fields = ['title', 'url', 'description', 'idea__title', 'added_by__email']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Resource Details', {
            'fields': ('title', 'url', 'resource_type', 'description', 'idea', 'added_by')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def url_link(self, obj):
        if obj.url:
            return format_html(
                '<a href="{}" target="_blank" style="color: blue;">🔗 Visit</a>',
                obj.url
            )
        return '-'
    url_link.short_description = 'Link'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'idea', 'added_by'
        )


# Custom admin site configuration (optional)
admin.site.site_header = "Project Manager Admin"
admin.site.site_title = "Project Manager"
admin.site.index_title = "Welcome to Project Manager Administration"