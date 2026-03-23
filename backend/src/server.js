import express from "express";
import taskRoute from "./routes/tasksRouters.js";
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

connectDB();

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
