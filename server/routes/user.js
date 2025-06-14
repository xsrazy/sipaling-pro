import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../database/init.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await db.getAsync(
      `SELECT id, username, email, is_premium, live_count, created_at, last_login
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        ...user,
        isPremium: Boolean(user.is_premium)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get video count
    const videoCount = await db.getAsync(
      'SELECT COUNT(*) as count FROM videos WHERE user_id = ?',
      [userId]
    );

    // Get total streaming time
    const streamingTime = await db.getAsync(
      `SELECT SUM(
         CASE 
           WHEN stopped_at IS NOT NULL THEN 
             (julianday(stopped_at) - julianday(started_at)) * 24 * 60 * 60
           ELSE 0
         END
       ) as total_seconds
       FROM streams WHERE user_id = ?`,
      [userId]
    );

    // Get recent activity
    const recentActivity = await db.allAsync(
      `SELECT action, details, created_at
       FROM activity_logs
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    res.json({
      success: true,
      stats: {
        videoCount: videoCount.count || 0,
        liveCount: req.user.live_count || 0,
        totalStreamingTime: Math.round(streamingTime.total_seconds || 0),
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user activity logs
router.get('/activity', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const activities = await db.allAsync(
      `SELECT action, details, ip_address, created_at
       FROM activity_logs
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const totalCount = await db.getAsync(
      'SELECT COUNT(*) as count FROM activity_logs WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      activities,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;