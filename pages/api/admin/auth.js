// pages/api/admin/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Store hashed password in env
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    // For quick implementation, you can use plain text comparison
    // But it's recommended to use bcrypt for production
    const isValid = password === process.env.ADMIN_PASSWORD;

    // Or with bcrypt (recommended):
    // const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        admin: true,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      },
      JWT_SECRET
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}

// Middleware to verify admin token
export function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isValid: false, error: "No token provided" };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { isValid: true, decoded };
  } catch (error) {
    return { isValid: false, error: "Invalid token" };
  }
}

// Example usage in your blog API routes
// pages/api/blog.js (add this to your existing blog API)
/*
import { verifyAdminToken } from './admin/auth';

export default async function handler(req, res) {
  // Verify admin for POST, PUT, DELETE operations
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const auth = verifyAdminToken(req);
    if (!auth.isValid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  
  // Your existing blog logic here...
}
*/
