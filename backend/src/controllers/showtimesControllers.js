import mongoose from "mongoose";
import Showtime from "../models/Showtime.js";
import Ticket from "../models/Ticket.js";
import {
  getRoomLayoutForShowtime,
  getSeatCodesForLayout,
  serializeRoomLayoutForShowtime,
} from "../services/roomLayoutService.js";
import {
  MAX_SHOWTIMES_PER_MOVIE_DATE,
  findMovieForShowtimes,
  generateShowtimes,
  serializeShowtime,
} from "../services/showtimeService.js";

const ACTIVE_SHOWTIME_STATUSES = ["ACTIVE", "OPEN", "SCHEDULED"];

function getSoldSeatMap(tickets) {
  return tickets.reduce((map, ticket) => {
    const key = String(ticket.showtimeId);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(ticket.seatCode);
    return map;
  }, new Map());
}

function getStartTimeLabel(value) {
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function limitRawShowtimesPerMovieDate(showtimes) {
  const groups = new Map();

  for (const showtime of showtimes) {
    const key = `${showtime.movieId}:${showtime.date}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(showtime);
  }

  const limited = [];

  for (const group of groups.values()) {
    const sorted = group
      .slice()
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const selected = [];
    const selectedIds = new Set();
    const usedStartTimes = new Set();

    const pick = (item) => {
      if (selected.length >= MAX_SHOWTIMES_PER_MOVIE_DATE) return;
      selected.push(item);
      selectedIds.add(String(item._id));
      usedStartTimes.add(getStartTimeLabel(item.startTime));
    };

    for (const item of sorted) {
      const startTimeLabel = getStartTimeLabel(item.startTime);
      if (usedStartTimes.has(startTimeLabel)) continue;
      pick(item);
    }

    for (const item of sorted) {
      if (selected.length >= MAX_SHOWTIMES_PER_MOVIE_DATE) break;
      if (selectedIds.has(String(item._id))) continue;
      pick(item);
    }

    limited.push(...selected);
  }

  return limited.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
}

async function fetchShowtimes(filter) {
  const showtimes = await Showtime.find(filter)
    .sort({ startTime: 1 })
    .limit(50)
    .lean();
  const limitedShowtimes = limitRawShowtimesPerMovieDate(showtimes);

  return Showtime.populate(limitedShowtimes, [
    { path: "movieId", select: "tmdbId tmdbRaw" },
    { path: "cinemaId", select: "name address" },
    {
      path: "roomId",
      select: "name cinemaId seatTemplateId",
      populate: [
        { path: "cinemaId", select: "name address" },
        { path: "seatTemplateId", select: "name seats" },
      ],
    },
  ]);
}

function limitShowtimesPerMovieDate(showtimes) {
  const groups = new Map();

  for (const showtime of showtimes) {
    const key = `${showtime.movieId}:${showtime.date}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(showtime);
  }

  const limited = [];

  for (const group of groups.values()) {
    const sorted = group
      .slice()
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const selected = [];
    const selectedIds = new Set();
    const usedStartTimes = new Set();

    const pick = (item) => {
      if (selected.length >= MAX_SHOWTIMES_PER_MOVIE_DATE) return;
      selected.push(item);
      selectedIds.add(item.id);
      usedStartTimes.add(item.startTimeLabel);
    };

    for (const item of sorted) {
      if (item.status !== "ACTIVE") continue;
      if (usedStartTimes.has(item.startTimeLabel)) continue;
      pick(item);
    }

    for (const item of sorted) {
      if (selected.length >= MAX_SHOWTIMES_PER_MOVIE_DATE) break;
      if (selectedIds.has(item.id)) continue;
      pick(item);
    }

    limited.push(...selected);
  }

  return limited.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
}

export const getShowtimes = async (req, res) => {
  try {
    const { movieId, date, cinemaId } = req.query;
    const filter = {
      status: { $in: ACTIVE_SHOWTIME_STATUSES },
    };

    if (movieId) {
      const movie = await findMovieForShowtimes(movieId);
      if (!movie) {
        return res.status(200).json([]);
      }

      filter.movieId = movie._id;
    }

    if (date) {
      filter.date = date;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.startTime = { $gte: today };
    }

    if (cinemaId) {
      filter.cinemaId = cinemaId;
    }

    const showtimes = await fetchShowtimes(filter);
    if (showtimes.length === 0) {
      return res.status(200).json([]);
    }

    const showtimeIds = showtimes.map((showtime) => showtime._id);
    const tickets = await Ticket.find({
      showtimeId: { $in: showtimeIds },
      status: { $in: ["HELD", "PAID"] },
    })
      .select("showtimeId seatCode")
      .lean();

    const soldSeatMap = getSoldSeatMap(tickets);
    const payload = showtimes.map((showtime) => {
      const soldSeats = soldSeatMap.get(String(showtime._id)) || [];
      const item = serializeShowtime(showtime, soldSeats);
      const capacity = item.roomLayout
        ? getSeatCodesForLayout(item.roomLayout).length
        : item.seatTemplate?.seats?.length || 0;

      if (capacity > 0 && soldSeats.length >= capacity) {
        item.status = "SOLD_OUT";
      }

      return item;
    });

    return res.status(200).json(limitShowtimesPerMovieDate(payload));
  } catch (error) {
    console.error("Get showtimes error:", error);
    return res.status(500).json({ message: "Cannot load showtimes. Please try again." });
  }
};

export const getShowtimeSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
      return res.status(400).json({ message: "Invalid showtime id." });
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
      })
      .lean();

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found." });
    }

    const layout = getRoomLayoutForShowtime(showtime);
    if (!layout) {
      return res.status(404).json({ message: "Room layout not found for this showtime." });
    }

    const tickets = await Ticket.find({
      showtimeId,
      status: { $in: ["HELD", "PAID"] },
    })
      .select("seatCode")
      .lean();

    return res.status(200).json({
      showtimeId: String(showtime._id),
      room: serializeRoomLayoutForShowtime(layout, showtime),
      soldSeats: tickets.map((ticket) => ticket.seatCode),
    });
  } catch (error) {
    console.error("Get showtime seats error:", error);
    return res.status(500).json({ message: "Cannot load showtime seats. Please try again." });
  }
};

export const generateShowtimesHandler = async (req, res) => {
  try {
    const { movieId, days, durationMinutes, metadata } = req.body || {};
    const result = await generateShowtimes({
      movieId,
      days,
      durationMinutes,
      metadata,
    });

    return res.status(201).json({
      message: "Showtimes generated successfully",
      created: result.created,
      skipped: result.skipped,
      days: result.days,
      movies: result.movies.length,
      cinemas: result.cinemas.length,
    });
  } catch (error) {
    console.error("Generate showtimes error:", error);
    return res.status(500).json({ message: "Cannot generate showtimes. Please try again." });
  }
};
