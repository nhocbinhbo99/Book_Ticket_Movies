import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { generateShowtimes } from "../services/showtimeService.js";

dotenv.config();

async function run() {
  await connectDB();
  const result = await generateShowtimes({ days: 7 });

  console.log(
    `Seed done: ${result.created} showtimes created, ${result.skipped} skipped for ${result.movies.length} movie(s)`
  );

  await mongoose.connection.close();
  process.exit(0);
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
