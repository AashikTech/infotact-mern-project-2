import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { config } from '../config';

const categories = ['Jackets', 'Shoes', 'Electronics', 'Books', 'Toys', 'Home', 'Sports'];
const adjectives = ['Premium', 'Warm', 'Lightweight', 'Insulated', 'Waterproof', 'Smart', 'Eco-friendly'];
const nouns = ['Snow Coat', 'Running Sneakers', 'Wireless Earbuds', 'Yoga Mat', 'Coffee Maker', 'Desk Lamp', 'Backpack', 'Sunglasses', 'Watch', 'Headphones'];

// Mock embedding generator
const generateMockEmbedding = (): number[] => {
  const embedding: number[] = [];
  for (let i = 0; i < 384; i++) {
    embedding.push(Math.random() * 2 - 1);
  }
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
};

// Generate unique products - no duplicates
const generateUniqueProducts = (count: number) => {
  const products = [];
  const usedNames = new Set();

  // First: generate all unique adjective + noun combinations
  for (const adj of adjectives) {
    for (const noun of nouns) {
      const name = `${adj} ${noun}`;
      if (!usedNames.has(name)) {
        usedNames.add(name);
        const category = categories[Math.floor(Math.random() * categories.length)];
        products.push({
          name,
          description: `${name} is a ${adj.toLowerCase()} ${noun.toLowerCase()} perfect for ${category.toLowerCase()} enthusiasts. High quality and durable.`,
          price: Math.round((Math.random() * 490 + 10) * 100) / 100,
          category,
          stock: Math.floor(Math.random() * 101),
          imageUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '-')}/400/400`,
          embedding: generateMockEmbedding(),
        });
      }
    }
  }

  // Add more unique products with brand names if needed
  const brands = ['Nike', 'Apple', 'Samsung', 'Sony', 'Adidas', 'Puma', 'LG', 'Dell', 'HP', 'Lenovo'];
  const extraProducts = ['Laptop', 'Phone', 'Tablet', 'Camera', 'Speaker', 'Keyboard', 'Mouse', 'Monitor', 'Printer', 'Scanner'];

  for (const brand of brands) {
    for (const extra of extraProducts) {
      const name = `${brand} ${extra}`;
      if (!usedNames.has(name) && products.length < count) {
        usedNames.add(name);
        const category = categories[Math.floor(Math.random() * categories.length)];
        products.push({
          name,
          description: `${name} - High quality ${extra.toLowerCase()} from ${brand}. Perfect for ${category.toLowerCase()} enthusiasts.`,
          price: Math.round((Math.random() * 490 + 10) * 100) / 100,
          category,
          stock: Math.floor(Math.random() * 101),
          imageUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '-')}/400/400`,
          embedding: generateMockEmbedding(),
        });
      }
    }
  }

  return products.slice(0, count);
};

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const products = generateUniqueProducts(500);
    console.log(`Generated ${products.length} unique products`);

    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
    }

    console.log(`✅ Seeded ${products.length} unique products`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
