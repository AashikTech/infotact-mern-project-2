import { Router } from 'express';
import { addToCart, getCart, applyDiscount, clearCart } from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/add', addToCart);
router.get('/', getCart);
router.post('/discount', applyDiscount);
router.delete('/clear', clearCart);

export default router;
