import express from "express";
import { 
  loginUser, 
  signupUser, 
  googleAuth, 
  updateProfile,
  forgotPassword,
  resetPassword,
  getFavorites,
  toggleFavorite
} from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup-user", signupUser);
router.post("/google", googleAuth);
router.put("/profile", protect, updateProfile);   // cần JWT

// Quên mật khẩu
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Yêu thích
router.get("/favorites", protect, getFavorites);
router.post("/favorites/toggle", protect, toggleFavorite);

export default router;
