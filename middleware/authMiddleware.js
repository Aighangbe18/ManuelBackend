import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware to protect routes (Only logged-in users can access)
export const protect = async (req, res, next) => {
  let token;

  try {
    // Check for Authorization header with Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB (excluding password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request object
      req.user = user;

      return next(); // Proceed to next middleware or route
    }

    return res.status(401).json({ message: "No token provided" });
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// ✅ Middleware to allow only admin users
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next(); // Proceed if user is admin
  }

  return res.status(403).json({ message: "Access denied: Admins only" });
};
