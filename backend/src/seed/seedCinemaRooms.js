import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Cinema from "../models/Cinema.js";
import Room from "../models/Room.js";
import SeatTemplate from "../models/SeatTemplate.js";
import { getRoomLayouts } from "../services/roomLayoutService.js";
import { buildSeatTemplateFromLayout } from "../../utils/seatTemplateFactory.js";

dotenv.config();

async function run() {
  await connectDB();

  const roomLayouts = getRoomLayouts();
  let cinema = await Cinema.findOne({ name: "TicketFlix Cinema Hà Nội" });

  if (!cinema) {
    cinema = await Cinema.create({
      name: "TicketFlix Cinema Hà Nội",
      address: "123 Đường Nguyễn Huệ, Hà Nội",
    });
  }

  for (const layout of roomLayouts) {
    const templateName = `${layout.screenId}_TEMPLATE`;
    let template = await SeatTemplate.findOne({ name: templateName });

    if (!template) {
      template = await SeatTemplate.create(
        buildSeatTemplateFromLayout(layout, templateName),
      );
    }

    const existed = await Room.findOne({
      cinemaId: cinema._id,
      name: layout.roomName,
    });

    if (!existed) {
      await Room.create({
        cinemaId: cinema._id,
        name: layout.roomName,
        seatTemplateId: template._id,
      });
      continue;
    }

    if (String(existed.seatTemplateId) !== String(template._id)) {
      existed.seatTemplateId = template._id;
      await existed.save();
    }
  }

  console.log("Seed done: TicketFlix Mega Mall + 10 JSON room layouts");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
