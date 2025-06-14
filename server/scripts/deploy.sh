#!/bin/bash

# Deployment script for SiPaling.pro

set -e

APP_DIR="/var/www/sipaling-pro"
BACKUP_DIR="/var/backups/sipaling-pro"

echo "🚀 Deploying SiPaling.pro..."

# Create backup
echo "💾 Creating backup..."
sudo mkdir -p $BACKUP_DIR
sudo cp -r $APP_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)

# Stop application
echo "⏹️ Stopping application..."
pm2 stop sipaling-pro || true

# Update application files
echo "📁 Updating application files..."
cd $APP_DIR/server

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Run database migrations if needed
echo "🗄️ Checking database..."
node -e "
import('./database/init.js').then(({ initDatabase }) => {
  initDatabase().then(() => {
    console.log('Database ready');
    process.exit(0);
  }).catch(err => {
    console.error('Database error:', err);
    process.exit(1);
  });
});
"

# Start application
echo "▶️ Starting application..."
pm2 start index.js --name sipaling-pro

# Save PM2 configuration
pm2 save

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"

# Show status
echo ""
echo "📊 Application Status:"
pm2 status sipaling-pro
echo ""
echo "🌐 Application is running at: https://$(hostname -f)"