import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { detectVPN, detectMultiAccount, validateGmailOnly, generateDeviceFingerprint } from '../middleware/security.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-50 characters and contain only letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .notEmpty()
    .withMessage('Password required')
];

// Register endpoint
router.post('/register', 
  authLimiter,
  detectVPN,
  detectMultiAccount,
  validateGmailOnly,
  registerValidation,
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

      const { username, email, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      const deviceFingerprint = req.deviceFingerprint;

      // Check if user already exists
      const existingUser = await db.getAsync(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUser) {
        throw new AppError('User already exists', 409);
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const result = await db.runAsync(
        `INSERT INTO users (username, email, password_hash, email_verified) 
         VALUES (?, ?, ?, ?)`,
        [username, email, passwordHash, 1] // Auto-verify for now
      );

      const userId = result.lastID;

      // Generate JWT token
      const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await db.runAsync(
        `INSERT INTO sessions (user_id, token, ip_address, user_agent, device_fingerprint, expires_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, token, ip, userAgent, deviceFingerprint, expiresAt.toISOString()]
      );

      // Log activity
      await db.runAsync(
        'INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
        [userId, 'REGISTER', 'User registered successfully', ip, userAgent]
      );

      logger.info(`User registered: ${email} from IP: ${ip}`);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: userId,
          username,
          email,
          isPremium: false,
          liveCount: 0
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login endpoint
router.post('/login',
  authLimiter,
  detectVPN,
  detectMultiAccount,
  loginValidation,
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

      const { email, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      const deviceFingerprint = req.deviceFingerprint;

      // Get user
      const user = await db.getAsync(
        'SELECT * FROM users WHERE email = ? AND is_active = 1',
        [email]
      );

      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await db.runAsync(
        `INSERT INTO sessions (user_id, token, ip_address, user_agent, device_fingerprint, expires_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, token, ip, userAgent, deviceFingerprint, expiresAt.toISOString()]
      );

      // Update last login
      await db.runAsync(
        'UPDATE users SET last_login = datetime("now") WHERE id = ?',
        [user.id]
      );

      // Log activity
      await db.runAsync(
        'INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
        [user.id, 'LOGIN', 'User logged in successfully', ip, userAgent]
      );

      logger.info(`User logged in: ${email} from IP: ${ip}`);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isPremium: Boolean(user.is_premium),
          liveCount: user.live_count
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Validate token endpoint
router.get('/validate', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      isPremium: Boolean(req.user.is_premium),
      liveCount: req.user.live_count
    }
  });
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res, next) => {
  try {
    const token = req.token;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Remove session
    await db.runAsync('DELETE FROM sessions WHERE token = ?', [token]);

    // Log activity
    await db.runAsync(
      'INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'LOGOUT', 'User logged out', ip, userAgent]
    );

    logger.info(`User logged out: ${req.user.email} from IP: ${ip}`);

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
});

// Google OAuth endpoints (placeholder)
router.get('/google', (req, res) => {
  // Implement Google OAuth redirect
  res.redirect(`https://accounts.google.com/oauth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.DOMAIN}/api/auth/google/callback&scope=email profile&response_type=code`);
});

router.get('/google/callback', async (req, res, next) => {
  try {
    // Implement Google OAuth callback
    // This is a placeholder - implement actual Google OAuth flow
    res.redirect('/login?error=google_oauth_not_implemented');
  } catch (error) {
    next(error);
  }
});

export default router;