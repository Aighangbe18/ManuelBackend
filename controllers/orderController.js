import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { billing, items, total } = req.body;

    if (!billing || !items || !total) {
      return res.status(400).json({ message: "Missing order data" });
    }

    const order = new Order({
      user: req.user._id, // make sure req.user is set via auth middleware
      billing,
      items,
      total,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "✅ Order placed successfully",
      order: savedOrder,
    });
  } catch (err) {
    console.error("❌ Order creation failed:", err.message);
    res.status(500).json({ message: "Failed to create order" });
  }
};
