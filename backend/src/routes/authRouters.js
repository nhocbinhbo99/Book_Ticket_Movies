import express from "express";
import { loginUser, signupUser, googleAuth, updateProfile } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup-user", signupUser);
router.post("/google", googleAuth);
router.put("/profile", protect, updateProfile);   // cần JWT

export default router;
