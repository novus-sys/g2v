import { Router } from 'express';
import userRoutes from './userRoutes';
import groupRoutes from './groupRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import pointsRoutes from './pointsRoutes';

const router = Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/points', pointsRoutes);

export default router; 