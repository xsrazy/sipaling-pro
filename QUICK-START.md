# 🚀 Quick Start Guide - SiPaling.pro

Panduan cepat untuk install SiPaling.pro di VPS Ubuntu 22.04+ yang baru di-rebuild.

## 📋 Persyaratan
- VPS Ubuntu 22.04+
- Domain yang sudah pointing ke IP VPS
- Access root/sudo
- RAM minimal 2GB

## ⚡ Instalasi Super Cepat (5 Menit)

### 1. Download dan Jalankan Script Auto-Install
```bash
# Login ke VPS sebagai user biasa (bukan root)
wget https://raw.githubusercontent.com/your-repo/sipaling-pro/main/server/scripts/quick-install.sh
chmod +x quick-install.sh
./quick-install.sh
```

### 2. Upload Files Aplikasi
```bash
# Opsi A: Upload via SCP dari komputer lokal
scp -r server/ user@your-vps:/var/www/sipaling-pro/
scp -r dist/ user@your-vps:/var/www/sipaling-pro/

# Opsi B: Clone dari GitHub
cd /var/www/sipaling-pro
git clone https://github.com/your-username/sipaling-pro.git .
```

### 3. Konfigurasi Environment
```bash
cd /var/www/sipaling-pro/server
cp .env.example .env
nano .env  # Edit sesuai kebutuhan
```

### 4. Jalankan Setup Lengkap
```bash
cd /var/www/sipaling-pro
wget https://raw.githubusercontent.com/your-repo/sipaling-pro/main/server/scripts/complete-setup.sh
chmod +x complete-setup.sh
./complete-setup.sh
```

## ✅ Selesai!

Aplikasi akan tersedia di:
- **Website**: https://your-domain.com
- **Dashboard**: https://your-domain.com/dashboard
- **API**: https://your-domain.com/api/

## 🔧 Monitoring

```bash
# Cek status aplikasi
pm2 status

# Lihat logs
pm2 logs sipaling-pro

# Monitor real-time
pm2 monit
```

## 🆘 Troubleshooting

Jika ada masalah:
1. Cek logs: `pm2 logs sipaling-pro`
2. Restart: `pm2 restart sipaling-pro`
3. Cek Nginx: `sudo nginx -t`
4. Lihat panduan lengkap di `INSTALL.md`

---

**Total waktu instalasi: ~5-10 menit** ⚡