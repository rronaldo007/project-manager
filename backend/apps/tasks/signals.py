from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver
from django.utils import timezone
from django.db import models
from .models import Task, TaskActivity, TaskTimeLog


@receiver(post_save, sender=Task)
def log_task_changes(sender, instance, created, **kwargs):
    """Log task creation and status changes"""
    if created:
        # Task creation is already logged in the serializer
        return
    
    # Check if status changed to 'done'
    if instance.status == 'done' and not instance.completed_at:
        instance.completed_at = timezone.now()
        instance.save(update_fields=['completed_at'])


@receiver(post_save, sender=TaskTimeLog)
def update_task_actual_hours(sender, instance, **kwargs):
    """Update task's actual hours when time log is added/updated"""
    task = instance.task
    total_hours = task.time_logs.aggregate(
        total=models.Sum('hours')
    )['total'] or 0
    
    if task.actual_hours != total_hours:
        task.actual_hours = total_hours
        task.save(update_fields=['actual_hours'])


@receiver(post_delete, sender=TaskTimeLog)
def update_task_actual_hours_on_delete(sender, instance, **kwargs):
    """Update task's actual hours when time log is deleted"""
    task = instance.task
    total_hours = task.time_logs.aggregate(
        total=models.Sum('hours')
    )['total'] or 0
    
    task.actual_hours = total_hours
    task.save(update_fields=['actual_hours'])


@receiver(m2m_changed, sender=Task.dependencies.through)
def log_dependency_changes(sender, instance, action, pk_set, **kwargs):
    """Log when dependencies are added or removed"""
    if action == 'post_add' and pk_set:
        dependency_titles = Task.objects.filter(
            pk__in=pk_set
        ).values_list('title', flat=True)
        
        TaskActivity.objects.create(
            task=instance,
            action='dependency_added',
            description=f'Dependencies added: {", ".join(dependency_titles)}',
            user=instance.created_by  # Fallback user
        )
    
    elif action == 'post_remove' and pk_set:
        dependency_titles = Task.objects.filter(
            pk__in=pk_set
        ).values_list('title', flat=True)
        
        TaskActivity.objects.create(
            task=instance,
            action='dependency_removed',
            description=f'Dependencies removed: {", ".join(dependency_titles)}',
            user=instance.created_by  # Fallback user
        )
