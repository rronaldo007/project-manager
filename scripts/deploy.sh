#!/usr/bin/env bash
set -Eeuo pipefail

# ========= Config you can tweak =========
DOMAIN_OR_IP="${DOMAIN_OR_IP:-46.101.85.91}"
APP_DIR="${APP_DIR:-/var/www/project-manager/project-manager}"
SITE_NAME="project-manager"
CREATE_SYSTEMD="${CREATE_SYSTEMD:-yes}"          # yes|no
FRESH_DB="${1:-}"                                # pass "--fresh-db" to recreate DB volume
MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-supersecretroot}"   # must match compose default or .env
BACKEND_HOST_PORT="${BACKEND_HOST_PORT:-8000}"
FRONTEND_HOST_PORT="${FRONTEND_HOST_PORT:-3000}"
DB_HOST_PORT="${DB_HOST_PORT:-3307}"
SWAP_MB="${SWAP_MB:-1024}"                        # set 0 to skip
# ========================================

log(){ echo -e "\n[deploy] $*"; }

require() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing command: $1"; exit 1; }
}

# ====== 0) Basic checks ======
require sudo
require docker
require awk
require sed

if [[ ! -d "$APP_DIR" ]]; then
  echo "App dir not found: $APP_DIR"; exit 1
fi
cd "$APP_DIR"

log "Ubuntu release: $(. /etc/os-release; echo "$PRETTY_NAME")"
log "Working in $APP_DIR for domain/IP: $DOMAIN_OR_IP"

# ====== 1) Optional small swap to survive installs/builds ======
if [[ "$SWAP_MB" != "0" && ! -f /swapfile ]]; then
  log "Adding ${SWAP_MB}MB swap (once)"
  sudo fallocate -l "${SWAP_MB}M" /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count="$SWAP_MB"
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  if ! grep -q "/swapfile" /etc/fstab; then
    echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab >/dev/null
  fi
else
  log "Swap step skipped or already present."
fi

# ====== 2) Ensure Docker & Compose ======
log "Ensuring Docker + Compose are installed"
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin || true
log "Docker: $(docker --version) | Compose: $(docker compose version)"

# ====== 3) Free up some disk (safe prunes) ======
log "Disk usage before prune:"
df -h /

log "Pruning old Docker data"
docker system prune -af || true
docker builder prune -af || true
sudo journalctl --vacuum-time=2d >/dev/null 2>&1 || true
sudo apt-get autoremove -y >/dev/null 2>&1 || true
sudo apt-get clean >/dev/null 2>&1 || true

log "Disk usage after prune:"
df -h /

# ====== 4) Normalize env files ======
log "Normalizing env files"
# root .env driving compose defaults (keep existing values if present)
grep -q '^DB_NAME=' .env 2>/dev/null || echo "DB_NAME=projects" | tee -a .env >/dev/null
grep -q '^DB_USER=' .env 2>/dev/null || echo "DB_USER=ronaldo" | tee -a .env >/dev/null
grep -q '^DB_PASSWORD=' .env 2>/dev/null || echo "DB_PASSWORD=ronaldo100" | tee -a .env >/dev/null
grep -q '^DB_HOST=' .env 2>/dev/null || echo "DB_HOST=db" | tee -a .env >/dev/null
grep -q '^DB_PORT=' .env 2>/dev/null || echo "DB_PORT=3306" | tee -a .env >/dev/null
grep -q '^ALLOWED_HOSTS=' .env 2>/dev/null || echo "ALLOWED_HOSTS=$DOMAIN_OR_IP,localhost,127.0.0.1" | tee -a .env >/dev/null

# frontend env: same-origin API to avoid CORS
mkdir -p frontend
echo "VITE_API_URL=/api" | tee frontend/.env >/dev/null

# backend env: make sure Django matches compose + Nginx origin
mkdir -p backend
if [[ ! -f backend/.env ]]; then
  cat > backend/.env <<EOF
SECRET_KEY=$(python3 - <<PY
import secrets;print(secrets.token_urlsafe(48))
PY
)
DB_NAME=${DB_NAME:-projects}
DB_USER=${DB_USER:-ronaldo}
DB_PASSWORD=${DB_PASSWORD:-ronaldo100}
DB_HOST=db
DB_PORT=3306

DEBUG=False
ALLOWED_HOSTS=$DOMAIN_OR_IP,localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=http://$DOMAIN_OR_IP
PY
EOF
else
  # patch common keys without clobbering the file
  sed -i "s/^DB_HOST=.*/DB_HOST=db/" backend/.env
  sed -i "s/^DB_PORT=.*/DB_PORT=3306/" backend/.env
  grep -q '^DEBUG=' backend/.env || echo "DEBUG=False" | tee -a backend/.env >/dev/null
  if grep -q '^ALLOWED_HOSTS=' backend/.env; then
    sed -i "s/^ALLOWED_HOSTS=.*/ALLOWED_HOSTS=$DOMAIN_OR_IP,localhost,127.0.0.1/" backend/.env
  else
    echo "ALLOWED_HOSTS=$DOMAIN_OR_IP,localhost,127.0.0.1" | tee -a backend/.env >/dev/null
  fi
  if grep -q '^CSRF_TRUSTED_ORIGINS=' backend/.env; then
    sed -i "s#^CSRF_TRUSTED_ORIGINS=.*#CSRF_TRUSTED_ORIGINS=http://$DOMAIN_OR_IP#" backend/.env
  else
    echo "CSRF_TRUSTED_ORIGINS=http://$DOMAIN_OR_IP" | tee -a backend/.env >/dev/null
  fi
fi

# ====== 5) Optional: wipe DB if requested ======
if [[ "$FRESH_DB" == "--fresh-db" ]]; then
  log "Fresh DB requested: bringing stack down and removing volumes"
  docker compose down -v || true
else
  log "Keeping existing DB volume"
  docker compose down || true
fi

# ====== 6) Build images (lean) ======
log "Building images"
docker compose build --pull

# ====== 7) Start DB first, wait for healthy ======
log "Starting database"
docker compose up -d db
log "Waiting for DB to be healthy..."
# up to 30 attempts (~5 min) with compose healthcheck
for i in {1..30}; do
  state="$(docker compose ps --format json | awk 'BEGIN{RS="}{";FS="\n"} /"Service":"db"/ {print} ' | tr -d '\n' || true)"
  [[ -n "$state" ]] || sleep 5
  if docker compose ps | grep -q "db.*(healthy)"; then
    echo "DB healthy."
    break
  fi
  echo "  … still waiting ($i/30)"
  sleep 10
done
if ! docker compose ps | grep -q "db.*(healthy)"; then
  echo "DB did not become healthy. Check: docker compose logs db"; exit 1
fi

# ====== 8) Run migrations & collectstatic (one-off) ======
log "Running migrations & collectstatic"
docker compose run --rm backend python manage.py migrate --noinput
docker compose run --rm backend python manage.py collectstatic --noinput

# ====== 9) Start app services ======
log "Starting backend & frontend"
docker compose up -d backend frontend
docker compose ps

# ====== 10) Nginx reverse proxy ======
log "Installing/configuring Nginx reverse proxy"
sudo apt-get install -y nginx ufw
# allow HTTP
sudo ufw --force allow 80/tcp || true
sudo ufw --force enable || true

# write site (NO backslashes before semicolons!)
sudo tee /etc/nginx/sites-available/$SITE_NAME >/dev/null <<NGINX
server {
    listen 80;
    server_name $DOMAIN_OR_IP;

    # Frontend (Vite dev server in container)
    location / {
        proxy_pass http://127.0.0.1:$FRONTEND_HOST_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # Django admin
    location /admin/ {
        proxy_pass http://127.0.0.1:$BACKEND_HOST_PORT/admin/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_http_version 1.1;
    }

    # API
    location /api/ {
        proxy_pass http://127.0.0.1:$BACKEND_HOST_PORT/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_http_version 1.1;
    }

    # Collected static (admin CSS/JS)
    location /static/ {
        alias $APP_DIR/backend/staticfiles/;
        access_log off;
        expires 7d;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/$SITE_NAME /etc/nginx/sites-enabled/$SITE_NAME
sudo nginx -t
sudo systemctl reload nginx

# ====== 11) systemd unit for autostart (optional) ======
if [[ "$CREATE_SYSTEMD" == "yes" ]]; then
  log "Creating systemd unit to auto-start on boot"
  sudo tee /etc/systemd/system/${SITE_NAME}.service >/dev/null <<UNIT
[Unit]
Description=$SITE_NAME docker compose app
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
RemainAfterExit=yes
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
UNIT

  sudo systemctl daemon-reload
  sudo systemctl enable --now ${SITE_NAME}
  sudo systemctl status ${SITE_NAME} --no-pager || true
else
  log "Skipping systemd unit"
fi

# ====== 12) Health summary ======
log "Final disk usage:"
df -h /

log "Container states:"
docker compose ps

log "Quick curl checks (HTTP 200/301/401 are fine):"
if command -v curl >/dev/null 2>&1; then
  curl -sS -I "http://127.0.0.1:${BACKEND_HOST_PORT}/" || true
  curl -sS -I "http://${DOMAIN_OR_IP}/" || true
  curl -sS -I "http://${DOMAIN_OR_IP}/api/" || true
  curl -sS -I "http://${DOMAIN_OR_IP}/admin/login/" || true
fi

log "Done. Visit: http://${DOMAIN_OR_IP}/"
