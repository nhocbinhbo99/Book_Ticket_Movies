import mongoose from "mongoose";
import Movie from "../src/models/Movie.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your_db_name";

const movies = [];

const seedMovies = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected DB");

    // Drop the stray "id" index if it exists (E11000 duplicate key error on id: null)
    try {
      await Movie.collection.dropIndex("id_1");
      console.log("Dropped stray id_1 index");
    } catch (e) {
      // index may not exist; ignore
    }

    // Use upsert to avoid deleting existing movies
    let count = 0;
    for (const movie of movies) {
      await Movie.updateOne(
        { tmdbId: movie.tmdbId },
        { $set: movie },
        { upsert: true }
      );
      count++;
    }

    console.log(`✅ Seeded/updated ${count} local movies (existing data preserved)`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMovies();
