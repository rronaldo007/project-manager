# Complete Project Manager API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication System](#authentication-system)
3. [Authentication Endpoints](#authentication-endpoints)
4. [Project Management Endpoints](#project-management-endpoints)
5. [Project Membership Endpoints](#project-membership-endpoints)
6. [Project Activity Endpoints](#project-activity-endpoints)
7. [Project Files Endpoints](#project-files-endpoints)
8. [Project Links Endpoints](#project-links-endpoints)
9. [User Management Endpoints](#user-management-endpoints)
10. [Error Handling](#error-handling)
11. [Usage Examples](#usage-examples)

## Overview

**Base URL**: `http://localhost:8000`
**API Version**: v1
**Authentication**: Session-based with CSRF protection
**Content Type**: `application/json`

### Core Features
- User authentication and registration
- Project creation and management
- Team collaboration with role-based permissions
- Project activity tracking
- File and link management per project
- Dashboard statistics and analytics

### Permission Levels
- **Owner**: Full project control including team management and deletion
- **Editor**: Can view and modify project content
- **Viewer**: Read-only access to project information

## Authentication System

The API uses Django's session-based authentication with automatic CSRF protection. Sessions persist for 24 hours by default.

### Session Flow
1. User registers or logs in
2. Server creates session cookie
3. All subsequent requests include session cookie
4. Session expires after inactivity or explicit logout

## Authentication Endpoints

### Register User
Creates a new user account and establishes a session.

```
POST /api/auth/register/
```

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securePassword123",
  "confirm_password": "securePassword123"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_joined": "2025-09-25T14:16:19.523699Z"
  },
  "message": "User registered successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Email already exists, passwords don't match
```json
{
  "email": ["A user with this email already exists."]
}
```

### Login User
Authenticates existing user and creates session.

```
POST /api/auth/login/
```

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_joined": "2025-09-25T14:16:19.523699Z"
  },
  "message": "Login successful"
}
```

### Get Current User
Returns authenticated user information.

```
GET /api/auth/me/
```

**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "date_joined": "2025-09-25T14:16:19.523699Z"
}
```

### Logout User
Terminates user session.

```
POST /api/auth/logout/
```

**Authentication**: Required

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

## Project Management Endpoints

### List Projects
Get all projects accessible to the authenticated user.

```
GET /api/projects/
```

**Authentication**: Required

**Query Parameters**:
- `status`: Filter by project status (`planning`, `in_progress`, `on_hold`, `completed`)
- `priority`: Filter by priority (`low`, `medium`, `high`)
- `search`: Search in project titles and descriptions

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "E-commerce Platform",
    "description": "Building a modern e-commerce platform with React and Django",
    "status": "in_progress",
    "priority": "high",
    "owner": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    "created_at": "2025-09-25T14:16:19.523699Z",
    "updated_at": "2025-09-25T16:30:45.123456Z",
    "due_date": "2025-12-31T23:59:59Z",
    "progress": 35,
    "memberships": [
      {
        "id": 1,
        "user": {
          "id": 2,
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane.smith@example.com"
        },
        "role": "editor",
        "created_at": "2025-09-25T15:00:00Z"
      }
    ],
    "user_role": "owner"
  }
]
```

### Create Project
Create a new project owned by the authenticated user.

```
POST /api/projects/
```

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Mobile App Development",
  "description": "Native iOS and Android app for our platform",
  "status": "planning",
  "priority": "medium",
  "due_date": "2026-06-30T23:59:59Z",
  "progress": 0
}
```

**Response** (201 Created): Same format as single project in list response

### Get Project Details
Retrieve detailed information about a specific project.

```
GET /api/projects/{id}/
```

**Authentication**: Required
**Permissions**: User must have read access (owner, editor, or viewer)

**Response** (200 OK): Same format as single project in list response

### Update Project
Modify project information.

```
PUT /api/projects/{id}/
PATCH /api/projects/{id}/
```

**Authentication**: Required
**Permissions**: User must have write access (owner or editor)

**Request Body** (PATCH example):
```json
{
  "status": "in_progress",
  "progress": 25,
  "description": "Updated project description"
}
```

**Response** (200 OK): Updated project data

### Delete Project
Permanently delete a project.

```
DELETE /api/projects/{id}/
```

**Authentication**: Required
**Permissions**: Only project owner

**Response** (204 No Content): Empty response

### Project Statistics
Get dashboard statistics for user's projects.

```
GET /api/projects/stats/
```

**Authentication**: Required

**Response** (200 OK):
```json
{
  "totalProjects": 12,
  "activeProjects": 5,
  "completedProjects": 4,
  "onHoldProjects": 2,
  "planningProjects": 1,
  "completedTasks": 47,
  "pendingTasks": 23,
  "averageProgress": 62.5,
  "projectsByPriority": {
    "high": 3,
    "medium": 6,
    "low": 3
  }
}
```

### Recent Projects
Get recently updated projects for dashboard.

```
GET /api/projects/recent/
```

**Authentication**: Required

**Query Parameters**:
- `limit`: Number of projects to return (default: 5)

**Response** (200 OK): Array of projects (same format as list)

## Project Membership Endpoints

### List Project Members
Get all team members for a specific project.

```
GET /api/projects/{project_id}/members/
```

**Authentication**: Required
**Permissions**: User must have read access to the project

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "user": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com"
    },
    "role": "editor",
    "created_at": "2025-09-25T15:00:00Z"
  },
  {
    "id": 2,
    "user": {
      "id": 3,
      "first_name": "Bob",
      "last_name": "Wilson",
      "email": "bob.wilson@example.com"
    },
    "role": "viewer",
    "created_at": "2025-09-25T15:30:00Z"
  }
]
```

### Add Project Member
Add a new team member to a project.

```
POST /api/projects/{project_id}/members/
```

**Authentication**: Required
**Permissions**: Only project owner

**Request Body**:
```json
{
  "user_email": "newteam@example.com",
  "role": "editor"
}
```

**Response** (201 Created): Newly created membership object

**Error Responses**:
```json
{
  "user_email": ["User with this email does not exist"]
}
```

### Update Member Role
Modify a team member's role.

```
PATCH /api/projects/{project_id}/members/{member_id}/
```

**Authentication**: Required
**Permissions**: Only project owner

**Request Body**:
```json
{
  "role": "viewer"
}
```

**Response** (200 OK): Updated membership object

### Remove Project Member
Remove a team member from a project.

```
DELETE /api/projects/{project_id}/members/{member_id}/
```

**Authentication**: Required
**Permissions**: Only project owner

**Response** (204 No Content): Empty response

### Search Users
Search for users to add to projects.

```
GET /api/projects/users/search/
```

**Authentication**: Required

**Query Parameters**:
- `q`: Search query (minimum 2 characters)

**Response** (200 OK):
```json
[
  {
    "id": 4,
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice.johnson@example.com"
  },
  {
    "id": 5,
    "first_name": "Charlie",
    "last_name": "Brown",
    "email": "charlie.brown@example.com"
  }
]
```

## Project Activity Endpoints

### List Project Activities
Get activity history for a project.

```
GET /api/projects/{project_id}/activities/
```

**Authentication**: Required
**Permissions**: User must have read access to the project

**Query Parameters**:
- `limit`: Number of activities to return (default: 50)
- `offset`: Pagination offset

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "action": "Project Updated",
    "description": "Project status changed from 'planning' to 'in_progress'",
    "created_at": "2025-09-25T16:30:45.123456Z",
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    }
  },
  {
    "id": 2,
    "action": "Member Added",
    "description": "Jane Smith was added as editor",
    "created_at": "2025-09-25T15:00:00Z",
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    }
  }
]
```

### Create Activity Log
Manually create an activity log entry.

```
POST /api/projects/{project_id}/activities/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Request Body**:
```json
{
  "action": "Custom Action",
  "description": "Custom activity description"
}
```

**Response** (201 Created): Created activity object

## Project Files Endpoints

### List Project Files
Get all files associated with a project.

```
GET /api/projects/{project_id}/files/
```

**Authentication**: Required
**Permissions**: User must have read access to the project

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Project Requirements",
    "file": "/media/project_files/requirements.pdf",
    "description": "Detailed project requirements document",
    "file_size": 2048576,
    "file_type": "application/pdf",
    "uploaded_at": "2025-09-25T14:30:00Z"
  }
]
```

### Upload Project File
Add a new file to a project.

```
POST /api/projects/{project_id}/files/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Content-Type**: `multipart/form-data`

**Request Body**:
```
title: Design Mockups
file: [binary file data]
description: UI/UX design mockups for the project
```

**Response** (201 Created): Created file object

### Update File Details
Modify file metadata.

```
PATCH /api/projects/{project_id}/files/{file_id}/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Request Body**:
```json
{
  "title": "Updated File Title",
  "description": "Updated description"
}
```

### Delete Project File
Remove a file from a project.

```
DELETE /api/projects/{project_id}/files/{file_id}/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Response** (204 No Content): Empty response

## Project Links Endpoints

### List Project Links
Get all links associated with a project.

```
GET /api/projects/{project_id}/links/
```

**Authentication**: Required
**Permissions**: User must have read access to the project

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "GitHub Repository",
    "url": "https://github.com/company/project-repo",
    "description": "Main project repository",
    "created_at": "2025-09-25T14:45:00Z"
  },
  {
    "id": 2,
    "title": "Design System",
    "url": "https://figma.com/design-system",
    "description": "UI design system and components",
    "created_at": "2025-09-25T15:15:00Z"
  }
]
```

### Add Project Link
Create a new link for a project.

```
POST /api/projects/{project_id}/links/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Request Body**:
```json
{
  "title": "API Documentation",
  "url": "https://docs.company.com/api",
  "description": "Complete API documentation and examples"
}
```

**Response** (201 Created): Created link object

### Update Project Link
Modify an existing project link.

```
PATCH /api/projects/{project_id}/links/{link_id}/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Request Body**:
```json
{
  "title": "Updated Link Title",
  "description": "Updated description"
}
```

### Delete Project Link
Remove a link from a project.

```
DELETE /api/projects/{project_id}/links/{link_id}/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Response** (204 No Content): Empty response

## User Management Endpoints

### List All Users
Get all users in the system (admin only).

```
GET /api/users/
```

**Authentication**: Required
**Permissions**: Admin only

### Get User Profile
Get detailed user information.

```
GET /api/users/{user_id}/
```

**Authentication**: Required
**Permissions**: User can view own profile or admin can view any

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "date_joined": "2025-09-25T14:16:19.523699Z",
  "last_login": "2025-09-25T16:00:00Z",
  "projects_owned": 5,
  "projects_member": 3
}
```

### Update User Profile
Modify user profile information.

```
PATCH /api/users/{user_id}/
```

**Authentication**: Required
**Permissions**: User can update own profile only

**Request Body**:
```json
{
  "first_name": "Johnny",
  "last_name": "Doe"
}
```

## Error Handling

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `204 No Content`: Successful deletion
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "detail": "Error message description",
  "field_errors": {
    "field_name": ["Field-specific error message"]
  },
  "non_field_errors": ["General error messages"]
}
```

### Common Error Scenarios

#### Authentication Errors
```json
{
  "detail": "Authentication credentials were not provided."
}
```

#### Permission Errors
```json
{
  "detail": "You do not have permission to perform this action."
}
```

#### Validation Errors
```json
{
  "title": ["This field is required."],
  "email": ["Enter a valid email address."]
}
```

## Usage Examples

### cURL Examples

#### Complete Authentication Flow
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "first_name": "Dev",
    "last_name": "User",
    "password": "securePass123",
    "confirm_password": "securePass123"
  }' \
  --cookie-jar cookies.txt

# Get current user
curl http://localhost:8000/api/auth/me/ --cookie cookies.txt

# Create project
curl -X POST http://localhost:8000/api/projects/ \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{
    "title": "API Integration Project",
    "description": "Integrating third-party APIs",
    "status": "planning",
    "priority": "high",
    "due_date": "2025-12-31T23:59:59Z"
  }'
```

#### Team Management
```bash
# Add team member
curl -X POST http://localhost:8000/api/projects/1/members/ \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{
    "user_email": "teammate@example.com",
    "role": "editor"
  }'

# List project activities
curl http://localhost:8000/api/projects/1/activities/ --cookie cookies.txt

# Add project link
curl -X POST http://localhost:8000/api/projects/1/links/ \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{
    "title": "Project Wiki",
    "url": "https://wiki.company.com/project1",
    "description": "Project documentation and wiki"
  }'
```

### JavaScript/Fetch Examples

#### Project Management
```javascript
// Get projects with filtering
const response = await fetch('/api/projects/?status=in_progress&priority=high', {
  credentials: 'include'
});
const projects = await response.json();

// Update project progress
const updateResponse = await fetch('/api/projects/1/', {
  method: 'PATCH',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    progress: 75,
    status: 'in_progress'
  })
});

// Upload file
const formData = new FormData();
formData.append('title', 'Project Specification');
formData.append('file', fileInput.files[0]);
formData.append('description', 'Technical specification document');

const uploadResponse = await fetch('/api/projects/1/files/', {
  method: 'POST',
  credentials: 'include',
  body: formData
});
```

#### Team Collaboration
```javascript
// Search users
const searchResponse = await fetch('/api/projects/users/search/?q=john', {
  credentials: 'include'
});
const users = await searchResponse.json();

// Get project activities
const activitiesResponse = await fetch('/api/projects/1/activities/', {
  credentials: 'include'
});
const activities = await activitiesResponse.json();

// Add custom activity
const activityResponse = await fetch('/api/projects/1/activities/', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'Milestone Completed',
    description: 'MVP development phase completed successfully'
  })
});
```

### React Hook Examples

```javascript
// Custom hook for project management
const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/projects/?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    const response = await fetch('/api/projects/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    
    if (response.ok) {
      fetchProjects(); // Refresh list
    }
    
    return response;
  }, [fetchProjects]);

  return { projects, loading, fetchProjects, createProject };
};
```

## Rate Limiting & Performance

- **Rate Limiting**: 100 requests per minute per user
- **File Upload Limit**: 50MB per file
- **Pagination**: Default page size of 20 items
- **Caching**: Project data cached for 5 minutes
- **Database Indexing**: Optimized queries on frequently accessed fields

## Security Considerations

- **CSRF Protection**: Enabled for all state-changing operations
- **XSS Protection**: All user input sanitized
- **SQL Injection**: Protected via ORM parameterized queries
- **File Upload Security**: File type validation and virus scanning
- **Session Security**: HttpOnly cookies, secure transmission
- **Permission Checks**: Enforced at both view and object level

This documentation covers all implemented endpoints and provides a foundation for future API extensions.

# Topic System Endpoints

## Overview
Topics serve as knowledge containers within projects, allowing teams to organize research, documentation, media, discussions, and resources into focused areas. Each topic can contain notes, links, media files, comments, and organizational tags.

## Topic Management Endpoints

### List Project Topics
Get all topics for a specific project.

```
GET /api/projects/{project_id}/topics/
```

**Authentication**: Required
**Permissions**: User must have read access to the project

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Research & Documentation",
    "description": "Gather research materials and create documentation",
    "color": "#3B82F6",
    "created_at": "2025-09-25T14:00:00Z",
    "updated_at": "2025-09-25T16:30:00Z",
    "created_by": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    "notes_count": 3,
    "links_count": 5,
    "media_count": 2,
    "comments_count": 8,
    "tags": [
      {
        "id": 1,
        "name": "high-priority",
        "color": "#EF4444",
        "created_at": "2025-09-25T15:00:00Z"
      }
    ]
  }
]
```

### Create Topic
Create a new topic within a project.

```
POST /api/projects/{project_id}/topics/
```

**Authentication**: Required
**Permissions**: User must have write access to the project (owner or editor)

**Request Body**:
```json
{
  "title": "Design System",
  "description": "UI components, design tokens, and style guidelines",
  "color": "#10B981"
}
```

**Response** (201 Created): Created topic object with same format as list response

### Get Topic Details
Retrieve comprehensive information about a specific topic including all related content.

```
GET /api/projects/{project_id}/topics/{topic_id}/
```

**Authentication**: Required
**Permissions**: User must have read access to the project

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Research & Documentation",
  "description": "Comprehensive research and documentation phase",
  "color": "#3B82F6",
  "created_at": "2025-09-25T14:00:00Z",
  "updated_at": "2025-09-25T16:30:00Z",
  "created_by": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "notes_count": 3,
  "links_count": 5,
  "media_count": 2,
  "comments_count": 8,
  "tags": [...],
  "notes": [...],
  "topic_links": [...],
  "media": [...],
  "comments": [...]
}
```

### Update Topic
Modify topic information.

```
PATCH /api/projects/{project_id}/topics/{topic_id}/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Request Body**:
```json
{
  "description": "Updated comprehensive research and documentation phase",
  "color": "#8B5CF6"
}
```

**Response** (200 OK): Updated topic object

### Delete Topic
Permanently delete a topic and all its content.

```
DELETE /api/projects/{project_id}/topics/{topic_id}/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Response** (204 No Content): Empty response

## Topic Notes Endpoints

### List Topic Notes
Get all notes within a specific topic.

```
GET /api/projects/{project_id}/topics/{topic_id}/notes/
```

**Authentication**: Required
**Permissions**: User must have read access to the project

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "API Requirements",
    "content": "# API Requirements\n\n- User authentication\n- Project management\n- Topic system with notes\n- File uploads",
    "created_at": "2025-09-25T14:30:00Z",
    "updated_at": "2025-09-25T16:00:00Z",
    "created_by": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    "last_edited_by": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com"
    }
  }
]
```

### Create Topic Note
Add a new note to a topic.

```
POST /api/projects/{project_id}/topics/{topic_id}/notes/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Request Body**:
```json
{
  "title": "Meeting Notes - Sprint Planning",
  "content": "## Sprint Planning Meeting\n\n### Key Decisions\n- Focus on authentication system\n- Implement topic management\n- Set up automated testing"
}
```

**Response** (201 Created): Created note object

### Get Note Details
Retrieve a specific note.

```
GET /api/projects/{project_id}/topics/{topic_id}/notes/{note_id}/
```

**Response** (200 OK): Single note object with same format as list response

### Update Note
Modify an existing note.

```
PATCH /api/projects/{project_id}/topics/{topic_id}/notes/{note_id}/
```

**Request Body**:
```json
{
  "content": "Updated note content with additional information..."
}
```

**Response** (200 OK): Updated note object with last_edited_by updated

### Delete Note
Remove a note from a topic.

```
DELETE /api/projects/{project_id}/topics/{topic_id}/notes/{note_id}/
```

**Response** (204 No Content): Empty response

## Topic Links Endpoints

### List Topic Links
Get all links within a specific topic.

```
GET /api/projects/{project_id}/topics/{topic_id}/links/
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Django REST Framework Docs",
    "url": "https://www.django-rest-framework.org/",
    "description": "Official DRF documentation for API development",
    "link_type": "reference",
    "created_at": "2025-09-25T15:00:00Z",
    "created_by": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    }
  }
]
```

### Create Topic Link
Add a new link to a topic.

```
POST /api/projects/{project_id}/topics/{topic_id}/links/
```

**Request Body**:
```json
{
  "title": "React Documentation",
  "url": "https://reactjs.org/docs/getting-started.html",
  "description": "Official React documentation and tutorials",
  "link_type": "reference"
}
```

**Link Types**: `reference`, `resource`, `tool`, `inspiration`, `other`

**Response** (201 Created): Created link object

### Update Topic Link
Modify an existing topic link.

```
PATCH /api/projects/{project_id}/topics/{topic_id}/links/{link_id}/
```

### Delete Topic Link
Remove a link from a topic.

```
DELETE /api/projects/{project_id}/topics/{topic_id}/links/{link_id}/
```

## Topic Media Endpoints

### List Topic Media
Get all media files within a specific topic.

```
GET /api/projects/{project_id}/topics/{topic_id}/media/
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Design Mockups",
    "file": "/media/topic_media/mockups.png",
    "media_type": "image",
    "description": "UI mockups for the authentication flow",
    "file_size": 1048576,
    "duration": null,
    "uploaded_at": "2025-09-25T14:45:00Z",
    "uploaded_by": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    }
  },
  {
    "id": 2,
    "title": "Team Meeting Recording",
    "file": "/media/topic_media/meeting_recording.mp3",
    "media_type": "audio",
    "description": "Sprint planning meeting discussion",
    "file_size": 15728640,
    "duration": "01:23:45",
    "uploaded_at": "2025-09-25T16:00:00Z",
    "uploaded_by": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com"
    }
  }
]
```

### Upload Topic Media
Add a new media file to a topic.

```
POST /api/projects/{project_id}/topics/{topic_id}/media/
```

**Content-Type**: `multipart/form-data`

**Request Body**:
```
title: Project Architecture Diagram
file: [binary file data]
description: High-level system architecture overview
```

**Media Types**: Automatically detected (`image`, `video`, `audio`, `document`, `other`)

**Response** (201 Created): Created media object

### Update Media Details
Modify media file metadata.

```
PATCH /api/projects/{project_id}/topics/{topic_id}/media/{media_id}/
```

**Request Body**:
```json
{
  "title": "Updated Architecture Diagram",
  "description": "Updated system architecture with new components"
}
```

### Delete Media File
Remove a media file from a topic.

```
DELETE /api/projects/{project_id}/topics/{topic_id}/media/{media_id}/
```

**Response** (204 No Content): Empty response

## Topic Comments Endpoints

### List Topic Comments
Get all comments for a specific topic.

```
GET /api/projects/{project_id}/topics/{topic_id}/comments/
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "content": "We should prioritize the authentication system first, then move to the topic features.",
    "created_at": "2025-09-25T15:30:00Z",
    "updated_at": "2025-09-25T15:30:00Z",
    "author": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    "parent": null,
    "replies": [
      {
        "id": 2,
        "content": "Agreed! Authentication is the foundation for everything else.",
        "created_at": "2025-09-25T15:45:00Z",
        "updated_at": "2025-09-25T15:45:00Z",
        "author": {
          "id": 2,
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane.smith@example.com"
        },
        "parent": 1,
        "replies": []
      }
    ]
  }
]
```

### Create Topic Comment
Add a new comment to a topic.

```
POST /api/projects/{project_id}/topics/{topic_id}/comments/
```

**Request Body**:
```json
{
  "content": "Great progress on this topic! The documentation is very comprehensive.",
  "parent": null
}
```

For replies, include parent comment ID:
```json
{
  "content": "Thanks! Still working on the technical specifications section.",
  "parent": 1
}
```

**Response** (201 Created): Created comment object

### Update Comment
Modify an existing comment (only by comment author).

```
PATCH /api/projects/{project_id}/topics/{topic_id}/comments/{comment_id}/
```

**Permissions**: Only the comment author can edit their comments

**Request Body**:
```json
{
  "content": "Updated comment with additional thoughts..."
}
```

### Delete Comment
Remove a comment from a topic.

```
DELETE /api/projects/{project_id}/topics/{topic_id}/comments/{comment_id}/
```

**Permissions**: Comment author or project owners/editors can delete comments

**Response** (204 No Content): Empty response

## Topic Tags Endpoints

### List Topic Tags
Get all tags for a specific topic.

```
GET /api/projects/{project_id}/topics/{topic_id}/tags/
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "urgent",
    "color": "#EF4444",
    "created_at": "2025-09-25T15:00:00Z"
  },
  {
    "id": 2,
    "name": "frontend",
    "color": "#3B82F6",
    "created_at": "2025-09-25T15:15:00Z"
  }
]
```

### Create Topic Tag
Add a new tag to a topic.

```
POST /api/projects/{project_id}/topics/{topic_id}/tags/
```

**Request Body**:
```json
{
  "name": "backend",
  "color": "#10B981"
}
```

**Response** (201 Created): Created tag object

### Update Tag
Modify an existing tag.

```
PATCH /api/projects/{project_id}/topics/{topic_id}/tags/{tag_id}/
```

**Request Body**:
```json
{
  "name": "high-priority",
  "color": "#F59E0B"
}
```

### Delete Tag
Remove a tag from a topic.

```
DELETE /api/projects/{project_id}/topics/{topic_id}/tags/{tag_id}/
```

**Response** (204 No Content): Empty response

## Usage Examples

### Complete Topic Workflow

```bash
# Create a topic
curl -b cookies.txt -X POST http://localhost:8000/api/projects/1/topics/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "User Authentication Research",
    "description": "Research authentication methods and implementation approaches",
    "color": "#6366F1"
  }'

# Add a note to the topic
curl -b cookies.txt -X POST http://localhost:8000/api/projects/1/topics/1/notes/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "OAuth 2.0 Implementation",
    "content": "## OAuth 2.0 Flow\n\n1. Authorization Request\n2. Authorization Grant\n3. Access Token Request\n4. Protected Resource Access"
  }'

# Add reference links
curl -b cookies.txt -X POST http://localhost:8000/api/projects/1/topics/1/links/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "OAuth 2.0 RFC",
    "url": "https://tools.ietf.org/html/rfc6749",
    "description": "Official OAuth 2.0 specification",
    "link_type": "reference"
  }'

# Upload a diagram
curl -b cookies.txt -X POST http://localhost:8000/api/projects/1/topics/1/media/ \
  -F "title=Authentication Flow Diagram" \
  -F "description=Visual representation of the OAuth flow" \
  -F "file=@auth_flow.png"

# Add a comment for discussion
curl -b cookies.txt -X POST http://localhost:8000/api/projects/1/topics/1/comments/ \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Should we implement JWT tokens for session management?"
  }'

# Tag the topic for organization
curl -b cookies.txt -X POST http://localhost:8000/api/projects/1/topics/1/tags/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "security",
    "color": "#EF4444"
  }'
```

### JavaScript/React Examples

```javascript
// Topic management hook
const useTopic = (projectId, topicId) => {
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTopic = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/topics/${topicId}/`,
        { credentials: 'include' }
      );
      const data = await response.json();
      setTopic(data);
    } catch (error) {
      console.error('Failed to fetch topic:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId, topicId]);

  const addNote = useCallback(async (noteData) => {
    const response = await fetch(
      `/api/projects/${projectId}/topics/${topicId}/notes/`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      }
    );
    
    if (response.ok) {
      fetchTopic(); // Refresh topic data
    }
    
    return response;
  }, [projectId, topicId, fetchTopic]);

  const addComment = useCallback(async (content, parentId = null) => {
    const response = await fetch(
      `/api/projects/${projectId}/topics/${topicId}/comments/`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parent: parentId })
      }
    );
    
    if (response.ok) {
      fetchTopic();
    }
    
    return response;
  }, [projectId, topicId, fetchTopic]);

  return { 
    topic, 
    loading, 
    fetchTopic, 
    addNote, 
    addComment 
  };
};

// Media upload component
const MediaUpload = ({ projectId, topicId, onUpload }) => {
  const handleFileUpload = async (file, title, description) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/topics/${topicId}/media/`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
      );

      if (response.ok) {
        const mediaFile = await response.json();
        onUpload(mediaFile);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    // Upload component JSX
  );
};
```

## Topic System Features

### Content Organization
- **Topics**: Main containers for organizing project knowledge
- **Notes**: Rich text content with collaborative editing
- **Links**: Categorized external resources and references
- **Media**: File uploads with automatic type detection
- **Comments**: Threaded discussions with nested replies
- **Tags**: Visual organization with custom colors

### Collaboration Features
- **Activity Logging**: All topic operations logged automatically
- **Edit Tracking**: Note modifications track last editor
- **Permission Control**: Role-based access (owner/editor/viewer)
- **Real-time Updates**: Session-based updates for team collaboration

### Content Types Supported
- **Text**: Markdown-formatted notes and comments
- **Images**: PNG, JPG, GIF, SVG formats
- **Videos**: MP4, WebM, MOV formats
- **Audio**: MP3, WAV, OGG formats
- **Documents**: PDF, DOC, TXT, Markdown files
- **Links**: Web resources with categorization

This topic system transforms projects into comprehensive knowledge bases where teams can collaborate effectively on research, documentation, and resource sharing.