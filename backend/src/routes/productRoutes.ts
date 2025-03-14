import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

// Basic route to test auth middleware
router.get('/test', auth, (_req, res) => {
  res.json({ message: 'Auth middleware is working' });
});

// TODO: Add product controller and implement routes
// router.get('/', auth, productController.getAllProducts);
// router.post('/', auth, productController.createProduct);
// router.get('/:id', auth, productController.getProduct);
// router.put('/:id', auth, productController.updateProduct);
// router.delete('/:id', auth, productController.deleteProduct);

export default router; 