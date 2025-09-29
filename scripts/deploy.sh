#!/bin/bash

echo "🚀 Deploying Project Manager to Production..."
echo "=============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Step 1: Install Docker if not installed
echo -e "\n${YELLOW}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Step 2: Install Docker Compose if not installed
echo -e "\n${YELLOW}Checking Docker Compose installation...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    apt install -y docker-compose
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# Step 3: Stop existing services
echo -e "\n${YELLOW}Stopping existing services...${NC}"
systemctl stop gunicorn 2>/dev/null || true
systemctl disable gunicorn 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✓ Services stopped${NC}"

# Step 4: Pull latest code
echo -e "\n${YELLOW}Pulling latest code from GitHub...${NC}"
git pull origin main
echo -e "${GREEN}✓ Code updated${NC}"

# Step 5: Update environment file
echo -e "\n${YELLOW}Checking environment configuration...${NC}"
if [ ! -f backend/.env ]; then
    echo -e "${RED}✗ backend/.env not found!${NC}"
    echo "Please create backend/.env with the following:"
    echo "  DB_NAME=projects"
    echo "  DB_USER=ronaldo"
    echo "  DB_PASSWORD=ronaldo123"
    echo "  DB_HOST=db"
    echo "  DB_PORT=3306"
    echo "  SECRET_KEY=<your-secret-key>"
    echo "  ALLOWED_HOSTS=46.101.85.91,localhost"
    exit 1
fi
echo -e "${GREEN}✓ Environment file exists${NC}"

# Step 6: Build and start containers
echo -e "\n${YELLOW}Building and starting Docker containers...${NC}"
docker-compose up -d --build

# Step 7: Wait for services to start
echo -e "\n${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Step 8: Run migrations
echo -e "\n${YELLOW}Running database migrations...${NC}"
docker-compose exec -T backend python manage.py migrate

# Step 9: Collect static files
echo -e "\n${YELLOW}Collecting static files...${NC}"
docker-compose exec -T backend python manage.py collectstatic --noinput

# Step 10: Configure Nginx as reverse proxy
echo -e "\n${YELLOW}Configuring Nginx reverse proxy...${NC}"

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt install -y nginx
fi

# Create Nginx config for Docker
cat > /etc/nginx/sites-available/project-manager << 'EOF'
server {
    listen 80;
    server_name 46.101.85.91;

    client_max_body_size 10M;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        proxy_pass http://localhost:8000;
    }

    # Media files
    location /media/ {
        proxy_pass http://localhost:8000;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/project-manager /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✓ Nginx configured${NC}"

# Step 11: Configure firewall
echo -e "\n${YELLOW}Configuring firewall...${NC}"
ufw allow 'Nginx Full' 2>/dev/null || true
ufw allow OpenSSH 2>/dev/null || true
echo -e "${GREEN}✓ Firewall configured${NC}"

# Step 12: Show status
echo -e "\n${YELLOW}Checking container status...${NC}"
docker-compose ps

# Final summary
echo ""
echo "=============================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=============================================="
echo ""
echo "Your application is now running at:"
echo "  🌐 Frontend: http://46.101.85.91"
echo "  🔧 Backend:  http://46.101.85.91/admin"
echo ""
echo "Useful commands:"
echo "  View logs:        docker-compose logs -f"
echo "  Restart services: docker-compose restart"
echo "  Stop services:    docker-compose down"
echo "  Start services:   docker-compose up -d"
echo ""
echo "=============================================="