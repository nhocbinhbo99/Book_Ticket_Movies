import express from "express";
import { getNews } from "../controllers/newsControllers.js";

const router = express.Router();

router.get("/", getNews);

export default router;
