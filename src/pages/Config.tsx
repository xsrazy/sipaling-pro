import React, { useState } from 'react';
import { Save, Download, Upload, Settings, AlertCircle, CheckCircle } from 'lucide-react';

const Config: React.FC = () => {
  const [config, setConfig] = useState({
    domain: 'sipaling.pro',
    email: 'email@sipaling.pro',
    googleClientId: '',
    googleClientSecret: '',
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
    rtmpYoutube: 'rtmp://a.rtmp.youtube.com/live2/',
    rtmpFacebook: 'rtmps://live-api-s.facebook.com:443/rtmp/',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    jwtSecret: '',
    ipQualityApiKey: '',
    maxFileSize: '500',
    maxLiveCount: '7'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save configuration
    localStorage.setItem('sipaling-config', JSON.stringify(config));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExport = () => {
    const configData = JSON.stringify(config, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sipaling-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedConfig = JSON.parse(event.target?.result as string);
          setConfig(importedConfig);
        } catch (error) {
          alert('File konfigurasi tidak valid');
        }
      };
      reader.readAsText(file);
    }
  };

  const generateEnvFile = () => {
    const envContent = `# SiPaling.pro Configuration
DOMAIN=${config.domain}
ADMIN_EMAIL=${config.email}

# Google OAuth
GOOGLE_CLIENT_ID=${config.googleClientId}
GOOGLE_CLIENT_SECRET=${config.googleClientSecret}

# reCAPTCHA
RECAPTCHA_SITE_KEY=${config.recaptchaSiteKey}
RECAPTCHA_SECRET_KEY=${config.recaptchaSecretKey}

# RTMP Endpoints
RTMP_YOUTUBE=${config.rtmpYoutube}
RTMP_FACEBOOK=${config.rtmpFacebook}

# SMTP Configuration
SMTP_HOST=${config.smtpHost}
SMTP_PORT=${config.smtpPort}
SMTP_USER=${config.smtpUser}
SMTP_PASS=${config.smtpPass}

# Security
JWT_SECRET=${config.jwtSecret}
VITE_IP_QUALITY_API_KEY=${config.ipQualityApiKey}

# Limits
MAX_FILE_SIZE_MB=${config.maxFileSize}
MAX_LIVE_COUNT=${config.maxLiveCount}

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/sipaling_pro

# Server
PORT=3000
NODE_ENV=production
`;

    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
  };

  const configSections = [
    {
      title: 'Pengaturan Dasar',
      fields: [
        { key: 'domain', label: 'Domain', type: 'text', placeholder: 'sipaling.pro' },
        { key: 'email', label: 'Email Admin', type: 'email', placeholder: 'admin@sipaling.pro' }
      ]
    },
    {
      title: 'Google OAuth',
      fields: [
        { key: 'googleClientId', label: 'Google Client ID', type: 'text', placeholder: 'Dapatkan dari Google Console' },
        { key: 'googleClientSecret', label: 'Google Client Secret', type: 'password', placeholder: 'Dapatkan dari Google Console' }
      ]
    },
    {
      title: 'reCAPTCHA',
      fields: [
        { key: 'recaptchaSiteKey', label: 'Site Key', type: 'text', placeholder: 'Dapatkan dari Google reCAPTCHA' },
        { key: 'recaptchaSecretKey', label: 'Secret Key', type: 'password', placeholder: 'Dapatkan dari Google reCAPTCHA' }
      ]
    },
    {
      title: 'RTMP Endpoints',
      fields: [
        { key: 'rtmpYoutube', label: 'YouTube RTMP', type: 'text', placeholder: 'rtmp://a.rtmp.youtube.com/live2/' },
        { key: 'rtmpFacebook', label: 'Facebook RTMP', type: 'text', placeholder: 'rtmps://live-api-s.facebook.com:443/rtmp/' }
      ]
    },
    {
      title: 'Email SMTP',
      fields: [
        { key: 'smtpHost', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com' },
        { key: 'smtpPort', label: 'SMTP Port', type: 'number', placeholder: '587' },
        { key: 'smtpUser', label: 'SMTP Username', type: 'email', placeholder: 'your-email@gmail.com' },
        { key: 'smtpPass', label: 'SMTP Password', type: 'password', placeholder: 'App Password' }
      ]
    },
    {
      title: 'Keamanan',
      fields: [
        { key: 'jwtSecret', label: 'JWT Secret', type: 'password', placeholder: 'Random string untuk JWT' },
        { key: 'ipQualityApiKey', label: 'IP Quality API Key', type: 'password', placeholder: 'Untuk deteksi VPN/Proxy' }
      ]
    },
    {
      title: 'Batasan Sistem',
      fields: [
        { key: 'maxFileSize', label: 'Max File Size (MB)', type: 'number', placeholder: '200' },
        { key: 'maxLiveCount', label: 'Max Live Count (Gratis)', type: 'number', placeholder: '3' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Konfigurasi Server
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Atur konfigurasi server sebelum deploy ke VPS
          </p>
        </div>

        {/* Alert */}
        <div className="mb-4 sm:mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm sm:text-base">
              Penting: Isi semua konfigurasi sebelum deploy ke VPS
            </p>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm mt-2">
            Konfigurasi ini akan digunakan untuk setup otomatis server production
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 sm:mb-6 flex flex-wrap gap-3 sm:gap-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            {isSaved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{isSaved ? 'Tersimpan!' : 'Simpan Config'}</span>
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </button>
          
          <label className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer text-sm sm:text-base">
            <Upload className="h-4 w-4" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={generateEnvFile}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            <Settings className="h-4 w-4" />
            <span>Generate .env</span>
          </button>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-4 sm:space-y-6">
          {configSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                {section.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <input
                      id={field.key}
                      type={field.type}
                      value={config[field.key as keyof typeof config]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm sm:text-base"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 sm:mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 sm:mb-4">
            Petunjuk Deploy
          </h3>
          <ol className="space-y-2 text-blue-800 dark:text-blue-200 text-sm sm:text-base">
            <li className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <span>Isi semua konfigurasi yang diperlukan</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <span>Klik "Generate .env" untuk download file environment</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <span>Upload file .env ke server VPS</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-medium">4.</span>
              <span>Jalankan script installer otomatis</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Config;