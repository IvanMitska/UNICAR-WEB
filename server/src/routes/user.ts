import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = Router();

// Auth middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const session = await prisma.session.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) {
      return res.status(401).json({ error: 'Session expired' });
    }

    (req as any).user = session.user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply auth to all routes
router.use(authenticate);

// ============ PROFILE ============

// Update profile
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
});

router.put('/profile', async (req: Request, res: Response) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = (req as any).user;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        language: true,
        currency: true,
        notifyEmail: true,
        notifyPush: true,
        notifySms: true,
        notifyMarketing: true,
        createdAt: true,
      },
    });

    res.json({ user: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============ SETTINGS ============

// Update settings (language, currency)
const updateSettingsSchema = z.object({
  language: z.string().optional(),
  currency: z.string().optional(),
});

router.put('/settings', async (req: Request, res: Response) => {
  try {
    const data = updateSettingsSchema.parse(req.body);
    const user = (req as any).user;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        language: true,
        currency: true,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update notification settings
const updateNotificationsSchema = z.object({
  notifyEmail: z.boolean().optional(),
  notifyPush: z.boolean().optional(),
  notifySms: z.boolean().optional(),
  notifyMarketing: z.boolean().optional(),
});

router.put('/notifications', async (req: Request, res: Response) => {
  try {
    const data = updateNotificationsSchema.parse(req.body);
    const user = (req as any).user;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        notifyEmail: true,
        notifyPush: true,
        notifySms: true,
        notifyMarketing: true,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// ============ PASSWORD ============

// Change password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

router.put('/password', async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const user = (req as any).user;

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ============ FAVORITES ============

// Get favorites
router.get('/favorites', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ favorites: favorites.map(f => f.carId) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// Add to favorites
const addFavoriteSchema = z.object({
  carId: z.string().min(1),
});

router.post('/favorites', async (req: Request, res: Response) => {
  try {
    const { carId } = addFavoriteSchema.parse(req.body);
    const user = (req as any).user;

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    });

    if (existing) {
      return res.json({ message: 'Already in favorites', favorited: true });
    }

    await prisma.favorite.create({
      data: {
        userId: user.id,
        carId,
      },
    });

    // Get updated count
    const count = await prisma.favorite.count({
      where: { userId: user.id },
    });

    res.json({ message: 'Added to favorites', favorited: true, count });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove from favorites
router.delete('/favorites/:carId', async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const user = (req as any).user;

    await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        carId,
      },
    });

    // Get updated count
    const count = await prisma.favorite.count({
      where: { userId: user.id },
    });

    res.json({ message: 'Removed from favorites', favorited: false, count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Toggle favorite
router.post('/favorites/toggle', async (req: Request, res: Response) => {
  try {
    const { carId } = addFavoriteSchema.parse(req.body);
    const user = (req as any).user;

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      const count = await prisma.favorite.count({ where: { userId: user.id } });
      return res.json({ favorited: false, count });
    } else {
      await prisma.favorite.create({
        data: { userId: user.id, carId },
      });
      const count = await prisma.favorite.count({ where: { userId: user.id } });
      return res.json({ favorited: true, count });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// ============ ACCOUNT ============

// Delete account
router.delete('/account', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Delete user and all related data (cascades)
    await prisma.user.delete({
      where: { id: user.id },
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export { router as userRouter };
