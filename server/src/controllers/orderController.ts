import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { discountCode } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart is empty' });
      return;
    }

    const orderItems = [];
    let total = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
        return;
      }

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      total += product.price * item.quantity;
    }

    const order = await Order.create({
      userId,
      items: orderItems,
      total,
      discountApplied: discountCode || '',
      status: 'pending',
    });

    for (const item of cart.items) {
      await Product.updateOne(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    }

    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
