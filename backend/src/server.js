import express from "express";
import taskRoute from "./routes/tasksRouters.js";
import authRoute from "./routes/authRouters.js";
import newsRoute from "./routes/newsRouters.js";
import moviesRoute from "./routes/moviesRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// CORS: cho phép frontend gọi backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/tasks", taskRoute);
app.use("/api/auth", authRoute);
app.use("/api/news", newsRoute);
app.use("/api/movies", moviesRoute);

connectDB();

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
