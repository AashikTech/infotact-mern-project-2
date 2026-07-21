import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { config } from '../config';

// Category-specific products with realistic brands and images
const productData: { [category: string]: { name: string; brand: string; price: number; image: string }[] } = {
  'Electronics': [
    { name: 'Wireless Earbuds', brand: 'Sony', price: 79.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400' },
    { name: 'Bluetooth Speaker', brand: 'JBL', price: 49.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
    { name: 'Smart Watch', brand: 'Apple', price: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { name: 'Laptop', brand: 'Dell', price: 899.99, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
    { name: 'Phone', brand: 'Samsung', price: 699.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
    { name: 'Tablet', brand: 'Apple', price: 449.99, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' },
    { name: 'Camera', brand: 'Canon', price: 549.99, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' },
    { name: 'Headphones', brand: 'Sony', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { name: 'Monitor', brand: 'LG', price: 329.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400' },
    { name: 'Keyboard', brand: 'Logitech', price: 79.99, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400' },
    { name: 'Mouse', brand: 'Logitech', price: 29.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' },
    { name: 'Power Bank', brand: 'Anker', price: 39.99, image: 'https://images.unsplash.com/photo-1609091839311-d57672e179ef?w=400' },
  ],
  'Clothing': [
    { name: 'Winter Jacket', brand: 'North Face', price: 189.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
    { name: 'Running Shoes', brand: 'Nike', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { name: 'Denim Jeans', brand: 'Levis', price: 69.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { name: 'Cotton T-Shirt', brand: 'Hanes', price: 19.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { name: 'Hoodie', brand: 'Adidas', price: 59.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
    { name: 'Sneakers', brand: 'Puma', price: 89.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
    { name: 'Formal Shirt', brand: 'Calvin Klein', price: 49.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' },
    { name: 'Track Pants', brand: 'Nike', price: 44.99, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400' },
    { name: 'Sweater', brand: 'Gap', price: 39.99, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a03?w=400' },
    { name: 'Cap', brand: 'New Era', price: 24.99, image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400' },
    { name: 'Backpack', brand: 'JanSport', price: 59.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    { name: 'Sunglasses', brand: 'Ray-Ban', price: 149.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' },
  ],
  'Home & Kitchen': [
    { name: 'Coffee Maker', brand: 'Keurig', price: 119.99, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400' },
    { name: 'Blender', brand: 'Ninja', price: 89.99, image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400' },
    { name: 'Toaster', brand: 'Breville', price: 69.99, image: 'https://images.unsplash.com/photo-1621264448270-9ef00d1a4b37?w=400' },
    { name: 'Air Fryer', brand: 'Philips', price: 149.99, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
    { name: 'Vacuum Cleaner', brand: 'Dyson', price: 399.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400' },
    { name: 'Table Lamp', brand: 'Ikea', price: 34.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400' },
    { name: 'Desk Fan', brand: 'Honeywell', price: 29.99, image: 'https://images.unsplash.com/photo-1567443024551-f3e3cc1be4f6?w=400' },
    { name: 'Water Bottle', brand: 'Hydro Flask', price: 34.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' },
    { name: 'Knife Set', brand: 'Henckels', price: 129.99, image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400' },
    { name: 'Bed Sheet', brand: 'Brooklinen', price: 99.99, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400' },
    { name: 'Pillow', brand: 'Tempur-Pedic', price: 79.99, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400' },
    { name: 'Curtains', brand: 'Ikea', price: 49.99, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400' },
  ],
  'Sports & Outdoors': [
    { name: 'Yoga Mat', brand: 'Manduka', price: 69.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
    { name: 'Dumbbells', brand: 'Bowflex', price: 149.99, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
    { name: 'Resistance Bands', brand: 'TheraBand', price: 19.99, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400' },
    { name: 'Football', brand: 'Nike', price: 29.99, image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400' },
    { name: 'Cricket Bat', brand: 'SS', price: 89.99, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400' },
    { name: 'Basketball', brand: 'Spalding', price: 34.99, image: 'https://images.unsplash.com/photo-1494199501299-19868dde2425?w=400' },
    { name: 'Tennis Racket', brand: 'Wilson', price: 129.99, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400' },
    { name: 'Cycling Helmet', brand: 'Giro', price: 79.99, image: 'https://images.unsplash.com/photo-1557803175-2f0778d0b487?w=400' },
    { name: 'Hiking Boots', brand: 'Merrell', price: 159.99, image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=400' },
    { name: 'Camping Tent', brand: 'Coleman', price: 199.99, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400' },
    { name: 'Jump Rope', brand: 'Rogue', price: 14.99, image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400' },
    { name: 'Boxing Gloves', brand: 'Everlast', price: 49.99, image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400' },
  ],
  'Books': [
    { name: 'JavaScript Guide', brand: 'OReilly', price: 39.99, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
    { name: 'Python Cookbook', brand: 'OReilly', price: 44.99, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400' },
    { name: 'Clean Code', brand: 'Prentice Hall', price: 34.99, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' },
    { name: 'Atomic Habits', brand: 'Penguin', price: 16.99, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
    { name: 'Think and Grow Rich', brand: 'Penguin', price: 14.99, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400' },
    { name: 'Sapiens', brand: 'Harper', price: 18.99, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400' },
    { name: 'The Alchemist', brand: 'Harper', price: 12.99, image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400' },
    { name: 'Harry Potter', brand: 'Bloomsbury', price: 24.99, image: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400' },
    { name: 'Lord of the Rings', brand: 'Houghton Mifflin', price: 29.99, image: 'https://images.unsplash.com/photo-1629992101753-56d196c8adf7?w=400' },
    { name: 'Cookbook', brand: 'Penguin', price: 22.99, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400' },
  ],
  'Toys & Games': [
    { name: 'Building Blocks', brand: 'Lego', price: 49.99, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400' },
    { name: 'Puzzle Set', brand: 'Ravensburger', price: 24.99, image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b0e4?w=400' },
    { name: 'Remote Control Car', brand: 'Hot Wheels', price: 34.99, image: 'https://images.unsplash.com/photo-1581235707795-1e6e98dc9d13?w=400' },
    { name: 'Board Game', brand: 'Hasbro', price: 29.99, image: 'https://images.unsplash.com/photo-1611891488245-49295e28b40f?w=400' },
    { name: 'Action Figure', brand: 'Marvel', price: 19.99, image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400' },
    { name: 'Lego Set', brand: 'Lego', price: 79.99, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400' },
    { name: 'Card Game', brand: 'Uno', price: 9.99, image: 'https://images.unsplash.com/photo-1529480780007-52f8a14f30a4?w=400' },
    { name: 'Robot Kit', brand: 'LEGO Mindstorms', price: 199.99, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400' },
    { name: 'Art Set', brand: 'Crayola', price: 29.99, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400' },
    { name: 'Train Set', brand: 'Bachmann', price: 149.99, image: 'https://images.unsplash.com/photo-1530716058990-8507e5f78f91?w=400' },
  ],
};

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
      if (!usedNames.has(item.name)) {
        usedNames.add(item.name);
        products.push({
          name: item.name,
          description: `${item.brand} ${item.name} - High quality ${item.name.toLowerCase()} for everyday use. Durable and reliable.`,
          price: item.price,
          category,
          stock: Math.floor(Math.random() * 50) + 5,
          imageUrl: item.image,
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
