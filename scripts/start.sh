#!/bin/bash

echo "🚀 Starting Project Manager..."

# Clean up
docker-compose down -v
docker network prune -f

# Start services
docker-compose up --build -d

# Wait for services
echo "⏳ Waiting for services..."
sleep 15

# Django setup
echo "🔧 Setting up Django..."
docker-compose exec -T backend python manage.py makemigrations
docker-compose exec -T backend python manage.py migrate

echo "✅ Done!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "Admin:    http://localhost:8000/admin"
