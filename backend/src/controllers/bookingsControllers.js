import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Showtime from "../models/Showtime.js";
import Ticket from "../models/Ticket.js";
import {
  getRoomLayoutForShowtime,
  getSeatCodesForLayout,
  getSeatPriceForCode,
  getSeatTypeForCode,
  getTicketSeatType,
  serializeRoomLayoutForShowtime,
} from "../services/roomLayoutService.js";

function normalizeSelectedSeats(payload = {}) {
  const fromDetailedSeats = Array.isArray(payload.seats)
    ? payload.seats.map((seat) => seat?.seatCode || seat?.code || seat)
    : [];
  const fromSelectedSeats = Array.isArray(payload.selectedSeats) ? payload.selectedSeats : [];

  return Array.from(
    new Set(
      [...fromSelectedSeats, ...fromDetailedSeats]
        .map((seatCode) => String(seatCode || "").trim().toUpperCase())
        .filter(Boolean),
    ),
  );
}

function buildOrderCode(bookingId) {
  return `TF${String(bookingId).slice(-8).toUpperCase()}`;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function resolveCustomerInfo(body = {}, user = null) {
  const formName = normalizeText(body.customerName);
  const formEmail = normalizeText(body.email);
  const formPhone = normalizeText(body.phone);
  const userName = normalizeText(user?.fullName);
  const userEmail = normalizeText(user?.email);
  const userPhone = normalizeText(user?.phone);

  return {
    customerName: formName || userName || userEmail || "TicketFlix Guest",
    email: formEmail || userEmail || "",
    phone: formPhone || userPhone || "",
  };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMyBookingsQuery(user) {
  const query = [{ userId: user._id }];
  const userEmail = normalizeText(user.email);

  if (userEmail) {
    query.push({
      $and: [
        { $or: [{ userId: { $exists: false } }, { userId: null }] },
        { email: { $regex: `^${escapeRegExp(userEmail)}$`, $options: "i" } },
      ],
    });
  }

  return { $or: query };
}

function serializeBooking(booking) {
  const populatedShowtime =
    booking.showtimeId &&
    typeof booking.showtimeId === "object" &&
    booking.showtimeId._id
      ? booking.showtimeId
      : null;

  return {
    id: String(booking._id),
    orderCode: booking.orderCode,
    showtimeId: populatedShowtime
      ? String(populatedShowtime._id)
      : String(booking.showtimeId || ""),
    showtime: populatedShowtime
      ? {
          id: String(populatedShowtime._id),
          date: populatedShowtime.date,
          startTime: populatedShowtime.startTime,
          endTime: populatedShowtime.endTime,
          durationMinutes: populatedShowtime.durationMinutes,
          status: populatedShowtime.status,
        }
      : null,
    movieTitle: booking.movieTitle,
    cinemaId: booking.cinemaId,
    cinemaName: booking.cinemaName,
    screenId: booking.screenId,
    roomName: booking.roomName,
    selectedSeats: booking.selectedSeats || [],
    seats: booking.seats || [],
    totalPrice: booking.totalAmount,
    totalAmount: booking.totalAmount,
    paymentMethod: booking.paymentMethod,
    status: booking.status,
    customerName: booking.customerName,
    email: booking.email,
    phone: booking.phone,
    createdAt: booking.createdAt,
  };
}

export const createBooking = async (req, res) => {
  let booking = null;

  try {
    const { showtimeId, movieTitle, customerName, email, phone, paymentMethod } = req.body || {};
    const currentUser = req.user || null;

    if (!currentUser?._id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const customerInfo = resolveCustomerInfo(
      { customerName, email, phone },
      currentUser,
    );

    if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
      return res.status(400).json({ message: "Invalid showtime id." });
    }

    const selectedSeats = normalizeSelectedSeats(req.body);
    if (selectedSeats.length === 0) {
      return res.status(400).json({ message: "Please select at least one seat." });
    }

    const showtime = await Showtime.findById(showtimeId)
      .populate({ path: "cinemaId", select: "name address" })
      .populate({
        path: "roomId",
        select: "name cinemaId seatTemplateId",
        populate: [
          { path: "cinemaId", select: "name address" },
          { path: "seatTemplateId", select: "name seats" },
        ],
      });

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found." });
    }

    const layout = getRoomLayoutForShowtime(showtime);
    if (!layout) {
      return res.status(404).json({ message: "Room layout not found for this showtime." });
    }

    const validSeatCodes = new Set(getSeatCodesForLayout(layout));
    const invalidSeats = selectedSeats.filter((seatCode) => !validSeatCodes.has(seatCode));

    if (invalidSeats.length > 0) {
      return res.status(400).json({
        message: "Some seats do not exist in this room layout.",
        seats: invalidSeats,
      });
    }

    const soldTickets = await Ticket.find({
      showtimeId,
      seatCode: { $in: selectedSeats },
      status: { $in: ["HELD", "PAID"] },
    })
      .select("seatCode")
      .lean();

    if (soldTickets.length > 0) {
      return res.status(409).json({
        message: "Some selected seats are no longer available.",
        soldSeats: soldTickets.map((ticket) => ticket.seatCode),
      });
    }

    const seats = selectedSeats.map((seatCode) => {
      const seatType = getSeatTypeForCode(layout, seatCode);

      return {
        seatCode,
        seatType,
        price: getSeatPriceForCode(layout, seatCode),
      };
    });
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
    const room = serializeRoomLayoutForShowtime(layout, showtime);

    booking = await Booking.create({
      showtimeId,
      userId: currentUser?._id,
      movieTitle: movieTitle || showtime.movieId?.tmdbRaw?.title || "",
      cinemaId: room.cinemaId,
      cinemaName: room.cinemaName,
      screenId: room.screenId,
      roomName: room.roomName,
      selectedSeats,
      seats,
      paymentMethod: paymentMethod || "",
      customerName: customerInfo.customerName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      status: "PAID",
      totalAmount,
    });

    booking.orderCode = buildOrderCode(booking._id);
    await booking.save();

    await Ticket.insertMany(
      seats.map((seat) => ({
        showtimeId,
        bookingId: booking._id,
        seatCode: seat.seatCode,
        seatType: getTicketSeatType(seat.seatType),
        price: seat.price,
        status: "PAID",
      })),
      { ordered: true },
    );

    return res.status(201).json({
      message: "Booking created successfully.",
      booking: {
        id: String(booking._id),
        userId: booking.userId ? String(booking.userId) : null,
        orderCode: booking.orderCode,
        showtimeId: String(booking.showtimeId),
        movieTitle: booking.movieTitle,
        cinemaId: booking.cinemaId,
        cinemaName: booking.cinemaName,
        screenId: booking.screenId,
        roomName: booking.roomName,
        selectedSeats,
        seats,
        totalPrice: totalAmount,
        totalAmount,
        paymentMethod: booking.paymentMethod,
        status: booking.status,
        customerName: booking.customerName,
        email: booking.email,
        phone: booking.phone,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    if (booking?._id) {
      await Ticket.deleteMany({ bookingId: booking._id }).catch(() => null);
      await Booking.findByIdAndDelete(booking._id).catch(() => null);
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "Some selected seats are no longer available.",
      });
    }

    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Cannot create booking. Please try again." });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const bookings = await Booking.find(buildMyBookingsQuery(req.user))
      .sort({ createdAt: -1 })
      .populate({
        path: "showtimeId",
        select: "date startTime endTime durationMinutes status",
      })
      .lean();

    return res.status(200).json({
      bookings: bookings.map(serializeBooking),
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    return res.status(500).json({ message: "Cannot load your tickets. Please try again." });
  }
};
