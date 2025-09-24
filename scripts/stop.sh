#!/bin/bash

# Project Manager - Stop Script
echo "🛑 Stopping Project Manager..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Stop all services
print_status "Stopping all Docker services..."
docker-compose down

# Optional: Remove volumes (database data)
echo ""
echo "Do you want to remove all data (including database)? (y/N)"
read -r remove_data
if [[ "$remove_data" =~ ^[Yy]$ ]]; then
    print_status "Removing all volumes and data..."
    docker-compose down -v
    docker system prune -f
    print_success "All data removed!"
else
    print_success "Services stopped, data preserved"
fi

print_success "Project Manager stopped! 👋"