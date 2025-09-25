# Import all views from individual modules
from .project_views import ProjectListCreateView, project_detail, project_stats
from .members_views import project_members, project_member_detail, search_users
from .file_views import project_files, project_file_detail
from .links_views import project_links, project_link_detail
from .activity_views import project_activities
from .topic_views import (
    project_topics, topic_detail, topic_notes, topic_note_detail,
    topic_links, topic_link_detail, topic_media, topic_media_detail,
    topic_comments, topic_comment_detail, topic_tags, topic_tag_detail
)

# Import the helper function
from ..ProjectHelper import log_project_activity

# Make all views available when importing from views package
__all__ = [
    # Project views
    'ProjectListCreateView',
    'project_detail', 
    'project_stats',
    
    # Member views
    'project_members',
    'project_member_detail',
    'search_users',
    
    # File views
    'project_files',
    'project_file_detail',
    
    # Link views
    'project_links',
    'project_link_detail',
    
    # Activity views
    'project_activities',
    
    # Topic views
    'project_topics',
    'topic_detail',
    'topic_notes',
    'topic_note_detail',
    'topic_links',
    'topic_link_detail',
    'topic_media',
    'topic_media_detail',
    'topic_comments',
    'topic_comment_detail',
    'topic_tags',
    'topic_tag_detail',
    
    # Helper functions
    'log_project_activity',
]
