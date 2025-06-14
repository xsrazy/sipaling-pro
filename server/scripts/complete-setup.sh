#!/bin/bash

# SiPaling.pro Complete Setup Script
# Run this after uploading application files

set -e

echo "🔧 SiPaling.pro Complete Setup Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if we're in the right directory
if [[ ! -f "server/package.json" ]]; then
    print_error "Please run this script from the /var/www/sipaling-pro directory"
    print_error "Current directory: $(pwd)"
    exit 1
fi

# Get domain for SSL setup
read -p "Enter your domain (e.g., sipaling.pro): " DOMAIN
read -p "Enter your email for SSL certificate: " EMAIL

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
    print_error "Domain and email are required!"
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd server
npm install --production
cd ..

# Check if .env file exists
if [[ ! -f "server/.env" ]]; then
    print_warning ".env file not found. Creating from template..."
    cp server/.env.example server/.env
    print_warning "Please edit server/.env with your configuration before continuing"
    read -p "Press Enter after editing .env file..."
fi

# Initialize database
print_status "Initializing database..."
cd server
node -e "
import('./database/init.js').then(({ initDatabase }) => {
  initDatabase().then(() => {
    console.log('✅ Database initialized successfully');
    process.exit(0);
  }).catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  });
});
" || {
    print_error "Database initialization failed"
    exit 1
}
cd ..

# Set proper permissions
print_status "Setting file permissions..."
sudo chown -R www-data:www-data server/uploads
sudo chmod -R 755 server/uploads
sudo chown -R $USER:$USER server/data
sudo chmod -R 755 server/data

# Setup SSL certificate
print_status "Setting up SSL certificate..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL || {
    print_warning "SSL setup failed. You can run it manually later:"
    print_warning "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
}

# Setup auto-renewal for SSL
print_status "Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Start application with PM2
print_status "Starting application with PM2..."
cd server
pm2 start index.js --name sipaling-pro
pm2 save
pm2 startup | grep -E '^sudo' | bash || print_warning "PM2 startup setup may have failed"

# Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/sipaling-pro > /dev/null <<EOF
/var/www/sipaling-pro/server/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reload sipaling-pro
    endscript
}
EOF

# Create backup script
print_status "Creating backup script..."
tee /home/$USER/backup-sipaling.sh > /dev/null <<EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/sipaling-pro"
APP_DIR="/var/www/sipaling-pro"

mkdir -p \$BACKUP_DIR

# Backup database
cp \$APP_DIR/server/data/sipaling.db \$BACKUP_DIR/sipaling_\$DATE.db

# Backup uploads
tar -czf \$BACKUP_DIR/uploads_\$DATE.tar.gz -C \$APP_DIR/server uploads/

# Remove old backups (keep 30 days)
find \$BACKUP_DIR -name "*.db" -mtime +30 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: \$DATE"
EOF

chmod +x /home/$USER/backup-sipaling.sh

# Setup daily backup
print_status "Setting up daily backup..."
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup-sipaling.sh") | crontab -

# Test application
print_status "Testing application..."
sleep 5

# Test health endpoint
if curl -f -s https://$DOMAIN/api/health > /dev/null; then
    print_success "✅ API is responding correctly"
else
    print_warning "⚠️  API health check failed. Check PM2 logs: pm2 logs sipaling-pro"
fi

# Test frontend
if curl -f -s https://$DOMAIN > /dev/null; then
    print_success "✅ Frontend is accessible"
else
    print_warning "⚠️  Frontend check failed. Check Nginx configuration"
fi

print_success "🎉 Setup completed successfully!"
echo ""
echo "📊 Application Status:"
pm2 status sipaling-pro
echo ""
echo "🌐 Your application is now available at:"
echo "   Frontend: https://$DOMAIN"
echo "   API: https://$DOMAIN/api/"
echo "   Dashboard: https://$DOMAIN/dashboard"
echo ""
echo "🔧 Useful commands:"
echo "   Check logs: pm2 logs sipaling-pro"
echo "   Restart app: pm2 restart sipaling-pro"
echo "   Monitor: pm2 monit"
echo "   Backup: /home/$USER/backup-sipaling.sh"
echo ""
echo "📖 For troubleshooting, check:"
echo "   - PM2 logs: pm2 logs sipaling-pro"
echo "   - Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "   - Application logs: tail -f server/logs/application-*.log"