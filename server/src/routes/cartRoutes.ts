import { Router } from 'express';
import { addToCart, getCart, applyDiscount, clearCart } from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/add', addToCart);
router.get('/', getCart);
router.post('/discount', applyDiscount);
router.put('/update', async (req: any, res: any, next: any) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    
    const cart = await require('../models/Cart').Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    const item = cart.items.find((item: any) => item.productId.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
    }
    
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});
router.delete('/remove/:productId', async (req: any, res: any, next: any) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    
    const cart = await require('../models/Cart').Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter((item: any) => item.productId.toString() !== productId);
    await cart.save();
    
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});
router.delete('/clear', clearCart);

export default router;
