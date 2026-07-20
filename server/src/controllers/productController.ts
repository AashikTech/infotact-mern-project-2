// CACHE-ASIDE PATTERN:
// 1. Check cache first. 2. On miss, query DB. 3. Save to cache. 4. Return.
// On writes (update/delete), invalidate the cache to prevent stale data.

import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { cacheGet, cacheSet, cacheDelete, cacheDeletePattern } from '../utils/cache';
import { generateEmbedding } from '../utils/embedding';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category as string;

    const cacheKey = `products:all:page:${page}:limit:${limit}:cat:${category || 'all'}`;
    const cachedData = await cacheGet(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      res.status(200).json(cachedData);
      return;
    }

    const query: any = {};
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).select('-embedding').skip(skip).limit(limit);
    const total = await Product.countDocuments(query);

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

    const product = await Product.findById(id).select('-embedding');

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

/**
 * SEARCH:
 * Tries Vector Search first, falls back to text search if Atlas index not configured.
 */
export const semanticSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({ success: false, message: 'Search query required' });
      return;
    }

    // Try vector search first
    try {
      const queryEmbedding = await generateEmbedding(q as string);
      const results = await Product.aggregate([
        {
          $vectorSearch: {
            index: 'default',
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 10,
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            category: 1,
            stock: 1,
            imageUrl: 1,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ] as any[]);

      if (results.length > 0) {
        res.status(200).json({ success: true, data: results });
        return;
      }
    } catch (vectorError) {
      console.log('Vector search failed, falling back to text search');
    }

    // Fallback to text search - get diverse results
    const textResults = await Product.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: q as string, $options: 'i' } },
            { description: { $regex: q as string, $options: 'i' } },
            { category: { $regex: q as string, $options: 'i' } },
          ],
        },
      },
      // Group by name to get unique products
      {
        $group: {
          _id: '$name',
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
      // Limit to 6 unique results
      { $limit: 6 },
      // Exclude embedding field
      { $project: { embedding: 0 } },
    ]);

    res.status(200).json({ success: true, data: textResults });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
};
