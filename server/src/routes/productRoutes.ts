import { Router } from 'express';
import { getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;
