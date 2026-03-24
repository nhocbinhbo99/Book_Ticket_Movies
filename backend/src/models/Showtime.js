// backend/src/models/Showtime.js
import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    startTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    endTime: { type: Date, required: true },

    basePrice: { type: Number, required: true, min: 0 }, // VNĐ
    status: {
      type: String,
      enum: ["SCHEDULED", "OPEN", "CLOSED", "CANCELLED"],
      default: "SCHEDULED",
    },
  },
  { timestamps: true }
);

showtimeSchema.index({ roomId: 1, startTime: 1 }, { unique: true });

export default mongoose.model("Showtime", showtimeSchema);