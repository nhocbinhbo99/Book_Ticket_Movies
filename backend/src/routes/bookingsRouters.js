import express from "express";
import { createBooking, getMyBookings } from "../controllers/bookingsControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyBookings);
router.post("/", protect, createBooking);

export default router;
