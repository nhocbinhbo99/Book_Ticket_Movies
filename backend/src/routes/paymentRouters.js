import express from "express";
import rateLimit from "express-rate-limit";
import { createMomoOrder, momoCallback, checkPaymentStatus } from "../controllers/paymentControllers.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many payment requests. Please try again later." },
});

const checkStatusLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many status requests. Please try again later." },
});

const callbackLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many callback requests." },
});

// Create a MoMo payment order (user must be logged in for booking association)
router.post("/create-momo-order", createOrderLimiter, optionalAuth, createMomoOrder);

// Webhook: MoMo calls this after payment is completed
router.post("/momo-callback", callbackLimiter, momoCallback);

// Check payment status by MoMo orderId
router.get("/check-status/:orderId", checkStatusLimiter, checkPaymentStatus);

export default router;
