import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/sipaling.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

// Promisify database methods
db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

export const initDatabase = async () => {
  try {
    // Create users table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_premium BOOLEAN DEFAULT 0,
        live_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        is_active BOOLEAN DEFAULT 1,
        email_verified BOOLEAN DEFAULT 0,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expires DATETIME
      )
    `);

    // Create videos table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_size INTEGER NOT NULL,
        duration REAL,
        resolution VARCHAR(20),
        format VARCHAR(10),
        upload_path VARCHAR(500) NOT NULL,
        preview_path VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create streams table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS streams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        video_id INTEGER NOT NULL,
        platform VARCHAR(20) NOT NULL,
        stream_key VARCHAR(255) NOT NULL,
        resolution VARCHAR(20) NOT NULL,
        mode VARCHAR(20) NOT NULL,
        auto_loop BOOLEAN DEFAULT 1,
        scheduled_stop DATETIME,
        status VARCHAR(20) DEFAULT 'idle',
        ffmpeg_pid INTEGER,
        rtmp_url VARCHAR(500),
        started_at DATETIME,
        stopped_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE
      )
    `);

    // Create sessions table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        device_fingerprint VARCHAR(255),
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create activity_logs table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      )
    `);

    // Create security_logs table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS security_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address VARCHAR(45) NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        blocked BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions (token)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_streams_user_id ON streams (user_id)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_streams_status ON streams (status)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs (user_id)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON security_logs (ip_address)');

    logger.info('✅ Database initialized successfully');
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export { db };