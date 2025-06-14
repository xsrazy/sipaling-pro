# 🚀 Panduan Instalasi SiPaling.pro dari Nol
## VPS Ubuntu 22.04+ Fresh Install

### 📋 Persyaratan Sistem
- VPS Ubuntu 22.04 atau lebih baru
- RAM minimal 2GB (recommended 4GB+)
- Storage minimal 20GB
- Domain yang sudah pointing ke IP VPS
- Access root atau sudo

---

## 🔧 STEP 1: Persiapan VPS Baru

### 1.1 Update Sistem
```bash
# Login sebagai root atau user dengan sudo
sudo apt update && sudo apt upgrade -y

# Install tools dasar
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### 1.2 Setup Firewall
```bash
# Install dan konfigurasi UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
sudo ufw status
```

### 1.3 Buat User untuk Aplikasi (Opsional tapi Recommended)
```bash
# Buat user khusus untuk aplikasi
sudo adduser sipaling
sudo usermod -aG sudo sipaling

# Switch ke user baru
su - sipaling
```

---

## 🛠 STEP 2: Install Dependencies

### 2.1 Install Node.js 18+
```bash
# Install Node.js menggunakan NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

### 2.2 Install FFmpeg
```bash
# Install FFmpeg untuk video processing
sudo apt install -y ffmpeg

# Verifikasi instalasi
ffmpeg -version
```

### 2.3 Install PM2 (Process Manager)
```bash
# Install PM2 secara global
sudo npm install -g pm2

# Verifikasi instalasi
pm2 --version
```

### 2.4 Install Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Start dan enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Cek status
sudo systemctl status nginx
```

### 2.5 Install Certbot untuk SSL
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verifikasi instalasi
certbot --version
```

---

## 📁 STEP 3: Setup Direktori Aplikasi

### 3.1 Buat Struktur Direktori
```bash
# Buat direktori utama aplikasi
sudo mkdir -p /var/www/sipaling-pro
sudo chown -R $USER:$USER /var/www/sipaling-pro
cd /var/www/sipaling-pro

# Buat subdirectory yang diperlukan
mkdir -p server/data
mkdir -p server/uploads/videos
mkdir -p server/uploads/previews
mkdir -p server/logs
mkdir -p dist
```

### 3.2 Set Permissions
```bash
# Set permission yang benar
chmod 755 /var/www/sipaling-pro
chmod 755 /var/www/sipaling-pro/server/uploads
chmod 755 /var/www/sipaling-pro/server/data
chmod 755 /var/www/sipaling-pro/server/logs
```

---

## 📥 STEP 4: Upload dan Setup Aplikasi

### 4.1 Upload Files ke VPS
Ada beberapa cara untuk upload files:

#### Opsi A: Menggunakan SCP (dari komputer lokal)
```bash
# Dari komputer lokal, upload semua files
scp -r server/ user@your-vps-ip:/var/www/sipaling-pro/
scp -r dist/ user@your-vps-ip:/var/www/sipaling-pro/
scp package.json user@your-vps-ip:/var/www/sipaling-pro/
```

#### Opsi B: Menggunakan Git (Recommended)
```bash
# Clone repository (jika sudah di GitHub)
cd /var/www/sipaling-pro
git clone https://github.com/your-username/sipaling-pro.git .

# Atau download dan extract zip
wget https://github.com/your-username/sipaling-pro/archive/main.zip
unzip main.zip
mv sipaling-pro-main/* .
rm -rf sipaling-pro-main main.zip
```

#### Opsi C: Upload Manual via Panel VPS
- Gunakan file manager di panel VPS Anda
- Upload semua folder dan file ke `/var/www/sipaling-pro/`

### 4.2 Install Dependencies Backend
```bash
cd /var/www/sipaling-pro/server
npm install --production
```

---

## ⚙️ STEP 5: Konfigurasi Environment

### 5.1 Setup Environment Variables
```bash
cd /var/www/sipaling-pro/server
cp .env.example .env
nano .env
```

### 5.2 Edit File .env
Isi konfigurasi sesuai kebutuhan Anda:

```env
# Domain dan Email
DOMAIN=sipaling.pro
ADMIN_EMAIL=admin@sipaling.pro

# Google OAuth (Dapatkan dari Google Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# reCAPTCHA (Dapatkan dari Google reCAPTCHA)
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# RTMP Endpoints
RTMP_YOUTUBE=rtmp://a.rtmp.youtube.com/live2/
RTMP_FACEBOOK=rtmps://live-api-s.facebook.com:443/rtmp/

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
VITE_IP_QUALITY_API_KEY=your-ip-quality-api-key

# Limits
MAX_FILE_SIZE_MB=500
MAX_LIVE_COUNT=7

# Database
DATABASE_URL=sqlite:./data/sipaling.db

# Server
PORT=3000
NODE_ENV=production

# CORS Origins
CORS_ORIGINS=https://sipaling.pro,https://www.sipaling.pro
```

### 5.3 Generate JWT Secret
```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output dan paste ke JWT_SECRET di .env
```

---

## 🗄️ STEP 6: Setup Database

### 6.1 Initialize Database
```bash
cd /var/www/sipaling-pro/server

# Initialize database
node -e "
import('./database/init.js').then(({ initDatabase }) => {
  initDatabase().then(() => {
    console.log('Database initialized successfully');
    process.exit(0);
  }).catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
});
"
```

### 6.2 Verify Database
```bash
# Cek apakah database file sudah dibuat
ls -la /var/www/sipaling-pro/server/data/
# Harus ada file sipaling.db
```

---

## 🌐 STEP 7: Konfigurasi Nginx

### 7.1 Buat Konfigurasi Nginx
```bash
sudo nano /etc/nginx/sites-available/sipaling-pro
```

### 7.2 Isi Konfigurasi Nginx
```nginx
server {
    listen 80;
    server_name sipaling.pro www.sipaling.pro;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Auth routes with stricter rate limiting
    location /api/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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
        try_files $uri $uri/ /index.html;
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
```

### 7.3 Enable Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sipaling-pro /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 STEP 8: Setup SSL Certificate

### 8.1 Install SSL Certificate
```bash
# Install SSL certificate dengan Certbot
sudo certbot --nginx -d sipaling.pro -d www.sipaling.pro

# Ikuti instruksi yang muncul:
# 1. Masukkan email Anda
# 2. Setuju dengan Terms of Service (Y)
# 3. Pilih apakah mau share email (Y/N)
# 4. Pilih redirect HTTP ke HTTPS (2)
```

### 8.2 Setup Auto-renewal
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Setup cron job untuk auto-renewal
sudo crontab -e

# Tambahkan line ini:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🚀 STEP 9: Start Aplikasi

### 9.1 Start dengan PM2
```bash
cd /var/www/sipaling-pro/server

# Start aplikasi
pm2 start index.js --name sipaling-pro

# Save konfigurasi PM2
pm2 save

# Setup PM2 startup
pm2 startup
# Jalankan command yang muncul (biasanya sudo ...)
```

### 9.2 Monitoring
```bash
# Cek status aplikasi
pm2 status

# Lihat logs
pm2 logs sipaling-pro

# Monitor real-time
pm2 monit
```

---

## ✅ STEP 10: Verifikasi Instalasi

### 10.1 Test Backend API
```bash
# Test health check
curl https://sipaling.pro/api/health

# Harus return JSON dengan status "healthy"
```

### 10.2 Test Frontend
```bash
# Buka browser dan akses:
https://sipaling.pro

# Pastikan website loading dengan benar
```

### 10.3 Test Upload Directory
```bash
# Cek permission upload directory
ls -la /var/www/sipaling-pro/server/uploads/
# Pastikan owner dan permission benar
```

---

## 🔧 STEP 11: Konfigurasi Tambahan

### 11.1 Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/sipaling-pro
```

Isi dengan:
```
/var/www/sipaling-pro/server/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 sipaling sipaling
    postrotate
        pm2 reload sipaling-pro
    endscript
}
```

### 11.2 Setup Backup Script
```bash
nano /home/sipaling/backup.sh
```

Isi dengan:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/sipaling-pro"
APP_DIR="/var/www/sipaling-pro"

mkdir -p $BACKUP_DIR

# Backup database
cp $APP_DIR/server/data/sipaling.db $BACKUP_DIR/sipaling_$DATE.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $APP_DIR/server uploads/

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x /home/sipaling/backup.sh

# Setup cron untuk backup harian
crontab -e
# Tambahkan:
0 2 * * * /home/sipaling/backup.sh
```

---

## 🎯 STEP 12: Testing Lengkap

### 12.1 Test Registrasi
1. Buka https://sipaling.pro/register
2. Daftar dengan email @gmail.com
3. Pastikan bisa login

### 12.2 Test Upload Video
1. Login ke dashboard
2. Upload video kecil untuk test
3. Pastikan preview muncul

### 12.3 Test Streaming (Opsional)
1. Dapatkan stream key dari YouTube/Facebook
2. Konfigurasi RTMP di dashboard
3. Test start streaming

---

## 🚨 Troubleshooting

### Jika Aplikasi Tidak Start:
```bash
# Cek logs PM2
pm2 logs sipaling-pro

# Cek logs sistem
sudo journalctl -u nginx
sudo tail -f /var/log/nginx/error.log
```

### Jika Database Error:
```bash
# Reset database
rm /var/www/sipaling-pro/server/data/sipaling.db
cd /var/www/sipaling-pro/server
node -e "import('./database/init.js').then(({initDatabase}) => initDatabase())"
```

### Jika Upload Tidak Bisa:
```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/sipaling-pro/server/uploads
sudo chmod -R 755 /var/www/sipaling-pro/server/uploads
```

### Jika SSL Error:
```bash
# Renew SSL
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## 📞 Support

Jika mengalami masalah:
1. Cek logs di `/var/www/sipaling-pro/server/logs/`
2. Cek PM2 logs: `pm2 logs sipaling-pro`
3. Cek Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

## 🎉 Selesai!

Aplikasi SiPaling.pro sudah siap digunakan di:
- **Frontend**: https://sipaling.pro
- **API**: https://sipaling.pro/api/
- **Dashboard**: https://sipaling.pro/dashboard

**Default Limits:**
- Akun gratis: 7x live streaming
- Resolusi maksimal: 1080p
- Upload maksimal: 10GB per file

Selamat! SiPaling.pro sudah running di VPS Anda! 🚀