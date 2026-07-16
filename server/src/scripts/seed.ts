import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { config } from '../config';

const categories = ['Jackets', 'Shoes', 'Electronics', 'Books', 'Toys', 'Home', 'Sports'];
const adjectives = ['Premium', 'Warm', 'Lightweight', 'Insulated', 'Waterproof', 'Smart', 'Eco-friendly'];
const nouns = ['Snow Coat', 'Running Sneakers', 'Wireless Earbuds', 'Yoga Mat', 'Coffee Maker', 'Desk Lamp', 'Backpack', 'Sunglasses', 'Watch', 'Headphones'];

// Mock embedding generator: produces 384 random floats between -1 and 1, normalized.
// TODO: Replace this with real OpenAI embeddings in Week 3.
const generateMockEmbedding = (): number[] => {
  const embedding: number[] = [];
  for (let i = 0; i < 384; i++) {
    embedding.push(Math.random() * 2 - 1);
  }
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
};

const generateProduct = () => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const name = `${adjective} ${noun}`;
  const description = `${name} is a ${adjective.toLowerCase()} ${noun.toLowerCase()} perfect for ${category.toLowerCase()} enthusiasts. High quality and durable.`;
  const price = Math.round((Math.random() * 490 + 10) * 100) / 100;
  const stock = Math.floor(Math.random() * 101);

  return {
    name,
    description,
    price,
    category,
    stock,
    imageUrl: `https://picsum.photos/seed/${Date.now() + Math.random()}/400/400`,
    embedding: generateMockEmbedding(),
  };
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

    const products = [];
    for (let i = 0; i < 5000; i++) {
      products.push(generateProduct());
    }

    const batchSize = 500;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/10`);
    }

    console.log('✅ Seeded 5000 products');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
