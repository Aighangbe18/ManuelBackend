import nodemailer from "nodemailer";

// Gmail transporter using App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // e.g. baighangbe@gmail.com
    pass: process.env.EMAIL_PASS,  // Gmail App Password (16-character)
  },
});

// Function to send order confirmation email
export const sendOrderEmail = async (to, order) => {
  try {
    const itemList = order.items
      .map(
        (item) =>
          `${item.name} (Qty: ${item.quantity}) - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("<br/>");

    const htmlContent = `
      <h2>Thank you for your order!</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p><strong>Billing Name:</strong> ${order.billing.name}</p>
      <h4>Items:</h4>
      ${itemList}
      <br/><br/>
      <p>We'll notify you once your order is approved.</p>
    `;

    await transporter.sendMail({
      from: `"Manuel AIG Store" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Order Confirmation - Manuel AIG Store",
      html: htmlContent,
    });

    console.log("✅ Order confirmation email sent to:", to);
  } catch (err) {
    console.error("❌ Failed to send order email:", err.message);
    // Optional: rethrow if you want to handle it in the route
    throw err;
  }
};
