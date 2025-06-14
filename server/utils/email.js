import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Create email transporter
const createTransporter = () => {
  if (!process.env.SMTP_HOST) {
    logger.warn('SMTP configuration not found, email features disabled');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const transporter = createTransporter();

// Send welcome email
export const sendWelcomeEmail = async (email, username) => {
  if (!transporter) return false;

  try {
    const mailOptions = {
      from: `"SiPaling.pro" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Selamat Datang di SiPaling.pro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Selamat Datang, ${username}!</h1>
          <p>Terima kasih telah bergabung dengan SiPaling.pro - platform live streaming terbaik Indonesia.</p>
          
          <h2>Fitur yang bisa Anda nikmati:</h2>
          <ul>
            <li>Live streaming 24/7 otomatis</li>
            <li>Resolusi hingga Full HD 1080p</li>
            <li>Support YouTube & Facebook</li>
            <li>Auto loop video tanpa batas</li>
          </ul>
          
          <p>Mulai streaming sekarang juga di dashboard Anda!</p>
          
          <a href="${process.env.DOMAIN}/dashboard" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Buka Dashboard
          </a>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            Tim SiPaling.pro<br>
            <a href="${process.env.DOMAIN}">sipaling.pro</a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  if (!transporter) return false;

  try {
    const resetUrl = `${process.env.DOMAIN}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"SiPaling.pro" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Password - SiPaling.pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Reset Password</h1>
          <p>Anda telah meminta reset password untuk akun SiPaling.pro Anda.</p>
          
          <p>Klik tombol di bawah untuk reset password:</p>
          
          <a href="${resetUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
          
          <p style="color: #666; margin-top: 20px;">
            Link ini akan kedaluwarsa dalam 1 jam.<br>
            Jika Anda tidak meminta reset password, abaikan email ini.
          </p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            Tim SiPaling.pro<br>
            <a href="${process.env.DOMAIN}">sipaling.pro</a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    return false;
  }
};

// Send stream notification email
export const sendStreamNotificationEmail = async (email, username, platform, status) => {
  if (!transporter) return false;

  try {
    const subject = status === 'started' ? 'Live Stream Dimulai' : 'Live Stream Berhenti';
    const statusText = status === 'started' ? 'dimulai' : 'berhenti';
    
    const mailOptions = {
      from: `"SiPaling.pro" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${subject} - SiPaling.pro`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Live Stream ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}</h1>
          <p>Halo ${username},</p>
          
          <p>Live stream Anda ke platform <strong>${platform}</strong> telah ${statusText}.</p>
          
          <a href="${process.env.DOMAIN}/dashboard" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Lihat Dashboard
          </a>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            Tim SiPaling.pro<br>
            <a href="${process.env.DOMAIN}">sipaling.pro</a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Stream notification email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Failed to send stream notification email:', error);
    return false;
  }
};