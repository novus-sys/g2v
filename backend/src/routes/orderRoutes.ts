import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

// Basic route to test auth middleware
router.get('/test', auth, (_req, res) => {
  res.json({ message: 'Auth middleware is working' });
});

// TODO: Add order controller and implement routes
// router.get('/', auth, orderController.getAllOrders);
// router.post('/', auth, orderController.createOrder);
// router.get('/:id', auth, orderController.getOrder);
// router.put('/:id', auth, orderController.updateOrder);
// router.delete('/:id', auth, orderController.deleteOrder);

export default router; 