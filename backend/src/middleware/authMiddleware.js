import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * Middleware bảo vệ route — yêu cầu đăng nhập.
 * Dùng: router.get("/protected", protect, handler)
 * Header: Authorization: Bearer <token>
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn user vào request để các handler sau dùng
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Tài khoản không tồn tại" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

/**
 * Middleware phân quyền — chỉ cho phép role nhất định.
 * Dùng: router.delete("/admin-only", protect, requireRole("admin"), handler)
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
  }
  next();
};
