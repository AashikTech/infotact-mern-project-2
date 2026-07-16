// CACHE-ASIDE PATTERN:
// 1. Check cache first. 2. On miss, query DB. 3. Save to cache. 4. Return.
// On writes (update/delete), invalidate the cache to prevent stale data.

import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { cacheGet, cacheSet, cacheDelete, cacheDeletePattern } from '../utils/cache';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `products:all:page:${page}:limit:${limit}`;
    const cachedData = await cacheGet(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      res.status(200).json(cachedData);
      return;
    }

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    const responseData = {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    await cacheSet(cacheKey, responseData, 3600);

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    const cachedProduct = await cacheGet(cacheKey);

    if (cachedProduct) {
      res.setHeader('X-Cache', 'HIT');
      res.status(200).json(cachedProduct);
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const responseData = { success: true, data: product };
    await cacheSet(cacheKey, responseData, 3600);

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // CACHE INVALIDATION: delete single product cache + all list caches
    await cacheDelete(`product:${id}`);
    await cacheDeletePattern('products:all:*');

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // CACHE INVALIDATION: delete single product cache + all list caches
    await cacheDelete(`product:${id}`);
    await cacheDeletePattern('products:all:*');

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
