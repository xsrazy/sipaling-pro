# SiPaling.pro Backend

Backend server untuk platform live streaming SiPaling.pro yang dibangun dengan Node.js dan Express.

## Fitur

### Autentikasi & Keamanan
- ✅ Register/Login dengan validasi email Gmail
- ✅ JWT token authentication
- ✅ Google OAuth (placeholder)
- ✅ Rate limiting & brute force protection
- ✅ VPN/Proxy detection
- ✅ Multi-account detection
- ✅ Device fingerprinting
- ✅ Security headers (HSTS, CSP, dll)

### Upload & Manajemen Video
- ✅ Upload video hingga 10GB
- ✅ Format support: MP4, MOV, AVI
- ✅ Auto-generate preview WebP
- ✅ Video metadata extraction
- ✅ File validation & security

### Live Streaming
- ✅ RTMP streaming ke YouTube & Facebook
- ✅ Resolusi 144p - 4K (premium untuk 2K/4K)
- ✅ Mode landscape/portrait
- ✅ Auto loop 24/7
- ✅ Scheduled stop dengan cron
- ✅ FFMPEG process management
- ✅ Stream status monitoring

### Limitasi & Premium
- ✅ Akun gratis: max 7x live streaming
- ✅ Akun gratis: max resolusi 1080p
- ✅ Premium: unlimited streaming & 4K

### Monitoring & Logging
- ✅ Activity logs per user
- ✅ Security event logging
- ✅ Daily log rotation
- ✅ Health check endpoints
- ✅ System monitoring

### Email & Notifikasi
- ✅ Welcome email
- ✅ Password reset email
- ✅ Stream notification email
- ✅ SMTP configuration

## Instalasi

### Persyaratan Sistem
- Ubuntu 22.04+ VPS
- Node.js 18+
- FFmpeg
- Nginx
- PM2

### Instalasi Otomatis

1. **Download dan jalankan script instalasi:**
```bash
curl -fsSL https://raw.githubusercontent.com/your-repo/sipaling-pro/main/server/scripts/install.sh | bash
```

2. **Copy aplikasi ke server:**
```bash
# Upload semua file ke /var/www/sipaling-pro/
scp -r . user@your-server:/var/www/sipaling-pro/
```

3. **Setup environment:**
```bash
cd /var/www/sipaling-pro/server
cp .env.example .env
nano .env  # Edit konfigurasi
```

4. **Install dependencies:**
```bash
npm install --production
```

5. **Setup Nginx dan SSL:**
```bash
./scripts/setup-nginx.sh your-domain.com your-email@gmail.com
```

6. **Start aplikasi:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Instalasi Manual

1. **Install dependencies sistem:**
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs ffmpeg nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

2. **Setup aplikasi:**
```bash
mkdir -p /var/www/sipaling-pro
cd /var/www/sipaling-pro
# Copy semua file aplikasi
npm install --production
```

3. **Konfigurasi environment:**
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

4. **Setup database:**
```bash
mkdir -p server/data
node -e "import('./database/init.js').then(({initDatabase}) => initDatabase())"
```

## Konfigurasi

### Environment Variables

Salin `.env.example` ke `.env` dan sesuaikan:

```env
# Domain dan email admin
DOMAIN=sipaling.pro
ADMIN_EMAIL=email@sipaling.pro

# Google OAuth (opsional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# reCAPTCHA (opsional)
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# SMTP untuk email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
JWT_SECRET=your-super-secret-jwt-key
VITE_IP_QUALITY_API_KEY=your-ip-quality-api-key

# Limits
MAX_FILE_SIZE_MB=500
MAX_LIVE_COUNT=7
```

### Nginx Configuration

Script setup otomatis akan mengkonfigurasi Nginx dengan:
- SSL/TLS dengan Let's Encrypt
- Rate limiting
- Security headers
- Gzip compression
- Static file serving
- Reverse proxy ke Node.js

## API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validasi token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth

### Upload
- `POST /api/upload` - Upload video
- `GET /api/upload` - List user videos
- `DELETE /api/upload/:id` - Delete video

### Streaming
- `POST /api/stream/start` - Start live stream
- `POST /api/stream/stop/:id` - Stop live stream
- `GET /api/stream/status` - Get stream status
- `GET /api/stream/config` - Get current config

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/activity` - Get activity logs

### System
- `GET /api/health` - Health check
- `GET /api/health/status` - Detailed status
- `GET /api/config` - Get configuration

## Deployment

### Menggunakan PM2

```bash
# Start aplikasi
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs sipaling-pro

# Restart
pm2 restart sipaling-pro

# Stop
pm2 stop sipaling-pro
```

### Auto Deployment

Gunakan script deployment:

```bash
./scripts/deploy.sh
```

Script ini akan:
1. Backup aplikasi lama
2. Stop aplikasi
3. Update dependencies
4. Migrate database
5. Start aplikasi
6. Reload Nginx

## Monitoring

### Health Check
```bash
curl https://your-domain.com/api/health
```

### System Status
```bash
curl https://your-domain.com/api/health/status
```

### Logs
```bash
# Application logs
tail -f /var/www/sipaling-pro/server/logs/application-*.log

# PM2 logs
pm2 logs sipaling-pro

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Keamanan

### Fitur Keamanan
- Rate limiting per IP
- VPN/Proxy detection
- Multi-account detection
- Device fingerprinting
- Security headers
- Input validation
- SQL injection protection
- XSS protection

### Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### SSL Certificate
Auto-renewal dengan Certbot:
```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### Common Issues

1. **FFMPEG not found:**
```bash
sudo apt install ffmpeg
which ffmpeg  # Should return /usr/bin/ffmpeg
```

2. **Permission denied for uploads:**
```bash
sudo chown -R www-data:www-data /var/www/sipaling-pro/server/uploads
sudo chmod -R 755 /var/www/sipaling-pro/server/uploads
```

3. **Database locked:**
```bash
sudo chown -R $USER:$USER /var/www/sipaling-pro/server/data
```

4. **PM2 not starting:**
```bash
pm2 delete sipaling-pro
pm2 start ecosystem.config.js
```

### Debug Mode

Enable debug logging:
```bash
export LOG_LEVEL=debug
pm2 restart sipaling-pro
```

## Maintenance

### Backup Database
```bash
cp /var/www/sipaling-pro/server/data/sipaling.db /var/backups/sipaling-$(date +%Y%m%d).db
```

### Clean Old Logs
```bash
find /var/www/sipaling-pro/server/logs -name "*.log" -mtime +30 -delete
```

### Update Dependencies
```bash
cd /var/www/sipaling-pro/server
npm update
pm2 restart sipaling-pro
```

## Support

Untuk bantuan teknis:
- Email: email@sipaling.pro
- Documentation: https://sipaling.pro/docs

## License

MIT License - see LICENSE file for details.