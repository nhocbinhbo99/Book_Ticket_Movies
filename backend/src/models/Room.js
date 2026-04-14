// backend/src/models/Room.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: "Cinema", required: true },
    name: { type: String, required: true },
    seatTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "SeatTemplate", required: true },
  },
  { timestamps: true }
);

roomSchema.index({ cinemaId: 1, name: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);