import Cinema from "../models/Cinema.js";
import Room from "../models/Room.js";
import { ensureCinemaRooms } from "../services/showtimeService.js";

export const getCinemas = async (req, res) => {
  try {
    await ensureCinemaRooms();
    const cinemas = await Cinema.find({}).sort({ name: 1 }).lean();

    return res.status(200).json(
      cinemas.map((cinema) => ({
        id: String(cinema._id),
        name: cinema.name,
        address: cinema.address || "",
        createdAt: cinema.createdAt,
        updatedAt: cinema.updatedAt,
      }))
    );
  } catch (error) {
    console.error("Get cinemas error:", error);
    return res.status(500).json({ message: "Cannot load cinemas. Please try again." });
  }
};

export const getCinemaRooms = async (req, res) => {
  try {
    const { id } = req.params;
    await ensureCinemaRooms();

    const rooms = await Room.find({ cinemaId: id })
      .sort({ name: 1 })
      .populate("seatTemplateId")
      .lean();

    return res.status(200).json(
      rooms.map((room) => ({
        id: String(room._id),
        cinemaId: String(room.cinemaId),
        name: room.name,
        seatTemplate: room.seatTemplateId
          ? {
              id: String(room.seatTemplateId._id),
              name: room.seatTemplateId.name,
              seats: room.seatTemplateId.seats || [],
            }
          : null,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      }))
    );
  } catch (error) {
    console.error("Get cinema rooms error:", error);
    return res.status(500).json({ message: "Cannot load rooms. Please try again." });
  }
};
