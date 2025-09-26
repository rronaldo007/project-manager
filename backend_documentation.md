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
9. [Topic System Endpoints](#topic-system-endpoints)
10. [Ideas System Endpoints](#ideas-system-endpoints)
11. [User Management Endpoints](#user-management-endpoints)
12. [Error Handling](#error-handling)
13. [Usage Examples](#usage-examples)

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
- Topic-based knowledge organization
- Ideas system for innovation management
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

### Remove Project Member
Remove a team member from a project.

```
DELETE /api/projects/{project_id}/members/{member_id}/
```

**Authentication**: Required
**Permissions**: Only project owner

**Response** (204 No Content): Empty response

## Project Activity Endpoints

### List Project Activities
Get activity history for a project.

```
GET /api/projects/{project_id}/activities/
```

**Authentication**: Required
**Permissions**: User must have read access to the project

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

## Topic System Endpoints

### Overview
Topics serve as knowledge containers within projects, allowing teams to organize research, documentation, media, discussions, and resources into focused areas.

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
    "comments_count": 8
  }
]
```

### Create Topic
Create a new topic within a project.

```
POST /api/projects/{project_id}/topics/
```

**Authentication**: Required
**Permissions**: User must have write access to the project

**Request Body**:
```json
{
  "title": "Design System",
  "description": "UI components, design tokens, and style guidelines",
  "color": "#10B981"
}
```

**Response** (201 Created): Created topic object

### Topic Notes Endpoints

#### List Topic Notes
```
GET /api/projects/{project_id}/topics/{topic_id}/notes/
```

#### Create Topic Note
```
POST /api/projects/{project_id}/topics/{topic_id}/notes/
```

**Request Body**:
```json
{
  "title": "Meeting Notes - Sprint Planning",
  "content": "## Sprint Planning Meeting\n\n### Key Decisions\n- Focus on authentication system"
}
```

### Topic Links Endpoints

#### List Topic Links
```
GET /api/projects/{project_id}/topics/{topic_id}/links/
```

#### Create Topic Link
```
POST /api/projects/{project_id}/topics/{topic_id}/links/
```

**Request Body**:
```json
{
  "title": "Django REST Framework Docs",
  "url": "https://www.django-rest-framework.org/",
  "description": "Official DRF documentation",
  "link_type": "reference"
}
```

### Topic Media Endpoints

#### List Topic Media
```
GET /api/projects/{project_id}/topics/{topic_id}/media/
```

#### Upload Topic Media
```
POST /api/projects/{project_id}/topics/{topic_id}/media/
```

**Content-Type**: `multipart/form-data`

### Topic Comments Endpoints

#### List Topic Comments
```
GET /api/projects/{project_id}/topics/{topic_id}/comments/
```

#### Create Topic Comment
```
POST /api/projects/{project_id}/topics/{topic_id}/comments/
```

**Request Body**:
```json
{
  "content": "Great progress on this topic!",
  "parent": null
}
```

## Ideas System Endpoints

### Overview
The Ideas System provides a comprehensive platform for capturing, developing, and managing innovative concepts within the project management ecosystem.

### List Ideas
Get all ideas accessible to the authenticated user (owned or shared).

```
GET /api/ideas/
```

**Authentication**: Required
**Permissions**: User can see ideas they own or are members of

**Query Parameters**:
- `status`: Filter by idea status (`draft`, `concept`, `in_development`, `implemented`, `on_hold`, `cancelled`)
- `priority`: Filter by priority (`low`, `medium`, `high`, `critical`)
- `search`: Search in title, description, problem statement, and tags
- `project`: Filter ideas associated with specific project ID

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "AI-Powered Customer Support",
    "description": "Implement intelligent chatbot system for automated customer support",
    "priority": "high",
    "status": "concept",
    "tags": "ai,automation,customer-service",
    "tag_list": ["ai", "automation", "customer-service"],
    "owner": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    "notes_count": 5,
    "resources_count": 8,
    "projects_count": 1,
    "members_count": 3,
    "user_role": "owner",
    "created_at": "2025-09-25T14:00:00Z",
    "updated_at": "2025-09-25T16:30:00Z"
  }
]
```

### Create Idea
Create a new idea owned by the authenticated user.

```
POST /api/ideas/
```

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Blockchain-Based Supply Chain Tracking",
  "description": "Transparent supply chain management using blockchain technology",
  "problem_statement": "Current supply chains lack transparency and traceability",
  "solution_overview": "Implement blockchain ledger for immutable supply chain records",
  "target_audience": "Manufacturing companies and logistics providers",
  "priority": "medium",
  "status": "draft",
  "tags": "blockchain,supply-chain,transparency",
  "project_ids": [1, 2]
}
```

**Response** (201 Created): Created idea object with full details

### Get Idea Details
Retrieve comprehensive information about a specific idea.

```
GET /api/ideas/{id}/
```

**Authentication**: Required
**Permissions**: User must be owner or member of the idea

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "AI-Powered Customer Support",
  "description": "Implement intelligent chatbot system for automated customer support",
  "problem_statement": "Current customer support is overwhelmed with repetitive queries",
  "solution_overview": "AI chatbot that handles 80% of common customer inquiries automatically",
  "target_audience": "Small to medium businesses with high customer inquiry volume",
  "market_potential": "Global customer service automation market worth $15B",
  "revenue_model": "SaaS subscription with tiered pricing based on query volume",
  "competition_analysis": "Competitors include Zendesk, Intercom, but lack advanced AI",
  "technical_requirements": "Natural language processing, machine learning models, API integrations",
  "estimated_effort": "6-8 months with 4-person team",
  "priority": "high",
  "status": "concept",
  "tags": "ai,automation,customer-service",
  "tag_list": ["ai", "automation", "customer-service"],
  "owner": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "projects": [
    {
      "id": 1,
      "title": "Customer Platform Upgrade",
      "description": "Modernizing customer service infrastructure",
      "status": "in_progress"
    }
  ],
  "notes": [
    {
      "id": 1,
      "title": "Technical Research",
      "content": "Investigated GPT-4 and Claude for conversational AI capabilities",
      "author": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      },
      "created_at": "2025-09-25T15:00:00Z",
      "updated_at": "2025-09-25T15:30:00Z"
    }
  ],
  "resources": [
    {
      "id": 1,
      "title": "OpenAI API Documentation",
      "url": "https://platform.openai.com/docs",
      "description": "Official documentation for OpenAI's API integration",
      "resource_type": "reference",
      "added_by": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      },
      "created_at": "2025-09-25T14:30:00Z"
    }
  ],
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
      "added_by": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      },
      "created_at": "2025-09-25T15:00:00Z"
    }
  ],
  "user_role": "owner",
  "user_permissions": {
    "can_view": true,
    "can_edit": true,
    "can_contribute": true,
    "can_manage_members": true,
    "can_delete": true
  },
  "created_at": "2025-09-25T14:00:00Z",
  "updated_at": "2025-09-25T16:30:00Z"
}
```

### Update Idea
Modify idea information.

```
PATCH /api/ideas/{id}/
```

**Authentication**: Required
**Permissions**: User must have editor permissions or be owner

**Request Body**:
```json
{
  "status": "in_development",
  "priority": "critical",
  "solution_overview": "Enhanced AI chatbot with multilingual support",
  "project_ids": [1, 2, 3]
}
```

**Response** (200 OK): Updated idea object

### Delete Idea
Permanently delete an idea.

```
DELETE /api/ideas/{id}/
```

**Authentication**: Required
**Permissions**: Only idea owner

**Response** (204 No Content): Empty response

### Ideas Statistics
Get dashboard statistics for user's ideas.

```
GET /api/ideas/stats/
```

**Authentication**: Required

**Response** (200 OK):
```json
{
  "total_ideas": 15,
  "by_status": {
    "draft": 3,
    "concept": 5,
    "in_development": 4,
    "implemented": 2,
    "on_hold": 1,
    "cancelled": 0
  },
  "by_priority": {
    "low": 2,
    "medium": 8,
    "high": 4,
    "critical": 1
  },
  "recent_ideas": [
    {
      "id": 1,
      "title": "AI-Powered Customer Support",
      "created_at": "2025-09-25T14:00:00Z"
    }
  ]
}
```

## Idea Membership Endpoints

### List Idea Members
Get all team members for a specific idea.

```
GET /api/ideas/{idea_id}/members/
```

**Authentication**: Required
**Permissions**: User must have access to the idea

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
    "added_by": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
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
    "role": "contributor",
    "added_by": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    "created_at": "2025-09-25T16:00:00Z"
  }
]
```

### Add Idea Member
Add a new team member to an idea.

```
POST /api/ideas/{idea_id}/members/
```

**Authentication**: Required
**Permissions**: Editor role or idea owner

**Request Body (using email)**:
```json
{
  "user_email": "contributor@example.com",
  "role": "contributor"
}
```

**Request Body (using user ID)**:
```json
{
  "user_id": 3,
  "role": "viewer"
}
```

**Role Options**:
- `viewer`: Can view the idea and its content
- `contributor`: Can view and add notes/resources  
- `editor`: Can view, edit, and manage members

**Response** (201 Created):
```json
{
  "id": 3,
  "user": {
    "id": 4,
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "contributor@example.com"
  },
  "role": "contributor",
  "added_by": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "created_at": "2025-09-25T17:00:00Z"
}
```

**Error Responses**:
```json
{
  "user_email": ["User with email contributor@example.com not found"]
}
```

```json
{
  "non_field_errors": ["User is already a member of this idea"]
}
```

```json
{
  "non_field_errors": ["The idea owner cannot be added as a member"]
}
```

### Update Member Role
Modify a team member's role in an idea.

```
PATCH /api/ideas/{idea_id}/members/{member_id}/
```

**Authentication**: Required
**Permissions**: Only idea owner can change member roles

**Request Body**:
```json
{
  "role": "editor"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "user": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com"
  },
  "role": "editor",
  "added_by": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "created_at": "2025-09-25T15:00:00Z"
}
```

### Remove Idea Member
Remove a team member from an idea.

```
DELETE /api/ideas/{idea_id}/members/{user_id}/
```

**Authentication**: Required
**Permissions**: Editor role or idea owner

**Response** (200 OK):
```json
{
  "message": "Member removed successfully"
}
```

**Error Responses**:
```json
{
  "error": "Member not found"
}
```

```json
{
  "error": "You do not have permission to remove members"
}
```

### Bulk Add Members
Add multiple team members to an idea in a single request.

```
POST /api/ideas/{idea_id}/members/bulk/
```

**Authentication**: Required
**Permissions**: Editor role or idea owner

**Request Body**:
```json
{
  "members": [
    {
      "user_email": "dev1@company.com",
      "role": "contributor"
    },
    {
      "user_email": "dev2@company.com", 
      "role": "viewer"
    },
    {
      "user_id": 5,
      "role": "editor"
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "added": [
    {
      "id": 4,
      "user": {
        "id": 6,
        "first_name": "Developer",
        "last_name": "One",
        "email": "dev1@company.com"
      },
      "role": "contributor"
    }
  ],
  "errors": [
    {
      "user_email": "dev2@company.com",
      "error": "User with this email does not exist"
    }
  ],
  "skipped": [
    {
      "user_id": 5,
      "reason": "User is already a member"
    }
  ]
}
```

### Get Member Details
Get detailed information about a specific idea member.

```
GET /api/ideas/{idea_id}/members/{member_id}/
```

**Authentication**: Required
**Permissions**: User must have access to the idea

**Response** (200 OK):
```json
{
  "id": 1,
  "user": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "date_joined": "2025-09-20T10:00:00Z"
  },
  "role": "editor",
  "added_by": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "created_at": "2025-09-25T15:00:00Z",
  "permissions": {
    "can_view": true,
    "can_edit": true,
    "can_contribute": true,
    "can_manage_members": true,
    "can_delete": false
  },
  "activity_summary": {
    "notes_created": 3,
    "resources_added": 5,
    "last_activity": "2025-09-27T14:30:00Z"
  }
}
```

## Idea Notes Endpoints

### List Idea Notes
Get all notes for a specific idea.

```
GET /api/ideas/{idea_id}/notes/
```

**Authentication**: Required
**Permissions**: User must have access to the idea

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Market Research Findings",
    "content": "# Market Research\n\n## Key Findings\n- 73% of businesses struggle with customer support response times",
    "author": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    "created_at": "2025-09-25T15:00:00Z",
    "updated_at": "2025-09-25T15:30:00Z"
  }
]
```

### Create Idea Note
Add a new note to an idea.

```
POST /api/ideas/{idea_id}/notes/
```

**Authentication**: Required
**Permissions**: Contributor role or higher

**Request Body**:
```json
{
  "title": "Technical Implementation Plan",
  "content": "## Phase 1: Data Collection\n- Gather customer inquiry data\n- Analyze response patterns"
}
```

**Response** (201 Created): Created note object

## Idea Resources Endpoints

### List Idea Resources
Get all resources for a specific idea.

```
GET /api/ideas/{idea_id}/resources/
```

**Authentication**: Required
**Permissions**: User must have access to the idea

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Competitor Analysis - Zendesk",
    "url": "https://www.zendesk.com/features/",
    "description": "Analysis of Zendesk's AI features and pricing model",
    "resource_type": "competitor",
    "added_by": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com"
    },
    "created_at": "2025-09-25T14:45:00Z"
  }
]
```

### Create Idea Resource
Add a new resource to an idea.

```
POST /api/ideas/{idea_id}/resources/
```

**Authentication**: Required
**Permissions**: Contributor role or higher

**Request Body**:
```json
{
  "title": "Google's DialogFlow Documentation",
  "url": "https://cloud.google.com/dialogflow/docs",
  "description": "Comprehensive guide for building conversational AI applications",
  "resource_type": "tool"
}
```

**Resource Types**: `research`, `reference`, `inspiration`, `competitor`, `tool`, `other`

**Response** (201 Created): Created resource object

## User Management Endpoints

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

### Complete Authentication Flow

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

# Create project
curl -X POST http://localhost:8000/api/projects/ \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{
    "title": "API Integration Project",
    "description": "Integrating third-party APIs",
    "status": "planning",
    "priority": "high"
  }'
```

### Complete Idea Lifecycle

```bash
# Create an idea
curl -b cookies.txt -X POST http://localhost:8000/api/ideas/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Smart Inventory Management",
    "description": "IoT-based inventory tracking with predictive analytics",
    "problem_statement": "Manual inventory tracking leads to stockouts and waste",
    "priority": "high",
    "status": "concept",
    "tags": "iot,ml,inventory,analytics"
  }'

# Add team members
curl -b cookies.txt -X POST http://localhost:8000/api/ideas/1/members/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "developer@company.com",
    "role": "editor"
  }'

# Add research notes
curl -b cookies.txt -X POST http://localhost:8000/api/ideas/1/notes/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "IoT Sensor Research",
    "content": "## Sensor Options\n\n1. **RFID Tags**: Low cost, passive scanning"
  }'
```

### JavaScript Integration

```javascript
// Ideas management hook
const useIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIdeas = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/ideas/?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setIdeas(data);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createIdea = useCallback(async (ideaData) => {
    const response = await fetch('/api/ideas/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ideaData)
    });
    
    if (response.ok) {
      fetchIdeas(); // Refresh list
    }
    
    return response;
  }, [fetchIdeas]);

  return { ideas, loading, fetchIdeas, createIdea };
};
```

## Permission System

### Ideas Permission Hierarchy

1. **Owner** (Idea Creator)
   - Full control over the idea
   - Can edit all content
   - Can manage team members
   - Can delete the idea
   - Can associate/disassociate projects

2. **Editor**
   - Can view and edit idea content
   - Can add/edit notes and resources
   - Can manage team members
   - Cannot delete the idea

3. **Contributor**
   - Can view idea content
   - Can add notes and resources
   - Cannot edit existing content from others
   - Cannot manage team members

4. **Viewer**
   - Can only view idea content
   - Cannot modify or add content
   - Cannot manage team members

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