from .models import ProjectActivity

def log_project_activity(project, user, action, description):
    """
    Helper function to automatically log project activities
    """
    ProjectActivity.objects.create(
        project=project,
        user=user,
        action=action,
        description=description
    )
