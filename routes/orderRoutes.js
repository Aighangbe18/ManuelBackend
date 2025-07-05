import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { sendOrderEmail } from "../utils/sendEmail.js";

const router = express.Router();

// ✅ POST /api/orders - Place order & send confirmation email
router.post("/", protect, async (req, res) => {
  const { billing, items, total } = req.body;

  // Validate required fields
  if (!billing || !items || !total) {
    return res.status(400).json({ message: "Missing order data" });
  }

  try {
    console.log("✅ Received new order:", { billing, items, total });

    // Create and save order
    const order = new Order({
      user: req.user._id,
      billing,
      items,
      total,
    });

    await order.save();
    console.log("✅ Order saved:", order._id);

    // Send confirmation email
    try {
      await sendOrderEmail(billing.email, order);
      console.log("✅ Order confirmation email sent");
    } catch (emailErr) {
      console.error("❌ Failed to send email:", emailErr.message);
      // Email failure shouldn't block order success
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error.message);
    res.status(500).json({
      message: "Server error. Could not place order.",
      error: error.message,
    });
  }
});

// ✅ GET /api/orders - Admin only: Get all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ DELETE /api/orders/:id - Admin only: Delete an order
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting order:", error.message);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

// ✅ PATCH /api/orders/:id/approve - Admin only: Approve an order
router.patch("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isApproved = true;
    await order.save();

    res.json({ message: "Order approved successfully" });
  } catch (error) {
    console.error("❌ Error approving order:", error.message);
    res.status(500).json({ message: "Failed to approve order" });
  }
});

export default router;
