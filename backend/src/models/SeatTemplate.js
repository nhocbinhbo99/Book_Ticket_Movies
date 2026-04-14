// backend/src/models/SeatTemplate.js
import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    type: { type: String, enum: ["NORMAL", "VIP", "SWEET_BOX"], required: true },
  },
  { _id: false }
);

const seatTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    seats: { type: [seatSchema], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("SeatTemplate", seatTemplateSchema);