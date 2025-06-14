import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';
import { DeviceDetector } from 'device-detector-js';
import axios from 'axios';
import { db } from '../database/init.js';
import { logger } from '../utils/logger.js';
import { AppError } from './errorHandler.js';

const deviceDetector = new DeviceDetector();

// VPN/Proxy detection using IP Quality Score API
export const detectVPN = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    
    // Skip VPN detection for localhost and private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return next();
    }

    if (process.env.VITE_IP_QUALITY_API_KEY) {
      const response = await axios.get(`https://ipqualityscore.com/api/json/ip/${process.env.VITE_IP_QUALITY_API_KEY}/${ip}`, {
        timeout: 5000
      });

      const data = response.data;
      
      if (data.vpn || data.proxy || data.tor) {
        await db.runAsync(
          'INSERT INTO security_logs (ip_address, action, details, blocked) VALUES (?, ?, ?, ?)',
          [ip, 'VPN_DETECTED', JSON.stringify(data), 1]
        );

        logger.warn(`VPN/Proxy detected for IP: ${ip}`);
        throw new AppError('VPN/Proxy connections are not allowed', 403);
      }
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    logger.warn('VPN detection failed:', error.message);
    next(); // Continue if VPN detection fails
  }
};

// Device fingerprinting
export const generateDeviceFingerprint = (req) => {
  const userAgent = req.get('User-Agent') || '';
  const acceptLanguage = req.get('Accept-Language') || '';
  const acceptEncoding = req.get('Accept-Encoding') || '';
  const ip = req.ip || req.connection.remoteAddress;
  
  const parser = new UAParser(userAgent);
  const device = deviceDetector.parse(userAgent);
  
  const fingerprint = {
    browser: parser.getBrowser(),
    os: parser.getOS(),
    device: parser.getDevice(),
    deviceType: device.device?.type || 'unknown',
    acceptLanguage,
    acceptEncoding,
    timezone: req.get('X-Timezone') || 'unknown'
  };

  return Buffer.from(JSON.stringify(fingerprint)).toString('base64');
};

// Multi-account detection
export const detectMultiAccount = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const deviceFingerprint = generateDeviceFingerprint(req);

    // Check for multiple accounts from same IP
    const ipAccounts = await db.allAsync(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM sessions 
       WHERE ip_address = ? AND expires_at > datetime("now")`,
      [ip]
    );

    if (ipAccounts[0]?.count > 3) {
      await db.runAsync(
        'INSERT INTO security_logs (ip_address, action, details, blocked) VALUES (?, ?, ?, ?)',
        [ip, 'MULTI_ACCOUNT_IP', `${ipAccounts[0].count} accounts detected`, 1]
      );

      logger.warn(`Multiple accounts detected for IP: ${ip}`);
      throw new AppError('Multiple accounts detected from this IP', 403);
    }

    // Check for multiple accounts from same device
    const deviceAccounts = await db.allAsync(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM sessions 
       WHERE device_fingerprint = ? AND expires_at > datetime("now")`,
      [deviceFingerprint]
    );

    if (deviceAccounts[0]?.count > 2) {
      await db.runAsync(
        'INSERT INTO security_logs (ip_address, action, details, blocked) VALUES (?, ?, ?, ?)',
        [ip, 'MULTI_ACCOUNT_DEVICE', `${deviceAccounts[0].count} accounts detected`, 1]
      );

      logger.warn(`Multiple accounts detected for device: ${deviceFingerprint}`);
      throw new AppError('Multiple accounts detected from this device', 403);
    }

    req.deviceFingerprint = deviceFingerprint;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    logger.error('Multi-account detection failed:', error);
    next(); // Continue if detection fails
  }
};

// Email validation (Gmail only)
export const validateGmailOnly = (req, res, next) => {
  const { email } = req.body;
  
  if (email && !email.toLowerCase().endsWith('@gmail.com')) {
    throw new AppError('Only Gmail addresses are allowed', 400);
  }
  
  next();
};

// Adblock detection middleware
export const detectAdblock = (req, res, next) => {
  // This would typically be handled on the frontend
  // Backend can log if adblock detection headers are sent
  const adblockDetected = req.get('X-Adblock-Detected');
  
  if (adblockDetected === 'true') {
    logger.info(`Adblock detected for IP: ${req.ip}`);
    // You can choose to block or just log
    // For now, we'll just log and continue
  }
  
  next();
};

// Log security events
export const logSecurityEvent = async (ip, action, details, blocked = false) => {
  try {
    await db.runAsync(
      'INSERT INTO security_logs (ip_address, action, details, blocked) VALUES (?, ?, ?, ?)',
      [ip, action, details, blocked ? 1 : 0]
    );
  } catch (error) {
    logger.error('Failed to log security event:', error);
  }
};