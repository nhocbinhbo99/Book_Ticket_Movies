// backend/src/models/Cinema.js
import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Cinema", cinemaSchema);