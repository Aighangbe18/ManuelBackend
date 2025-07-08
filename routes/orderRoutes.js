// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { sendOrderEmail } from "../utils/sendEmail.js";

const router = express.Router();

// ✅ POST /api/orders - Place an order & send email
router.post("/", protect, async (req, res) => {
  const { billing, items, total } = req.body;

  if (!billing || !items || !total) {
    return res.status(400).json({ message: "Missing order data" });
  }

  try {
    const order = new Order({
      user: req.user._id,
      billing,
      items,
      total,
    });

    await order.save();

    // Optional email (non-blocking)
    try {
      await sendOrderEmail(billing.email, order);
    } catch (err) {
      console.warn("⚠️ Email failed:", err.message);
    }

    res.status(201).json({
      message: "✅ Order placed successfully",
      orderId: order._id,
    });
  } catch (err) {
    console.error("❌ Order creation failed:", err.message);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// ✅ GET /api/orders - Admin: Fetch all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch orders failed:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ DELETE /api/orders/:id - Admin: Delete an order
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "✅ Order deleted" });
  } catch (err) {
    console.error("❌ Delete failed:", err.message);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

// ✅ PATCH /api/orders/:id/approve - Admin: Approve an order
router.patch("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isApproved = true;
    await order.save();

    res.json({ message: "✅ Order approved" });
  } catch (err) {
    console.error("❌ Approve failed:", err.message);
    res.status(500).json({ message: "Failed to approve order" });
  }
});

export default router;
