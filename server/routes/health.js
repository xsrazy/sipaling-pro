import express from 'express';
import { db } from '../database/init.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Check database connection
    await db.getAsync('SELECT 1');
    
    const dbResponseTime = Date.now() - startTime;
    
    // Get system stats
    const stats = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: 'connected',
        responseTime: `${dbResponseTime}ms`
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    res.json(stats);
  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Detailed system status (for monitoring)
router.get('/status', async (req, res) => {
  try {
    // Get database stats
    const userCount = await db.getAsync('SELECT COUNT(*) as count FROM users');
    const activeStreams = await db.getAsync('SELECT COUNT(*) as count FROM streams WHERE status IN ("starting", "live")');
    const totalVideos = await db.getAsync('SELECT COUNT(*) as count FROM videos');
    
    // Get recent activity
    const recentActivity = await db.allAsync(
      'SELECT action, COUNT(*) as count FROM activity_logs WHERE created_at > datetime("now", "-1 hour") GROUP BY action'
    );

    const status = {
      system: {
        status: 'operational',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      database: {
        users: userCount.count,
        activeStreams: activeStreams.count,
        totalVideos: totalVideos.count
      },
      activity: recentActivity
    };

    res.json(status);
  } catch (error) {
    logger.error('Status check failed:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;