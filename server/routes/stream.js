import express from 'express';
import { body, validationResult } from 'express-validator';
import ffmpeg from 'fluent-ffmpeg';
import { spawn } from 'child_process';
import cron from 'node-cron';
import { authenticateToken } from '../middleware/auth.js';
import { streamLimiter } from '../middleware/rateLimiter.js';
import { db } from '../database/init.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Store active streams
const activeStreams = new Map();

// RTMP endpoints
const RTMP_ENDPOINTS = {
  youtube: 'rtmp://a.rtmp.youtube.com/live2/',
  facebook: 'rtmps://live-api-s.facebook.com:443/rtmp/'
};

// Resolution settings
const RESOLUTION_SETTINGS = {
  '144p': { width: 256, height: 144, bitrate: '200k' },
  '240p': { width: 426, height: 240, bitrate: '400k' },
  '360p': { width: 640, height: 360, bitrate: '800k' },
  '480p': { width: 854, height: 480, bitrate: '1200k' },
  '720p': { width: 1280, height: 720, bitrate: '2500k' },
  '1080p': { width: 1920, height: 1080, bitrate: '4500k' },
  '2k': { width: 2560, height: 1440, bitrate: '8000k' },
  '4k': { width: 3840, height: 2160, bitrate: '15000k' }
};

// Validation rules
const streamValidation = [
  body('videoId').isInt().withMessage('Valid video ID required'),
  body('platform').isIn(['youtube', 'facebook']).withMessage('Valid platform required'),
  body('streamKey').notEmpty().withMessage('Stream key required'),
  body('resolution').isIn(Object.keys(RESOLUTION_SETTINGS)).withMessage('Valid resolution required'),
  body('mode').isIn(['landscape', 'portrait']).withMessage('Valid mode required'),
  body('autoLoop').isBoolean().withMessage('Auto loop must be boolean'),
  body('scheduledStop').optional().isISO8601().withMessage('Valid date required for scheduled stop')
];

// Start stream endpoint
router.post('/start',
  authenticateToken,
  streamLimiter,
  streamValidation,
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

      const userId = req.user.id;
      const { videoId, platform, streamKey, resolution, mode, autoLoop, scheduledStop } = req.body;
      const ip = req.ip || req.connection.remoteAddress;

      // Check if user has reached live count limit (free users)
      if (!req.user.is_premium && req.user.live_count >= 7) {
        throw new AppError('Live streaming limit reached. Upgrade to premium for unlimited streaming.', 403);
      }

      // Check if resolution is allowed for free users
      const resSettings = RESOLUTION_SETTINGS[resolution];
      if (!req.user.is_premium && ['2k', '4k'].includes(resolution)) {
        throw new AppError('Premium account required for this resolution', 403);
      }

      // Check if user has any active streams
      const activeStream = await db.getAsync(
        'SELECT id FROM streams WHERE user_id = ? AND status IN ("starting", "live")',
        [userId]
      );

      if (activeStream) {
        throw new AppError('You already have an active stream', 400);
      }

      // Get video info
      const video = await db.getAsync(
        'SELECT * FROM videos WHERE id = ? AND user_id = ?',
        [videoId, userId]
      );

      if (!video) {
        throw new AppError('Video not found', 404);
      }

      // Create stream record
      const rtmpUrl = `${RTMP_ENDPOINTS[platform]}${streamKey}`;
      const result = await db.runAsync(
        `INSERT INTO streams (user_id, video_id, platform, stream_key, resolution, mode, auto_loop, scheduled_stop, status, rtmp_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, videoId, platform, streamKey, resolution, mode, autoLoop ? 1 : 0, scheduledStop || null, 'starting', rtmpUrl]
      );

      const streamId = result.lastID;

      // Start FFMPEG process
      const ffmpegProcess = await startFFMPEGStream(video, rtmpUrl, resSettings, mode, autoLoop);
      
      // Store process info
      activeStreams.set(streamId, {
        process: ffmpegProcess,
        userId,
        videoId,
        startTime: new Date()
      });

      // Update stream with PID
      await db.runAsync(
        'UPDATE streams SET ffmpeg_pid = ?, started_at = datetime("now"), status = ? WHERE id = ?',
        [ffmpegProcess.pid, 'live', streamId]
      );

      // Update user live count
      await db.runAsync(
        'UPDATE users SET live_count = live_count + 1 WHERE id = ?',
        [userId]
      );

      // Schedule stop if specified
      if (scheduledStop) {
        scheduleStreamStop(streamId, new Date(scheduledStop));
      }

      // Log activity
      await db.runAsync(
        'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
        [userId, 'STREAM_START', `Started streaming to ${platform}`, ip]
      );

      logger.info(`Stream started: ID ${streamId} by user ${userId} to ${platform}`);

      res.json({
        success: true,
        message: 'Stream started successfully',
        streamId,
        status: 'live'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Stop stream endpoint
router.post('/stop/:id',
  authenticateToken,
  streamLimiter,
  async (req, res, next) => {
    try {
      const streamId = req.params.id;
      const userId = req.user.id;
      const ip = req.ip || req.connection.remoteAddress;

      // Get stream info
      const stream = await db.getAsync(
        'SELECT * FROM streams WHERE id = ? AND user_id = ? AND status IN ("starting", "live")',
        [streamId, userId]
      );

      if (!stream) {
        throw new AppError('Active stream not found', 404);
      }

      // Stop FFMPEG process
      const activeStream = activeStreams.get(parseInt(streamId));
      if (activeStream && activeStream.process) {
        activeStream.process.kill('SIGTERM');
        activeStreams.delete(parseInt(streamId));
      }

      // Update stream status
      await db.runAsync(
        'UPDATE streams SET status = ?, stopped_at = datetime("now") WHERE id = ?',
        ['stopped', streamId]
      );

      // Log activity
      await db.runAsync(
        'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
        [userId, 'STREAM_STOP', `Stopped stream to ${stream.platform}`, ip]
      );

      logger.info(`Stream stopped: ID ${streamId} by user ${userId}`);

      res.json({
        success: true,
        message: 'Stream stopped successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get stream status
router.get('/status', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const streams = await db.allAsync(
      `SELECT s.*, v.original_name as video_name
       FROM streams s
       JOIN videos v ON s.video_id = v.id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC
       LIMIT 10`,
      [userId]
    );

    const streamsWithStatus = streams.map(stream => {
      const isActive = activeStreams.has(stream.id);
      return {
        ...stream,
        isActive,
        autoLoop: Boolean(stream.auto_loop)
      };
    });

    res.json({
      success: true,
      streams: streamsWithStatus
    });
  } catch (error) {
    next(error);
  }
});

// Get current stream config
router.get('/config', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const activeStream = await db.getAsync(
      `SELECT s.*, v.original_name as video_name, v.filename
       FROM streams s
       JOIN videos v ON s.video_id = v.id
       WHERE s.user_id = ? AND s.status IN ("starting", "live")`,
      [userId]
    );

    if (!activeStream) {
      return res.json({
        success: true,
        config: null
      });
    }

    res.json({
      success: true,
      config: {
        streamId: activeStream.id,
        videoName: activeStream.video_name,
        platform: activeStream.platform,
        resolution: activeStream.resolution,
        mode: activeStream.mode,
        autoLoop: Boolean(activeStream.auto_loop),
        scheduledStop: activeStream.scheduled_stop,
        status: activeStream.status,
        startedAt: activeStream.started_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Start FFMPEG streaming process
async function startFFMPEGStream(video, rtmpUrl, resSettings, mode, autoLoop) {
  return new Promise((resolve, reject) => {
    let width = resSettings.width;
    let height = resSettings.height;

    // Swap dimensions for portrait mode
    if (mode === 'portrait') {
      [width, height] = [height, width];
    }

    const ffmpegArgs = [
      '-re',
      '-stream_loop', autoLoop ? '-1' : '0',
      '-i', video.upload_path,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-b:v', resSettings.bitrate,
      '-maxrate', resSettings.bitrate,
      '-bufsize', `${parseInt(resSettings.bitrate) * 2}k`,
      '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ar', '44100',
      '-f', 'flv',
      rtmpUrl
    ];

    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    ffmpegProcess.on('spawn', () => {
      logger.info(`FFMPEG process started with PID: ${ffmpegProcess.pid}`);
      resolve(ffmpegProcess);
    });

    ffmpegProcess.on('error', (error) => {
      logger.error('FFMPEG process error:', error);
      reject(error);
    });

    ffmpegProcess.stderr.on('data', (data) => {
      logger.debug(`FFMPEG stderr: ${data}`);
    });

    ffmpegProcess.on('exit', (code) => {
      logger.info(`FFMPEG process exited with code: ${code}`);
    });
  });
}

// Schedule stream stop
function scheduleStreamStop(streamId, stopTime) {
  const cronExpression = `${stopTime.getMinutes()} ${stopTime.getHours()} ${stopTime.getDate()} ${stopTime.getMonth() + 1} *`;
  
  cron.schedule(cronExpression, async () => {
    try {
      const stream = await db.getAsync(
        'SELECT * FROM streams WHERE id = ? AND status IN ("starting", "live")',
        [streamId]
      );

      if (stream) {
        // Stop FFMPEG process
        const activeStream = activeStreams.get(streamId);
        if (activeStream && activeStream.process) {
          activeStream.process.kill('SIGTERM');
          activeStreams.delete(streamId);
        }

        // Update stream status
        await db.runAsync(
          'UPDATE streams SET status = ?, stopped_at = datetime("now") WHERE id = ?',
          ['stopped', streamId]
        );

        logger.info(`Scheduled stream stop executed for stream ID: ${streamId}`);
      }
    } catch (error) {
      logger.error('Scheduled stream stop failed:', error);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  });
}

// Clean up on process exit
process.on('SIGTERM', () => {
  activeStreams.forEach((stream, streamId) => {
    if (stream.process) {
      stream.process.kill('SIGTERM');
    }
  });
});

export default router;