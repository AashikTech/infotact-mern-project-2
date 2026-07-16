import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config';
import { connectRedis } from './config/redis';
import productRoutes from './routes/productRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    await connectRedis();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`\n🔗 Server URL: http://localhost:${config.port}/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
