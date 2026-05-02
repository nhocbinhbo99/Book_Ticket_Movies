// backend/src/models/Showtime.js
import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: "Cinema", default: null },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    date: { type: String, default: "" },
    startTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    endTime: { type: Date, required: true },

    basePrice: { type: Number, required: true, min: 0 }, // VNĐ
    price: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SOLD_OUT", "SCHEDULED", "OPEN", "CLOSED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

showtimeSchema.index({ roomId: 1, startTime: 1 }, { unique: true });
showtimeSchema.index({ movieId: 1, date: 1, cinemaId: 1, startTime: 1 });
showtimeSchema.index({ movieId: 1 });
showtimeSchema.index({ date: 1 });
showtimeSchema.index({ status: 1 });
showtimeSchema.index({ movieId: 1, date: 1, status: 1, startTime: 1 });

export default mongoose.model("Showtime", showtimeSchema);
