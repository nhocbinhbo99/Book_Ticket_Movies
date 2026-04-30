import express from "express";
import { getCinemaRooms, getCinemas } from "../controllers/cinemasControllers.js";

const router = express.Router();

router.get("/", getCinemas);
router.get("/:id/rooms", getCinemaRooms);

export default router;
