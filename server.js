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

// ✅ Allowlisted origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',               // local dev
  'https://manuel-aig.vercel.app'        // production frontend
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ Allow request
    } else {
      console.warn(`❌ Blocked CORS request from: ${origin}`);
      callback(null, false); // ✅ Deny silently (no crash)
    }
  },
  credentials: true, // ✅ Allow cookies and headers
}));

// ✅ Middleware
app.use(morgan('dev'));
app.use(express.json()); // parse JSON bodies

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
