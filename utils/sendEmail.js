// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load .env variables

// ✅ Configure transporter for Gmail using TLS (port 587)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // ✅ Use TLS
  secure: false, // ❌ Not SSL — STARTTLS is used instead
  auth: {
    user: process.env.EMAIL_USER, // ✅ e.g. baighangbe@gmail.com
    pass: process.env.EMAIL_PASS, // ✅ Gmail App Password
  },
});

// ✅ Function to send order confirmation email
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
    throw err; // Let route handler decide what to do
  }
};
