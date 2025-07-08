// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/payments.js';

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://manuel-aig.vercel.app',
  'https://manuel-aig-elzc.vercel.app',
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked CORS request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ Middlewares
app.use(morgan('dev'));
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes); // ✅ Moved here after `app` is defined

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
