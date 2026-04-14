// backend/src/seed/seedCinemaRooms.js
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Cinema from "../models/Cinema.js";
import Room from "../models/Room.js";
import SeatTemplate from "../models/SeatTemplate.js";
import { buildDefaultSeatTemplate } from "../utils/seatTemplateFactory.js";

dotenv.config();

async function run() {
  await connectDB();

  let template = await SeatTemplate.findOne({ name: "DEFAULT_TEMPLATE" });
  if (!template) {
    template = await SeatTemplate.create(buildDefaultSeatTemplate());
  }

  let cinema = await Cinema.findOne({ name: "My Cinema" });
  if (!cinema) {
    cinema = await Cinema.create({ name: "My Cinema", address: "Your address" });
  }

  // tạo 10 phòng
  for (let i = 1; i <= 10; i++) {
    const name = `Room ${i}`;
    const existed = await Room.findOne({ cinemaId: cinema._id, name });
    if (!existed) {
      await Room.create({ cinemaId: cinema._id, name, seatTemplateId: template._id });
    }
  }

  console.log("Seed done: cinema + template + 10 rooms");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});