#!/bin/bash

# SiPaling.pro Backend Installation Script
# For Ubuntu 22.04+ VPS

set -e

echo "🚀 Installing SiPaling.pro Backend..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg
echo "📦 Installing FFmpeg..."
sudo apt install -y ffmpeg

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Install Certbot for SSL
echo "📦 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/sipaling-pro
sudo chown -R $USER:$USER /var/www/sipaling-pro

# Create necessary directories
mkdir -p /var/www/sipaling-pro/server/data
mkdir -p /var/www/sipaling-pro/server/uploads/videos
mkdir -p /var/www/sipaling-pro/server/uploads/previews
mkdir -p /var/www/sipaling-pro/server/logs

# Set permissions
chmod 755 /var/www/sipaling-pro/server/uploads
chmod 755 /var/www/sipaling-pro/server/data
chmod 755 /var/www/sipaling-pro/server/logs

echo "✅ System dependencies installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your application files to /var/www/sipaling-pro/"
echo "2. Copy .env file with your configuration"
echo "3. Run: cd /var/www/sipaling-pro/server && npm install"
echo "4. Run: pm2 start index.js --name sipaling-pro"
echo "5. Configure Nginx and SSL"
echo ""
echo "🔧 Use the setup-nginx.sh script to configure Nginx and SSL"