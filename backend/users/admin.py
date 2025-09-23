from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.db.models import Q, Case, When, Value, CharField
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'company', 'role', 'professional_status', 'is_staff', 'is_active', 'created_at']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'company', 'created_at', 'last_login']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'company', 'role', 'location', 'phone']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'last_login', 'date_joined']

    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email', 'bio', 'avatar')
        }),
        ('Professional info', {
            'fields': ('company', 'role', 'location', 'phone'),
            'description': 'Professional and contact information'
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ['collapse']
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at'),
            'classes': ['collapse']
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ['wide'],
            'fields': ['username', 'email', 'first_name', 'last_name', 'password1', 'password2'],
        }),
        ('Professional info', {
            'classes': ['wide'],
            'fields': ['company', 'role', 'location', 'phone'],
        }),
    )

    def professional_status(self, obj):
        """Display professional profile completion status"""
        fields = [obj.phone, obj.company, obj.role, obj.location]
        completed = sum(1 for field in fields if field and field.strip())
        total = len(fields)
        percentage = (completed / total) * 100

        if percentage == 100:
            color = 'green'
            status = 'Complete'
        elif percentage >= 50:
            color = 'orange'
            status = 'Partial'
        else:
            color = 'red'
            status = 'Incomplete'

        return format_html(
            '<span style="color: {}; font-weight: bold;">{} ({}%)</span>',
            color, status, int(percentage)
        )
    professional_status.short_description = 'Professional Profile'

    def get_full_name(self, obj):
        """Display full name"""
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    get_full_name.short_description = 'Full Name'

    def professional_title(self, obj):
        """Display professional title"""
        if obj.role and obj.company:
            return f"{obj.role} at {obj.company}"
        elif obj.role:
            return obj.role
        elif obj.company:
            return f"Professional at {obj.company}"
        else:
            return "-"
    professional_title.short_description = 'Professional Title'

    def contact_info(self, obj):
        """Display contact information"""
        contact_parts = []
        if obj.phone:
            contact_parts.append(f"📞 {obj.phone}")
        if obj.location:
            contact_parts.append(f"📍 {obj.location}")
        return format_html('<br>'.join(contact_parts)) if contact_parts else '-'
    contact_info.short_description = 'Contact Info'

    # Add professional fields to the change list filters
    def get_list_filter(self, request):
        filters = list(super().get_list_filter(request))
        # Add custom filters for professional fields
        return filters + ['company', 'role']

    # Custom actions for admin
    actions = ['mark_professional_complete', 'export_professional_info']

    def mark_professional_complete(self, request, queryset):
        """Admin action to mark users with complete professional info"""
        count = 0
        for user in queryset:
            if all([user.phone, user.company, user.role, user.location]):
                count += 1

        if count == 0:
            self.message_user(request, "No users have complete professional information.")
        else:
            self.message_user(request, f"{count} users have complete professional information.")
    mark_professional_complete.short_description = "Check professional completeness"

    def export_professional_info(self, request, queryset):
        """Admin action to export professional information"""
        import csv
        from django.http import HttpResponse

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="professional_info.csv"'

        writer = csv.writer(response)
        writer.writerow(['Email', 'Name', 'Company', 'Role', 'Location', 'Phone', 'Profile Complete'])

        for user in queryset:
            fields = [user.phone, user.company, user.role, user.location]
            completed = sum(1 for field in fields if field and field.strip())
            profile_complete = 'Yes' if completed == 4 else f'{completed}/4'

            writer.writerow([
                user.email,
                f"{user.first_name} {user.last_name}".strip() or user.username,
                user.company or '',
                user.role or '',
                user.location or '',
                user.phone or '',
                profile_complete
            ])

        return response
    export_professional_info.short_description = "Export professional info to CSV"

    # Override the queryset to add custom annotations
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(
            professional_completeness=Case(
                When(Q(phone__isnull=False) & Q(company__isnull=False) &
                     Q(role__isnull=False) & Q(location__isnull=False) &
                     ~Q(phone='') & ~Q(company='') & ~Q(role='') & ~Q(location=''),
                     then=Value('Complete')),
                When(Q(phone__isnull=True) & Q(company__isnull=True) &
                     Q(role__isnull=True) & Q(location__isnull=True),
                     then=Value('Empty')),
                default=Value('Partial'),
                output_field=CharField()
            )
        )

    # Add help text for professional fields
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if 'phone' in form.base_fields:
            form.base_fields['phone'].help_text = 'Professional contact number'
        if 'company' in form.base_fields:
            form.base_fields['company'].help_text = 'Company or organization name'
        if 'role' in form.base_fields:
            form.base_fields['role'].help_text = 'Job title or professional role'
        if 'location' in form.base_fields:
            form.base_fields['location'].help_text = 'Work location or city'
        return form
