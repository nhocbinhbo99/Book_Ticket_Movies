// backend/src/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime", required: true },
    customerName: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },

    status: { type: String, enum: ["PENDING", "PAID", "CANCELLED"], default: "PENDING" },
    totalAmount: { type: Number, required: true, min: 0 }, // VNĐ
  },
  { timestamps: true }
);

bookingSchema.index({ showtimeId: 1, createdAt: -1 });

export default mongoose.model("Booking", bookingSchema);