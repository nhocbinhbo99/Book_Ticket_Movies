import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import taskRoute from "./routes/tasksRouters.js";
import authRoute from "./routes/authRouters.js";
import moviesRoute from "./routes/moviesRouters.js";
import newsRoute from "./routes/newsRouters.js";
import cinemasRoute from "./routes/cinemasRouters.js";
import showtimesRoute from "./routes/showtimesRouters.js";
import bookingsRoute from "./routes/bookingsRouters.js";
import { connectDB } from "./config/db.js";

// Load biến môi trường
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route test server
app.get("/", (req, res) => {
  res.status(200).send("TicketFlix backend is running 🚀");
});

// API routes
app.use("/api/tasks", taskRoute);
app.use("/api/auth", authRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/news", newsRoute);
app.use("/api/cinemas", cinemasRoute);
app.use("/api/showtimes", showtimesRoute);
app.use("/api/bookings", bookingsRoute);

// Connect database
connectDB();

// PORT (quan trọng cho Render)
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("===================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment PORT: ${process.env.PORT}`);
  console.log("===================================");
});
