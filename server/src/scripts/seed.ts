import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { config } from '../config';

// Better, more realistic categories
const productData = {
  'Electronics': [
    'Wireless Earbuds', 'Bluetooth Speaker', 'Smart Watch', 'Laptop', 'Phone',
    'Tablet', 'Camera', 'Headphones', 'Monitor', 'Keyboard', 'Mouse', 'Charger',
    'Power Bank', 'USB Cable', 'Webcam', 'Microphone', 'Drone', 'TV', 'Soundbar'
  ],
  'Clothing': [
    'Winter Jacket', 'Running Shoes', 'Denim Jeans', 'Cotton T-Shirt', 'Hoodie',
    'Sneakers', 'Formal Shirt', 'Track Pants', 'Sweater', 'Cap', 'Socks',
    'Gloves', 'Scarf', 'Raincoat', 'Shorts', 'Sunglasses', 'Backpack', 'Belt'
  ],
  'Home & Kitchen': [
    'Coffee Maker', 'Blender', 'Toaster', 'Air Fryer', 'Vacuum Cleaner',
    'Table Lamp', 'Desk Fan', 'Water Bottle', 'Food Container', 'Knife Set',
    'Cutting Board', 'Mug Set', 'Bed Sheet', 'Pillow', 'Curtains', 'Rug'
  ],
  'Sports & Outdoors': [
    'Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Running Watch', 'Football',
    'Cricket Bat', 'Basketball', 'Tennis Racket', 'Cycling Helmet', 'Hiking Boots',
    'Camping Tent', 'Sleeping Bag', 'Water Bottle', 'Jump Rope', 'Boxing Gloves'
  ],
  'Books': [
    'JavaScript Guide', 'Python Cookbook', 'Design Patterns', 'Clean Code',
    'Atomic Habits', 'Think and Grow Rich', 'Sapiens', 'The Alchemist',
    'Harry Potter', 'Lord of the Rings', 'Science Fiction Novel', 'Cookbook'
  ],
  'Toys & Games': [
    'Building Blocks', 'Puzzle Set', 'Remote Control Car', 'Board Game',
    'Action Figure', 'Doll House', 'Lego Set', 'Card Game', 'Drone Toy',
    'Robot Kit', 'Art Set', 'Play Dough', 'Yo-Yo', 'Train Set'
  ]
};

const adjectives = ['Premium', 'Classic', 'Pro', 'Ultra', 'Essential', 'Elite', 'Advanced', 'Basic'];
const brands = ['Nike', 'Apple', 'Samsung', 'Sony', 'Adidas', 'Puma', 'LG', 'Dell', 'HP', 'Lenovo', 'Boat', 'JBL', 'Canon', 'Nikon'];

const generateMockEmbedding = (): number[] => {
  const embedding: number[] = [];
  for (let i = 0; i < 384; i++) {
    embedding.push(Math.random() * 2 - 1);
  }
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
};

const generateProducts = () => {
  const products = [];
  const usedNames = new Set();

  for (const [category, items] of Object.entries(productData)) {
    for (const item of items) {
      // Base product
      if (!usedNames.has(item)) {
        usedNames.add(item);
        products.push({
          name: item,
          description: `High quality ${item.toLowerCase()} for everyday use. Durable and reliable.`,
          price: Math.round((Math.random() * 400 + 20) * 100) / 100,
          category,
          stock: Math.floor(Math.random() * 50) + 5,
          imageUrl: `https://picsum.photos/seed/${item.replace(/\s/g, '-')}/400/400`,
          embedding: generateMockEmbedding(),
        });
      }

      // Premium/branded version
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];
      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const brandedName = `${randomBrand} ${randomAdj} ${item}`;
      if (!usedNames.has(brandedName)) {
        usedNames.add(brandedName);
        products.push({
          name: brandedName,
          description: `${randomAdj} ${item.toLowerCase()} by ${randomBrand}. Premium quality and design.`,
          price: Math.round((Math.random() * 300 + 50) * 100) / 100,
          category,
          stock: Math.floor(Math.random() * 30) + 5,
          imageUrl: `https://picsum.photos/seed/${brandedName.replace(/\s/g, '-')}/400/400`,
          embedding: generateMockEmbedding(),
        });
      }
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

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const products = generateProducts();
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
