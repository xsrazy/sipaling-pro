import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { authenticateToken } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { db } from '../database/init.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/videos');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // 10GB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only MP4, MOV, and AVI files are allowed', 400));
    }
  }
});

// Get video metadata using ffmpeg
const getVideoMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        resolve({
          duration: metadata.format.duration,
          resolution: videoStream ? `${videoStream.width}x${videoStream.height}` : 'unknown',
          format: metadata.format.format_name
        });
      }
    });
  });
};

// Generate video preview (WebP thumbnail)
const generatePreview = async (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['10%'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '640x360'
      })
      .on('end', async () => {
        try {
          // Convert to WebP
          const tempPath = outputPath.replace('.webp', '.png');
          await sharp(tempPath)
            .webp({ quality: 80 })
            .toFile(outputPath);
          
          // Remove temporary PNG
          await fs.unlink(tempPath);
          resolve(outputPath);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
};

// Upload video endpoint
router.post('/', 
  authenticateToken,
  uploadLimiter,
  upload.single('video'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError('No video file provided', 400);
      }

      const userId = req.user.id;
      const file = req.file;
      const ip = req.ip || req.connection.remoteAddress;

      logger.info(`Video upload started: ${file.originalname} by user ${userId}`);

      // Get video metadata
      const metadata = await getVideoMetadata(file.path);

      // Generate preview
      const previewDir = path.join(__dirname, '../uploads/previews');
      await fs.mkdir(previewDir, { recursive: true });
      
      const previewFilename = `${path.parse(file.filename).name}.webp`;
      const previewPath = path.join(previewDir, previewFilename);
      
      await generatePreview(file.path, previewPath);

      // Save to database
      const result = await db.runAsync(
        `INSERT INTO videos (user_id, filename, original_name, file_size, duration, resolution, format, upload_path, preview_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          file.filename,
          file.originalname,
          file.size,
          metadata.duration,
          metadata.resolution,
          metadata.format,
          file.path,
          previewPath
        ]
      );

      // Log activity
      await db.runAsync(
        'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
        [userId, 'VIDEO_UPLOAD', `Uploaded: ${file.originalname}`, ip]
      );

      logger.info(`Video upload completed: ${file.originalname} by user ${userId}`);

      res.json({
        success: true,
        message: 'Video uploaded successfully',
        video: {
          id: result.lastID,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          duration: metadata.duration,
          resolution: metadata.resolution,
          format: metadata.format,
          previewUrl: `/uploads/previews/${previewFilename}`
        }
      });
    } catch (error) {
      // Clean up uploaded file if error occurs
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          logger.error('Failed to clean up uploaded file:', unlinkError);
        }
      }
      next(error);
    }
  }
);

// Get user videos
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const videos = await db.allAsync(
      `SELECT id, filename, original_name, file_size, duration, resolution, format, 
              preview_path, created_at
       FROM videos 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    const videosWithUrls = videos.map(video => ({
      ...video,
      previewUrl: video.preview_path ? `/uploads/previews/${path.basename(video.preview_path)}` : null,
      videoUrl: `/uploads/videos/${video.filename}`
    }));

    res.json({
      success: true,
      videos: videosWithUrls
    });
  } catch (error) {
    next(error);
  }
});

// Delete video
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    const ip = req.ip || req.connection.remoteAddress;

    // Get video info
    const video = await db.getAsync(
      'SELECT * FROM videos WHERE id = ? AND user_id = ?',
      [videoId, userId]
    );

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    // Check if video is being used in active streams
    const activeStream = await db.getAsync(
      'SELECT id FROM streams WHERE video_id = ? AND status IN ("starting", "live")',
      [videoId]
    );

    if (activeStream) {
      throw new AppError('Cannot delete video that is currently being streamed', 400);
    }

    // Delete files
    try {
      await fs.unlink(video.upload_path);
      if (video.preview_path) {
        await fs.unlink(video.preview_path);
      }
    } catch (fileError) {
      logger.warn('Failed to delete video files:', fileError);
    }

    // Delete from database
    await db.runAsync('DELETE FROM videos WHERE id = ?', [videoId]);

    // Log activity
    await db.runAsync(
      'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [userId, 'VIDEO_DELETE', `Deleted: ${video.original_name}`, ip]
    );

    logger.info(`Video deleted: ${video.original_name} by user ${userId}`);

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;