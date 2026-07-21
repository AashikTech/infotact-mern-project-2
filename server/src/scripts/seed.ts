import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { config } from '../config';
import { resolveProductImage } from '../utils/imageResolver';

type ProductCategory = 'Electronics' | 'Clothing' | 'Home & Kitchen' | 'Sports & Outdoors' | 'Books' | 'Toys & Games';

const productData: { [category: string]: string[] } = {
  'Electronics': [
    'Wireless Earbuds', 'Bluetooth Speaker', 'Smart Watch', 'Laptop', 'Phone',
    'Tablet', 'Camera', 'Headphones', 'Monitor', 'Keyboard', 'Mouse', 'Power Bank'
  ],
  'Clothing': [
    'Winter Jacket', 'Running Shoes', 'Denim Jeans', 'Cotton T-Shirt', 'Hoodie',
    'Sneakers', 'Formal Shirt', 'Track Pants', 'Sweater', 'Cap', 'Backpack', 'Sunglasses'
  ],
  'Home & Kitchen': [
    'Coffee Maker', 'Blender', 'Toaster', 'Air Fryer', 'Vacuum Cleaner',
    'Table Lamp', 'Desk Fan', 'Water Bottle', 'Knife Set', 'Bed Sheet', 'Pillow', 'Curtains'
  ],
  'Sports & Outdoors': [
    'Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Football', 'Cricket Bat',
    'Basketball', 'Tennis Racket', 'Cycling Helmet', 'Hiking Boots', 'Camping Tent', 'Jump Rope', 'Boxing Gloves'
  ],
  'Books': [
    'JavaScript Guide', 'Python Cookbook', 'Clean Code', 'Atomic Habits',
    'Think and Grow Rich', 'Sapiens', 'The Alchemist', 'Harry Potter', 'Cookbook'
  ],
  'Toys & Games': [
    'Building Blocks', 'Puzzle Set', 'Remote Control Car', 'Board Game',
    'Action Figure', 'Lego Set', 'Card Game', 'Robot Kit', 'Art Set', 'Train Set'
  ],
};

const brands: { [key: string]: string[] } = {
  'Electronics': ['Sony', 'Samsung', 'Apple', 'Dell', 'LG', 'Logitech', 'JBL', 'Canon'],
  'Clothing': ['Nike', 'Adidas', 'Puma', 'Levis', 'Hanes', 'Ray-Ban', 'North Face'],
  'Home & Kitchen': ['Keurig', 'Ninja', 'Dyson', 'Philips', 'Ikea', 'Hamilton Beach', 'Cuisinart', 'Vitamix'],
  'Sports & Outdoors': ['Nike', 'Wilson', 'Coleman', 'Manduka', 'Spalding', 'Everlast', 'Under Armour', 'Adidas'],
  'Books': ['OReilly', 'Penguin', 'Harper', 'Bloomsbury'],
  'Toys & Games': ['Lego', 'Hasbro', 'Hot Wheels', 'Ravensburger', 'Crayola'],
};

const generateMockEmbedding = (text: string): number[] => {
  const embedding: number[] = [];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash;
  }
  for (let i = 0; i < 384; i++) {
    const seed = Math.abs(hash) + i * 7919;
    embedding.push(Math.sin(seed) * 0.9);
  }
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
};

const generateProducts = () => {
  const products = [];
  let id = 1;

  for (const [category, items] of Object.entries(productData)) {
    const categoryBrands = brands[category] || [];
    for (const item of items) {
      const brand = categoryBrands[id % categoryBrands.length];
      const productName = `${brand} ${item}`;
      products.push({
        name: productName,
        description: `High quality ${item.toLowerCase()} from ${brand}. Perfect for ${category.toLowerCase()} enthusiasts. Durable and reliable.`,
        price: Math.round((Math.random() * 300 + 20) * 100) / 100,
        category,
        stock: Math.floor(Math.random() * 50) + 5,
        imageUrl: resolveProductImage(productName, category as ProductCategory, id),
        embedding: generateMockEmbedding(`${brand} ${item} ${category}`),
      });
      id++;
    }
  }

  return products;
};

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Check if products already exist
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} products. Skipping seed.`);
      console.log('To re-seed, first run: npm run seed:reset');
      process.exit(0);
    }

    const products = generateProducts();
    console.log(`Generated ${products.length} products`);

    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
    }

    // Verify category counts
    for (const category of Object.keys(productData)) {
      const count = await Product.countDocuments({ category });
      console.log(`${category}: ${count} products`);
    }

    console.log(`✅ Seeded ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
