import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (q) filter.name = new RegExp(q, 'i'); // case-insensitive search

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// Add a new product (for admin/dev use)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

export default router;
