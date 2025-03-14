import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

// Basic route to test auth middleware
router.get('/test', auth, (_req, res) => {
  res.json({ message: 'Auth middleware is working' });
});

// TODO: Add points controller and implement routes
// router.get('/', auth, pointsController.getPoints);
// router.post('/earn', auth, pointsController.earnPoints);
// router.post('/redeem', auth, pointsController.redeemPoints);
// router.get('/history', auth, pointsController.getPointsHistory);

export default router; 