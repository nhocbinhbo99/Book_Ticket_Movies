import express from "express";
import { loginUser, signupUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup-user", signupUser);

export default router;
