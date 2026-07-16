import { Request, Response, NextFunction } from 'express';
import { Cart } from '../models/Cart';
import { Discount } from '../models/Discount';

export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = (req as any).user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const cart = await Cart.aggregate([
      { $match: { userId: userId } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $addFields: {
          'items.price': '$product.price',
          'items.name': '$product.name',
          'items.subtotal': { $multiply: ['$product.price', '$items.quantity'] },
        },
      },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          items: { $push: '$items' },
          total: { $sum: '$items.subtotal' },
        },
      },
    ]);

    if (!cart || cart.length === 0) {
      res.status(200).json({ success: true, data: { items: [], total: 0 } });
      return;
    }

    res.status(200).json({ success: true, data: cart[0] });
  } catch (error) {
    next(error);
  }
};

export const applyDiscount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code } = req.body;
    const userId = (req as any).user._id;

    const discount = await Discount.findOne({
      code: code.toUpperCase(),
      active: true,
      expiry: { $gt: new Date() },
    });

    if (!discount) {
      res.status(404).json({ success: false, message: 'Invalid or expired discount code' });
      return;
    }

    const cart = await Cart.aggregate([
      { $match: { userId: userId } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $addFields: {
          'items.subtotal': { $multiply: ['$product.price', '$items.quantity'] },
        },
      },
      {
        $group: {
          _id: '$_id',
          total: { $sum: '$items.subtotal' },
        },
      },
    ]);

    if (!cart || cart.length === 0) {
      res.status(404).json({ success: false, message: 'Cart is empty' });
      return;
    }

    const subtotal = cart[0].total;
    let discountAmount = 0;

    if (discount.percentage) {
      discountAmount = (subtotal * discount.percentage) / 100;
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    res.status(200).json({
      success: true,
      data: {
        code: discount.code,
        percentage: discount.percentage,
        subtotal,
        discountAmount,
        finalTotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
