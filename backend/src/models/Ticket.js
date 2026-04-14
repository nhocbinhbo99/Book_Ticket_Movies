// backend/src/models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },

    seatCode: { type: String, required: true },
    seatType: { type: String, enum: ["NORMAL", "VIP", "SWEET_BOX"], required: true },
    price: { type: Number, required: true, min: 0 },

    status: { type: String, enum: ["HELD", "PAID", "CANCELLED"], required: true },
    holdExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// chống trùng ghế theo showtime
ticketSchema.index({ showtimeId: 1, seatCode: 1 }, { unique: true });

// TTL: nếu holdExpiresAt có giá trị thì tự xoá khi hết hạn
ticketSchema.index({ holdExpiresAt: 1 }, { expireAfterSeconds: 0 });

ticketSchema.index({ showtimeId: 1, status: 1, createdAt: -1 });

export default mongoose.model("Ticket", ticketSchema);