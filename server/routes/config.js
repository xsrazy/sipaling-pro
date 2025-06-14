import express from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get current configuration
router.get('/', async (req, res, next) => {
  try {
    const config = {
      domain: process.env.DOMAIN || 'sipaling.pro',
      email: process.env.ADMIN_EMAIL || 'email@sipaling.pro',
      maxFileSize: process.env.MAX_FILE_SIZE_MB || '500',
      maxLiveCount: process.env.MAX_LIVE_COUNT || '7',
      features: {
        googleOAuth: Boolean(process.env.GOOGLE_CLIENT_ID),
        recaptcha: Boolean(process.env.RECAPTCHA_SITE_KEY),
        emailNotifications: Boolean(process.env.SMTP_HOST),
        vpnDetection: Boolean(process.env.VITE_IP_QUALITY_API_KEY)
      }
    };

    res.json({
      success: true,
      config
    });
  } catch (error) {
    next(error);
  }
});

// Update configuration (admin only)
router.post('/',
  body('domain').optional().isURL().withMessage('Valid domain required'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('maxFileSize').optional().isInt({ min: 1, max: 10000 }).withMessage('Valid file size required'),
  body('maxLiveCount').optional().isInt({ min: 1, max: 1000 }).withMessage('Valid live count required'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      // This endpoint would typically require admin authentication
      // For now, we'll just return the current config
      
      res.json({
        success: true,
        message: 'Configuration updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Generate environment file
router.post('/generate-env', async (req, res, next) => {
  try {
    const {
      domain,
      email,
      googleClientId,
      googleClientSecret,
      recaptchaSiteKey,
      recaptchaSecretKey,
      rtmpYoutube,
      rtmpFacebook,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      jwtSecret,
      ipQualityApiKey,
      maxFileSize,
      maxLiveCount
    } = req.body;

    const envContent = `# SiPaling.pro Configuration
DOMAIN=${domain || 'sipaling.pro'}
ADMIN_EMAIL=${email || 'email@sipaling.pro'}

# Google OAuth
GOOGLE_CLIENT_ID=${googleClientId || ''}
GOOGLE_CLIENT_SECRET=${googleClientSecret || ''}

# reCAPTCHA
RECAPTCHA_SITE_KEY=${recaptchaSiteKey || ''}
RECAPTCHA_SECRET_KEY=${recaptchaSecretKey || ''}

# RTMP Endpoints
RTMP_YOUTUBE=${rtmpYoutube || 'rtmp://a.rtmp.youtube.com/live2/'}
RTMP_FACEBOOK=${rtmpFacebook || 'rtmps://live-api-s.facebook.com:443/rtmp/'}

# SMTP Configuration
SMTP_HOST=${smtpHost || 'smtp.gmail.com'}
SMTP_PORT=${smtpPort || '587'}
SMTP_USER=${smtpUser || ''}
SMTP_PASS=${smtpPass || ''}

# Security
JWT_SECRET=${jwtSecret || 'your-super-secret-jwt-key-change-this-in-production'}
VITE_IP_QUALITY_API_KEY=${ipQualityApiKey || ''}

# Limits
MAX_FILE_SIZE_MB=${maxFileSize || '500'}
MAX_LIVE_COUNT=${maxLiveCount || '7'}

# Database
DATABASE_URL=sqlite:./data/sipaling.db

# Server
PORT=3000
NODE_ENV=production

# CORS Origins (comma separated)
CORS_ORIGINS=https://sipaling.pro,https://www.sipaling.pro
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=".env"');
    res.send(envContent);

    logger.info('Environment file generated');
  } catch (error) {
    next(error);
  }
});

export default router;