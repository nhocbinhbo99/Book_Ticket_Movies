import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function getBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return "";

  const token = authHeader.split(" ")[1];
  return token && token !== "null" && token !== "undefined" ? token : "";
}

async function findUserFromToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id || decoded.userId || decoded._id;

  if (!userId) return null;
  return User.findById(userId).select("-password");
}

export const protect = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: "Khong co token, truy cap bi tu choi" });
    }

    const user = await findUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: "Tai khoan khong ton tai" });
    }

    req.user = user;
    req.userId = user._id;
    return next();
  } catch {
    return res.status(401).json({ message: "Token khong hop le hoac da het han" });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) return next();

    const user = await findUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: "Account not found" });
    }

    req.user = user;
    req.userId = user._id;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Ban khong co quyen thuc hien hanh dong nay" });
    }
    return next();
  };
