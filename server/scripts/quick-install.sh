#!/bin/bash

# SiPaling.pro Quick Installation Script
# For Ubuntu 22.04+ VPS

set -e

echo "🚀 SiPaling.pro Quick Installation Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Get domain from user
read -p "Enter your domain (e.g., sipaling.pro): " DOMAIN
read -p "Enter your email for SSL certificate: " EMAIL

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
    print_error "Domain and email are required!"
    exit 1
fi

print_status "Starting installation for domain: $DOMAIN"

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install basic tools
print_status "Installing basic tools..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Install Node.js 18+
print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg
print_status "Installing FFmpeg..."
sudo apt install -y ffmpeg

# Install PM2
print_status "Installing PM2..."
sudo npm install -g pm2

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Certbot
print_status "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Create application directory
print_status "Creating application directory..."
sudo mkdir -p /var/www/sipaling-pro
sudo chown -R $USER:$USER /var/www/sipaling-pro
cd /var/www/sipaling-pro

# Create subdirectories
mkdir -p server/data
mkdir -p server/uploads/videos
mkdir -p server/uploads/previews
mkdir -p server/logs
mkdir -p dist

# Set permissions
chmod 755 /var/www/sipaling-pro
chmod 755 /var/www/sipaling-pro/server/uploads
chmod 755 /var/www/sipaling-pro/server/data
chmod 755 /var/www/sipaling-pro/server/logs

print_success "System dependencies installed successfully!"
print_warning "Next steps:"
echo "1. Upload your application files to /var/www/sipaling-pro/"
echo "2. Copy .env file with your configuration"
echo "3. Run: cd /var/www/sipaling-pro/server && npm install"
echo "4. Initialize database"
echo "5. Configure Nginx"
echo "6. Setup SSL certificate"
echo "7. Start application with PM2"
echo ""
echo "📖 See INSTALL.md for detailed instructions"

# Create nginx configuration
print_status "Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/sipaling-pro > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;
    
    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Auth routes with stricter rate limiting
    location /api/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Upload files
    location /uploads/ {
        alias /var/www/sipaling-pro/server/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Security for uploaded files
        location ~* \.(php|pl|py|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }
    
    # Static files
    location / {
        root /var/www/sipaling-pro/dist;
        try_files \$uri \$uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    }
    
    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|sql)$ {
        deny all;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/sipaling-pro /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
    sudo systemctl restart nginx
else
    print_error "Nginx configuration has errors"
    exit 1
fi

print_success "Quick installation completed!"
print_warning "Manual steps remaining:"
echo "1. Upload your application files"
echo "2. Configure .env file"
echo "3. Install npm dependencies"
echo "4. Initialize database"
echo "5. Setup SSL: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "6. Start application: pm2 start index.js --name sipaling-pro"
echo ""
echo "🌐 Your site will be available at: https://$DOMAIN"