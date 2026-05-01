import express from "express";
import {
  generateShowtimesHandler,
  getShowtimeSeats,
  getShowtimes,
} from "../controllers/showtimesControllers.js";

const router = express.Router();

router.get("/", getShowtimes);
router.get("/:showtimeId/seats", getShowtimeSeats);
router.post("/generate", generateShowtimesHandler);

export default router;
