// backend/src/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime", required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    orderCode: { type: String, default: "" },
    movieTitle: { type: String, default: "" },
    cinemaId: { type: String, default: "" },
    cinemaName: { type: String, default: "" },
    screenId: { type: String, default: "" },
    roomName: { type: String, default: "" },
    selectedSeats: { type: [String], default: [] },
    seats: {
      type: [
        {
          seatCode: { type: String, required: true },
          seatType: { type: String, required: true },
          price: { type: Number, required: true, min: 0 },
        },
      ],
      default: [],
    },
    paymentMethod: { type: String, default: "" },
    customerName: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },

    status: { type: String, enum: ["PENDING", "PAID", "CANCELLED"], default: "PENDING" },
    totalAmount: { type: Number, required: true, min: 0 }, // VNĐ
  },
  { timestamps: true }
);

bookingSchema.index({ showtimeId: 1, createdAt: -1 });
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ orderCode: 1 });

export default mongoose.model("Booking", bookingSchema);
