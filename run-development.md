# Development Setup Instructions

Since Docker setup has some complexities, here's how to run the project in development mode:

## Prerequisites
You need PostgreSQL and Redis running locally. If not installed:

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib redis-server

# Start services
sudo systemctl start postgresql
sudo systemctl start redis-server
```

## Database Setup
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE projectmanager;
CREATE USER projectmanager WITH ENCRYPTED PASSWORD 'projectmanager123';
GRANT ALL PRIVILEGES ON DATABASE projectmanager TO projectmanager;
\q
```

## Backend Setup
```bash
cd backend

# Install Python dependencies (using system packages to avoid build issues)
pip install django djangorestframework django-cors-headers python-decouple

# Create environment file
cat > .env << EOF
DEBUG=1
SECRET_KEY=django-insecure-dev-key-12345
DB_NAME=projectmanager
DB_USER=projectmanager
DB_PASSWORD=projectmanager123
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://localhost:6379/0
EOF

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start backend
python manage.py runserver 8000
```

## Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start frontend
npm start
```

## Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

## Project Structure Overview
The project is fully architected with:
- ✅ Complete Django models (User, Project, Task, BusinessPlan, Documents, Collaboration)
- ✅ REST API endpoints with authentication
- ✅ React frontend structure with TypeScript and Material-UI
- ✅ Comprehensive project documentation

The foundation is solid - you can now build upon it!