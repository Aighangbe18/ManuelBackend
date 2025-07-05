import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/orderRoutes.js'; // ✅ Order routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default root route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// API routes
app.use('/api/auth', authRoutes);         // e.g., /api/auth/register, /login
app.use('/api/products', productRoutes);  // e.g., /api/products
app.use('/api/orders', orderRoutes);      // e.g., /api/orders (protected routes)

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit on DB connection error
  });
