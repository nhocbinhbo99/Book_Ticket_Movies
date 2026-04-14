// backend/src/models/Movie.js
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, unique: true, sparse: true },
    source: { type: String, enum: ["tmdb", "local"], required: true },
    tmdbRaw: { type: mongoose.Schema.Types.Mixed, default: null },
    adminOverride: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);