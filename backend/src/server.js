import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import taskRoute from "./routes/tasksRouters.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("TicketFlix backend is running");
});
app.use("/api/tasks", taskRoute);
connectDB();
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
