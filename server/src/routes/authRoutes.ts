import { Router } from 'express';
import { register, login, getMe, createAdmin, getAllUsers } from '../controllers/authController';
import { googleLogin, googleCallback } from '../controllers/googleAuthController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/google/callback', googleCallback);

// Protected routes (any authenticated user)
router.get('/me', authenticate, getMe);

// Admin only routes
router.post('/create-admin', authenticate, authorizeAdmin, createAdmin);
router.get('/users', authenticate, authorizeAdmin, getAllUsers);

export default router;
