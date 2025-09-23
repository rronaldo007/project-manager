from django.contrib import admin
from .models import Project, BusinessPlan, ProjectLink, ProjectMilestone


class ProjectLinkInline(admin.TabularInline):
    model = ProjectLink
    extra = 0


class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 0


class BusinessPlanInline(admin.StackedInline):
    model = BusinessPlan
    extra = 0


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'status', 'priority', 'progress', 'start_date', 'deadline', 'created_at']
    list_filter = ['status', 'priority', 'is_archived', 'created_at', 'start_date']
    search_fields = ['title', 'description', 'owner__username', 'owner__email']
    filter_horizontal = ['members']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [BusinessPlanInline, ProjectLinkInline, ProjectMilestoneInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'owner')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority', 'progress')
        }),
        ('Team & Collaboration', {
            'fields': ('members',)
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'deadline')
        }),
        ('Additional Information', {
            'fields': ('budget', 'tags', 'is_archived'),
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ['collapse']
        })
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('owner').prefetch_related('members')


@admin.register(BusinessPlan)
class BusinessPlanAdmin(admin.ModelAdmin):
    list_display = ['project', 'created_at', 'updated_at']
    search_fields = ['project__title', 'executive_summary']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Project', {
            'fields': ('project',)
        }),
        ('Business Overview', {
            'fields': ('executive_summary', 'target_audience', 'market_analysis')
        }),
        ('Business Model', {
            'fields': ('revenue_model', 'marketing_strategy')
        }),
        ('Financial & Risk', {
            'fields': ('financial_projections', 'risk_analysis')
        }),
        ('Implementation', {
            'fields': ('implementation_timeline',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ['collapse']
        })
    )


@admin.register(ProjectLink)
class ProjectLinkAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'url', 'created_at']
    list_filter = ['created_at', 'project']
    search_fields = ['title', 'project__title', 'description']
    readonly_fields = ['created_at']


@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'due_date', 'is_completed', 'completed_at']
    list_filter = ['is_completed', 'due_date', 'created_at']
    search_fields = ['title', 'project__title', 'description']
    readonly_fields = ['created_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('project')
