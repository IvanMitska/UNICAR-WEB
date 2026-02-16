import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../lib/email';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Validation schemas
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Register
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
      },
    });

    // Create session
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.firstName).catch(console.error);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save reset token
    await prisma.passwordReset.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email
    await sendPasswordResetEmail(user.email, resetToken, user.firstName);

    res.json({ message: 'If an account exists, a reset link has been sent' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    // Find valid reset token
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token: data.token },
      include: { user: true },
    });

    if (!passwordReset || passwordReset.used || passwordReset.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { used: true },
    });

    // Invalidate all sessions
    await prisma.session.deleteMany({
      where: { userId: passwordReset.userId },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Session expired' });
    }

    res.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        phone: session.user.phone,
        language: session.user.language,
        currency: session.user.currency,
        notifyEmail: session.user.notifyEmail,
        notifyPush: session.user.notifyPush,
        notifySms: session.user.notifySms,
        notifyMarketing: session.user.notifyMarketing,
        createdAt: session.user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await prisma.session.delete({ where: { token } }).catch(() => {});
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.json({ message: 'Logged out successfully' });
  }
});

export { router as authRouter };
