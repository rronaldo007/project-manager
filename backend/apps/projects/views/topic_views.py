from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Project, ProjectTopic, TopicNote, TopicLink, TopicMedia, TopicTag, TopicComment
from ..serializers import (
    ProjectTopicSerializer, 
    ProjectTopicDetailSerializer,
    TopicNoteSerializer,
    TopicLinkSerializer,
    TopicMediaSerializer,
    TopicTagSerializer,
    TopicCommentSerializer
)
from ..ProjectHelper import log_project_activity


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def project_topics(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        topics = project.topics.all()
        serializer = ProjectTopicSerializer(topics, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProjectTopicSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            topic = serializer.save(project=project)
            
            # Log the activity
            log_project_activity(
                project=project,
                user=request.user,
                action="Created topic",
                description=f"Created topic: {topic.title}"
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def topic_detail(request, project_id, topic_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProjectTopicDetailSerializer(topic)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProjectTopicSerializer(topic, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            log_project_activity(
                project=project,
                user=request.user,
                action="Updated topic",
                description=f"Updated topic: {topic.title}"
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        topic_title = topic.title
        topic.delete()
        
        log_project_activity(
            project=project,
            user=request.user,
            action="Deleted topic",
            description=f"Deleted topic: {topic_title}"
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)


# Notes endpoints
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def topic_notes(request, project_id, topic_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        notes = topic.notes.all()
        serializer = TopicNoteSerializer(notes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicNoteSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            note = serializer.save(topic=topic)
            
            log_project_activity(
                project=project,
                user=request.user,
                action="Added note",
                description=f"Added note '{note.title}' to topic '{topic.title}'"
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Media endpoints
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def topic_media(request, project_id, topic_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        media = topic.media.all()
        serializer = TopicMediaSerializer(media, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicMediaSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            media_item = serializer.save(topic=topic)
            
            log_project_activity(
                project=project,
                user=request.user,
                action="Added media",
                description=f"Added {media_item.media_type} '{media_item.title}' to topic '{topic.title}'"
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def topic_note_detail(request, project_id, topic_id, note_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    note = get_object_or_404(TopicNote, pk=note_id, topic=topic)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = TopicNoteSerializer(note)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicNoteSerializer(note, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            
            log_project_activity(
                project=project,
                user=request.user,
                action="Updated note",
                description=f"Updated note '{note.title}' in topic '{topic.title}'"
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        note_title = note.title
        note.delete()
        
        log_project_activity(
            project=project,
            user=request.user,
            action="Deleted note",
            description=f"Deleted note '{note_title}' from topic '{topic.title}'"
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def topic_links(request, project_id, topic_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        links = topic.topic_links.all()
        serializer = TopicLinkSerializer(links, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicLinkSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            link = serializer.save(topic=topic)
            
            log_project_activity(
                project=project,
                user=request.user,
                action="Added topic link",
                description=f"Added link '{link.title}' to topic '{topic.title}'"
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def topic_comments(request, project_id, topic_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # Only get top-level comments (replies are nested in serializer)
        comments = topic.comments.filter(parent=None)
        serializer = TopicCommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = TopicCommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            comment = serializer.save(topic=topic)
            
            log_project_activity(
                project=project,
                user=request.user,
                action="Added comment",
                description=f"Commented on topic '{topic.title}'"
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def topic_tags(request, project_id, topic_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        tags = topic.tags.all()
        serializer = TopicTagSerializer(tags, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicTagSerializer(data=request.data)
        if serializer.is_valid():
            tag = serializer.save(topic=topic)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def topic_link_detail(request, project_id, topic_id, link_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    link = get_object_or_404(TopicLink, pk=link_id, topic=topic)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = TopicLinkSerializer(link)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicLinkSerializer(link, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            log_project_activity(
                project=project,
                user=request.user,
                action="Updated topic link",
                description=f"Updated link '{link.title}' in topic '{topic.title}'"
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        link_title = link.title
        link.delete()
        
        log_project_activity(
            project=project,
            user=request.user,
            action="Deleted topic link",
            description=f"Deleted link '{link_title}' from topic '{topic.title}'"
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def topic_media_detail(request, project_id, topic_id, media_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    media = get_object_or_404(TopicMedia, pk=media_id, topic=topic)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = TopicMediaSerializer(media)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicMediaSerializer(media, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            log_project_activity(
                project=project,
                user=request.user,
                action="Updated topic media",
                description=f"Updated {media.media_type} '{media.title}' in topic '{topic.title}'"
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        media_title = media.title
        media_type = media.media_type
        media.delete()
        
        log_project_activity(
            project=project,
            user=request.user,
            action="Deleted topic media",
            description=f"Deleted {media_type} '{media_title}' from topic '{topic.title}'"
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def topic_comment_detail(request, project_id, topic_id, comment_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    comment = get_object_or_404(TopicComment, pk=comment_id, topic=topic)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = TopicCommentSerializer(comment)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Only comment author can edit their own comments
        if comment.author != request.user:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicCommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Comment author or project owner/editors can delete
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if not (comment.author == request.user or user_role in ['owner', 'editor']):
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        comment.delete()
        
        log_project_activity(
            project=project,
            user=request.user,
            action="Deleted comment",
            description=f"Deleted comment in topic '{topic.title}'"
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def topic_tag_detail(request, project_id, topic_id, tag_id):
    project = get_object_or_404(Project, pk=project_id)
    topic = get_object_or_404(ProjectTopic, pk=topic_id, project=project)
    tag = get_object_or_404(TopicTag, pk=tag_id, topic=topic)
    
    # Check permissions
    if not (project.owner == request.user or 
            project.memberships.filter(user=request.user).exists()):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = TopicTagSerializer(tag)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TopicTagSerializer(tag, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check write permissions
        membership = project.memberships.filter(user=request.user).first()
        user_role = 'owner' if project.owner == request.user else membership.role if membership else None
        
        if user_role not in ['owner', 'editor']:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        tag_name = tag.name
        tag.delete()
        
        log_project_activity(
            project=project,
            user=request.user,
            action="Removed tag",
            description=f"Removed tag '{tag_name}' from topic '{topic.title}'"
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)
