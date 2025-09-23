# Personal Project Management Tool

A comprehensive personal project management application built with Django REST Framework and React.

## 🎯 Project Mission
"Handle my project like a project manager, keep my ideas alive"

## 🏗️ Architecture

### Technology Stack
- **Backend**: Django REST Framework with PostgreSQL
- **Frontend**: React with TypeScript and Material-UI
- **Containerization**: Docker & Docker Compose
- **Caching**: Redis
- **Web Server**: Nginx (reverse proxy)

### Project Structure
```
project-manager/
├── backend/                 # Django REST API
│   ├── projectmanager/      # Django project settings
│   ├── users/              # User authentication & profiles
│   ├── projects/           # Project management core
│   ├── tasks/              # Task management
│   ├── documents/          # File & document storage
│   ├── collaboration/      # Team collaboration features
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # React TypeScript App
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── Dockerfile
├── nginx/                  # Nginx configuration
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml      # Multi-container setup
```

## 🚀 Features

### Core Functionality
- **Project CRUD Operations**: Create, read, update, delete projects
- **Task Management**: Create, assign, and track tasks within projects
- **Progress Monitoring**: Visual progress tracking and status updates
- **Timeline/Gantt View**: Project timeline with milestones and deadlines
- **Business Planning**: Integrated business plan editor per project

### Collaboration Features
- **Team Management**: Add/remove team members
- **Real-time Collaboration**: Comments and discussions
- **Activity Feed**: Track all project activities
- **Notifications**: Stay updated on project changes
- **Document Sharing**: Share files and documents with team members

### Dashboard Components
1. **Create New Button** - Quick project creation
2. **Project Timeline** - Visual timeline with progress indicators
3. **Task Overview** - Today's tasks and pending items
4. **Team Activity** - Recent collaboration activities
5. **Document Library** - Quick access to project files
6. **Business Plans** - Business planning section

## 🛠️ Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Git

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-manager
   ```

2. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   DEBUG=1
   SECRET_KEY=your-secret-key
   DB_NAME=projectmanager
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=db
   DB_PORT=5432
   REDIS_URL=redis://redis:6379/0
   ```

3. **Build and Run with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Run Migrations**
   ```bash
   docker-compose exec backend python manage.py makemigrations
   docker-compose exec backend python manage.py migrate
   ```

5. **Create Superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **Nginx Proxy**: http://localhost:80

## 📊 Database Schema

### Key Models
- **User**: Extended Django user with profile information
- **Project**: Core project entity with status, priority, timeline
- **Task**: Project tasks with assignments and dependencies
- **BusinessPlan**: Comprehensive business planning per project
- **Team**: Team management and memberships
- **Document**: File storage and version control
- **Notification**: Real-time notification system
- **ActivityLog**: Audit trail for all activities

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh
- `GET/PUT /api/auth/profile/` - User profile management

### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}/` - Project details
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project
- `POST /api/projects/{id}/add_member/` - Add team member
- `POST /api/projects/{id}/remove_member/` - Remove team member

### Business Plans
- `GET /api/business-plans/` - List business plans
- `POST /api/business-plans/` - Create business plan
- `GET /api/business-plans/{id}/` - Business plan details

## 🎨 Frontend Architecture

### Key Libraries
- **React 19** with TypeScript
- **Material-UI (MUI)** for components
- **React Router** for navigation
- **TanStack Query** for API state management
- **Axios** for HTTP requests
- **Date-fns** for date handling

### Component Structure
- **Pages**: Main route components
- **Components**: Reusable UI components
- **Services**: API integration layer
- **Hooks**: Custom React hooks for shared logic
- **Contexts**: Global state management
- **Types**: TypeScript type definitions

## 🔧 Development

### Backend Development
```bash
# Run backend in development
cd backend
python manage.py runserver

# Run tests
python manage.py test

# Create new migrations
python manage.py makemigrations
python manage.py migrate
```

### Frontend Development
```bash
# Run frontend in development
cd frontend
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 📋 Current Implementation Status

✅ **Completed**
- Docker configuration and project structure
- Django backend with core models
- React frontend project setup
- Basic API endpoints for projects and users
- Authentication system setup

🚧 **In Progress**
- Complete REST API implementation
- React components for dashboard
- Authentication integration

📋 **Planned**
- Task management views
- Team collaboration features
- Document management system
- Business plan editor
- Timeline/Gantt chart view
- Real-time notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for better project management**
