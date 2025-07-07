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

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Allowlisted origins (add more as needed)
const allowedOrigins = [
  'http://localhost:3000',               // for local dev
  'https://manuel-aig.vercel.app'        // for deployed frontend
];

// ✅ CORS middleware with dynamic origin checking
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Logging middleware
app.use(morgan('dev'));

// ✅ JSON body parsing
app.use(express.json());

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
