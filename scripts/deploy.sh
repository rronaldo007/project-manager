#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/project-manager/project-manager"
DOMAIN_OR_IP="46.101.85.91"

log(){ printf "\n[deploy] %s\n" "$*"; }

# --- 0) Pre-flight -----------------------------------------------------------
command -v docker >/dev/null || { echo "Docker not found"; exit 1; }
command -v docker compose >/dev/null || { echo "Docker Compose plugin not found"; exit 1; }

cd "$APP_DIR"

# --- 1) Ensure compose env ---------------------------------------------------
log "Ensuring .env has MYSQL_ROOT_PASSWORD"
if ! grep -q '^MYSQL_ROOT_PASSWORD=' .env 2>/dev/null; then
  echo 'MYSQL_ROOT_PASSWORD=supersecretroot' >> .env
fi

# --- 2) Optional: remove obsolete 'version:' to silence warning -------------
if grep -qE '^\s*version\s*:' docker-compose.yml; then
  log "Removing top-level 'version:' from docker-compose.yml (Compose v2 ignores it)"
  # Remove a single 'version: ...' line
  sed -i '0,/^version:.*/{s/^version:.*//}' docker-compose.yml
fi

# --- 3) Disk cleanup (safe) --------------------------------------------------
log "Pruning Docker and cleaning local build junk"
docker compose down || true
docker system prune -af || true
docker builder prune -af || true
docker volume prune -f || true
rm -rf frontend/node_modules backend/.venv backend/venv **/__pycache__ **/*.pyc backend/staticfiles 2>/dev/null || true
df -h /

# --- 4) DB first -------------------------------------------------------------
log "Starting DB (MariaDB) and waiting for health"
docker compose up -d db
# Wait up to ~2 minutes for DB health
for i in $(seq 1 24); do
  state=$(docker compose ps --format json | awk -v RS= '{print}' | grep -A2 '"Service":"db"' || true)
  echo "$state" | grep -q '"State":"running"' && echo "$state" | grep -q '"Health":"healthy"' && break
  sleep 5
done
docker compose ps

# --- 5) Build backend (slim image, no apt) ----------------------------------
log "Building backend image"
docker compose build --no-cache backend

# --- 6) Start backend + frontend --------------------------------------------
log "Starting backend & frontend"
docker compose up -d backend frontend
docker compose ps

# --- 7) Run Django tasks explicitly (shows errors clearly) -------------------
log "Applying migrations"
docker compose run --rm backend python manage.py migrate --noinput || { echo "[warn] migrate failed"; }

log "Collecting staticfiles"
docker compose run --rm backend python manage.py collectstatic --noinput || { echo "[warn] collectstatic failed"; }

# --- 8) Nginx reverse proxy --------------------------------------------------
log "Installing/refreshing Nginx site"
if ! dpkg -s nginx >/dev/null 2>&1; then
  apt-get update && apt-get install -y nginx
fi

cat >/etc/nginx/sites-available/project-manager <<NGINX
server {
    listen 80;
    server_name ${DOMAIN_OR_IP};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        # try_files \$uri /index.html; # enable if you later serve built SPA via nginx
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_http_version 1.1;
    }

    location /ws/ {
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:8000/;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/project-manager /etc/nginx/sites-enabled/project-manager
nginx -t && systemctl reload nginx

# --- 9) Smoke tests ----------------------------------------------------------
log "Quick checks (200/301/401 okay depending on auth)"
set +e
curl -sS -I http://127.0.0.1:3000/ | head -n 1
curl -sS -I http://127.0.0.1:8000/ | head -n 1
curl -sS -I http://${DOMAIN_OR_IP}/ | head -n 1
curl -sS -I http://${DOMAIN_OR_IP}/api/ | head -n 1
set -e

log "Done. Visit: http://${DOMAIN_OR_IP}/  (API: /api/)"
