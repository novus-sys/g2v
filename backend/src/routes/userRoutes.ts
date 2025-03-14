import { Router } from 'express';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';
import UserController from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    phone: z.string().optional(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }).optional(),
  }),
});

// Auth routes
router.post('/register', validateRequest(registerSchema), userController.register);
router.post('/login', validateRequest(loginSchema), userController.login);
router.post('/logout', auth, userController.logout);

// User profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, validateRequest(updateProfileSchema), userController.updateProfile);
router.delete('/profile', auth, userController.deleteProfile);

// Password management
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.put('/change-password', auth, userController.changePassword);

export default router; 