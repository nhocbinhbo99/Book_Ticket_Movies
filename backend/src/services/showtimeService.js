import mongoose from "mongoose";
import Cinema from "../models/Cinema.js";
import Movie from "../models/Movie.js";
import Room from "../models/Room.js";
import SeatTemplate from "../models/SeatTemplate.js";
import Showtime from "../models/Showtime.js";
import {
  buildDefaultSeatTemplate,
  buildSeatTemplateFromLayout,
} from "../../utils/seatTemplateFactory.js";
import {
  getRoomLayoutForShowtime,
  getRoomLayouts,
  serializeRoomLayoutForShowtime,
} from "./roomLayoutService.js";

export const DEFAULT_SHOWTIME_DAYS = 7;
export const MAX_SHOWTIMES_PER_MOVIE_DATE = 9;

const START_SLOTS = [
  "09:00",
  "10:30",
  "12:00",
  "14:00",
  "15:30",
  "17:00",
  "19:00",
  "20:30",
  "22:00",
];
const BUFFER_MINUTES = 20;
const DEFAULT_DURATION_MINUTES = 120;
const DEFAULT_BASE_PRICE = 90000;
const DEFAULT_CINEMAS = [
  { name: "TicketFlix Cinema Hà Nội", address: "123 Đường Nguyễn Huệ, Hà Nội" },
];

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTimeLabel(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function buildDateAtSlot(baseDate, slot) {
  const [hour, minute] = slot.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function hashString(value) {
  let hash = 0;
  const text = String(value);

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash) || 1;
}

function createSeededRandom(seedValue) {
  let seed = hashString(seedValue);

  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function shuffleWithSeed(items, seedValue) {
  const random = createSeededRandom(seedValue);
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function normalizeNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

function getMovieDuration(movie, fallbackDuration) {
  return (
    normalizeNumber(fallbackDuration) ||
    normalizeNumber(movie?.adminOverride?.durationMinutes) ||
    normalizeNumber(movie?.adminOverride?.runtime) ||
    normalizeNumber(movie?.tmdbRaw?.durationMinutes) ||
    normalizeNumber(movie?.tmdbRaw?.runtime) ||
    normalizeNumber(movie?.tmdbRaw?.duration) ||
    DEFAULT_DURATION_MINUTES
  );
}

function normalizeMovieRaw(tmdbMovie, metadata = {}) {
  const durationMinutes =
    normalizeNumber(metadata.durationMinutes) ||
    normalizeNumber(tmdbMovie?.runtime);

  return {
    title: metadata.title || tmdbMovie?.title || tmdbMovie?.name || "",
    poster:
      metadata.poster || metadata.poster_path || tmdbMovie?.poster_path || null,
    poster_path:
      metadata.poster_path || metadata.poster || tmdbMovie?.poster_path || null,
    releaseDate:
      metadata.releaseDate ||
      metadata.release_date ||
      tmdbMovie?.release_date ||
      null,
    rating:
      normalizeNumber(metadata.rating) ||
      normalizeNumber(tmdbMovie?.vote_average) ||
      0,
    runtime: durationMinutes || DEFAULT_DURATION_MINUTES,
  };
}

async function fetchTmdbMovie(tmdbId) {
  const apiKey = process.env.TMDB_API_KEY || process.env.VITE_API_KEY;
  if (!apiKey || typeof fetch !== "function") return null;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=vi-VN`,
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("Cannot sync TMDB movie for showtimes:", error.message);
    return null;
  }
}

export async function ensureMovieForShowtimes(movieId, metadata = {}) {
  if (!movieId) return null;

  if (mongoose.Types.ObjectId.isValid(movieId)) {
    const movie = await Movie.findById(movieId);
    if (movie) return movie;
  }

  const tmdbId = Number(movieId);
  if (!Number.isInteger(tmdbId) || tmdbId <= 0) return null;

  let movie = await Movie.findOne({ tmdbId });
  const durationMinutes = normalizeNumber(metadata.durationMinutes);

  if (movie) {
    if (durationMinutes && !normalizeNumber(movie.tmdbRaw?.runtime)) {
      movie.tmdbRaw = {
        ...(movie.tmdbRaw || {}),
        runtime: durationMinutes,
      };
      await movie.save();
    }
    return movie;
  }

  const tmdbMovie = await fetchTmdbMovie(tmdbId);
  const tmdbRaw = normalizeMovieRaw(tmdbMovie, metadata);
  if (!tmdbRaw.title) tmdbRaw.title = `Movie ${tmdbId}`;

  try {
    movie = await Movie.create({
      tmdbId,
      source: "tmdb",
      tmdbRaw,
      isActive: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      movie = await Movie.findOne({ tmdbId });
    } else {
      throw error;
    }
  }

  return movie;
}

export async function findMovieForShowtimes(movieId) {
  if (!movieId) return null;

  if (mongoose.Types.ObjectId.isValid(movieId)) {
    const movie = await Movie.findById(movieId)
      .select("_id tmdbId tmdbRaw")
      .lean();
    if (movie) return movie;
  }

  const tmdbId = Number(movieId);
  if (!Number.isInteger(tmdbId) || tmdbId <= 0) return null;

  return Movie.findOne({ tmdbId }).select("_id tmdbId tmdbRaw").lean();
}

async function ensureDemoMovies() {
  let movies = await Movie.find({ isActive: { $ne: false } }).sort({
    createdAt: 1,
  });
  if (movies.length > 0) return movies;

  const demoMovie = await Movie.create({
    source: "local",
    tmdbRaw: {
      title: "TicketFlix Demo Movie",
      poster: null,
      releaseDate: formatDateKey(new Date()),
      rating: 8,
      runtime: DEFAULT_DURATION_MINUTES,
    },
    isActive: true,
  });

  return [demoMovie];
}

export async function ensureCinemaRooms() {
  const roomLayouts = getRoomLayouts();
  const defaultLayout = roomLayouts[0] || null;
  let defaultTemplate = await SeatTemplate.findOne({
    name: "DEFAULT_TEMPLATE",
  });
  if (!defaultTemplate) {
    defaultTemplate = await SeatTemplate.create(
      buildDefaultSeatTemplate(defaultLayout),
    );
  }

  let cinemas = await Cinema.find({}).sort({ createdAt: 1 });
  if (cinemas.length === 0) {
    cinemas = await Cinema.insertMany(DEFAULT_CINEMAS);
  }

  const templatesByRoomName = new Map();

  for (const layout of roomLayouts) {
    const templateName = `${layout.screenId}_TEMPLATE`;
    let template = await SeatTemplate.findOne({ name: templateName });

    if (!template) {
      template = await SeatTemplate.create(
        buildSeatTemplateFromLayout(layout, templateName),
      );
    }

    templatesByRoomName.set(layout.roomName, template);
  }

  const roomsByCinema = new Map();

  for (const cinema of cinemas) {
    let rooms = await Room.find({ cinemaId: cinema._id }).sort({ name: 1 });

    for (const layout of roomLayouts) {
      const template =
        templatesByRoomName.get(layout.roomName) || defaultTemplate;
      const existingRoom = rooms.find((room) => room.name === layout.roomName);

      if (!existingRoom) {
        const room = await Room.create({
          cinemaId: cinema._id,
          name: layout.roomName,
          seatTemplateId: template._id,
        });
        rooms.push(room);
        continue;
      }

      if (String(existingRoom.seatTemplateId) !== String(template._id)) {
        existingRoom.seatTemplateId = template._id;
        await existingRoom.save();
      }
    }

    rooms = await Room.find({ cinemaId: cinema._id }).sort({ name: 1 });
    roomsByCinema.set(String(cinema._id), rooms);
  }

  return { cinemas, roomsByCinema, template: defaultTemplate };
}

async function isRoomAvailable(roomId, startTime, endTime, plannedShowtimes) {
  const blockedStart = addMinutes(startTime, -BUFFER_MINUTES);
  const blockedEnd = addMinutes(endTime, BUFFER_MINUTES);
  const roomKey = String(roomId);

  const plannedOverlap = plannedShowtimes.some((showtime) => {
    if (String(showtime.roomId) !== roomKey) return false;
    return showtime.startTime < blockedEnd && showtime.endTime > blockedStart;
  });

  if (plannedOverlap) return false;

  const existingOverlap = await Showtime.exists({
    roomId,
    startTime: { $lt: blockedEnd },
    endTime: { $gt: blockedStart },
    status: { $ne: "CANCELLED" },
  });

  return !existingOverlap;
}

async function tryCreateShowtime({
  movie,
  cinema,
  rooms,
  date,
  slot,
  plannedShowtimes,
  durationMinutes,
}) {
  const startTime = buildDateAtSlot(date, slot);
  const endTime = addMinutes(startTime, durationMinutes);
  const dateKey = formatDateKey(date);

  for (const room of rooms) {
    const available = await isRoomAvailable(
      room._id,
      startTime,
      endTime,
      plannedShowtimes,
    );
    if (!available) continue;

    const existingSameMovie = await Showtime.exists({
      movieId: movie._id,
      roomId: room._id,
      startTime,
    });
    if (existingSameMovie) return { created: false, skipped: true };

    const showtime = await Showtime.create({
      movieId: movie._id,
      cinemaId: cinema._id,
      roomId: room._id,
      date: dateKey,
      startTime,
      durationMinutes,
      endTime,
      basePrice: DEFAULT_BASE_PRICE,
      price: DEFAULT_BASE_PRICE,
      status: "ACTIVE",
    });

    plannedShowtimes.push({
      roomId: room._id,
      startTime,
      endTime,
    });

    return { created: true, skipped: false, showtime };
  }

  return { created: false, skipped: true };
}

function buildShowtimeCandidates({ cinemas, roomsByCinema, dateKey, movie }) {
  const roomCandidates = [];

  for (const cinema of cinemas) {
    const rooms = roomsByCinema.get(String(cinema._id)) || [];

    for (const room of rooms) {
      roomCandidates.push({
        cinema,
        rooms: [room],
      });
    }
  }

  const slots = shuffleWithSeed(START_SLOTS, `${movie._id}-${dateKey}-slots`);

  return slots.flatMap((slot) =>
    shuffleWithSeed(roomCandidates, `${movie._id}-${dateKey}-${slot}`).map(
      (candidate) => ({
        ...candidate,
        slot,
      }),
    ),
  );
}

export async function generateShowtimes({
  movieId,
  days = DEFAULT_SHOWTIME_DAYS,
  durationMinutes,
  metadata = {},
} = {}) {
  const safeDays = Math.min(
    Math.max(Number(days) || DEFAULT_SHOWTIME_DAYS, 1),
    14,
  );
  const { cinemas, roomsByCinema } = await ensureCinemaRooms();

  let movies;
  if (movieId) {
    const movie = await ensureMovieForShowtimes(movieId, {
      ...metadata,
      durationMinutes,
    });
    movies = movie ? [movie] : [];
  } else {
    movies = await ensureDemoMovies();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let created = 0;
  let skipped = 0;
  const plannedShowtimes = [];

  for (let dayIndex = 0; dayIndex < safeDays; dayIndex++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayIndex);

    const dateKey = formatDateKey(date);

    for (let movieIndex = 0; movieIndex < movies.length; movieIndex++) {
      const movie = movies[movieIndex];
      const movieDuration = getMovieDuration(movie, durationMinutes);
      const existingShowtimes = await Showtime.find({
        movieId: movie._id,
        date: dateKey,
        status: { $nin: ["CANCELLED", "INACTIVE"] },
      })
        .select("startTime")
        .lean();
      const usedSlots = new Set(
        existingShowtimes.map((showtime) =>
          formatTimeLabel(new Date(showtime.startTime)),
        ),
      );
      let createdForMovieDate = Math.min(
        usedSlots.size,
        MAX_SHOWTIMES_PER_MOVIE_DATE,
      );

      if (createdForMovieDate >= MAX_SHOWTIMES_PER_MOVIE_DATE) {
        skipped += 1;
        continue;
      }

      const candidates = buildShowtimeCandidates({
        cinemas,
        roomsByCinema,
        dateKey,
        movie,
      });

      for (const candidate of candidates) {
        if (createdForMovieDate >= MAX_SHOWTIMES_PER_MOVIE_DATE) break;
        if (usedSlots.has(candidate.slot)) continue;

        const result = await tryCreateShowtime({
          movie,
          cinema: candidate.cinema,
          rooms: candidate.rooms,
          date,
          slot: candidate.slot,
          plannedShowtimes,
          durationMinutes: movieDuration,
        });

        if (result.created) {
          created += 1;
          createdForMovieDate += 1;
          usedSlots.add(candidate.slot);
        }
        if (result.skipped) skipped += 1;
      }
    }
  }

  return {
    created,
    skipped,
    days: safeDays,
    movies,
    cinemas,
  };
}

export function normalizeShowtimeStatus(status) {
  if (status === "SOLD_OUT") return "SOLD_OUT";
  if (status === "INACTIVE" || status === "CLOSED" || status === "CANCELLED")
    return "INACTIVE";
  return "ACTIVE";
}

function toId(value) {
  if (!value) return "";
  if (value._id) return String(value._id);
  return String(value);
}

export function serializeShowtime(showtime, soldSeats = []) {
  const room = showtime.roomId;
  const cinema = showtime.cinemaId || room?.cinemaId;
  const movie = showtime.movieId;
  const seatTemplate = room?.seatTemplateId;
  const roomLayout = getRoomLayoutForShowtime(showtime);
  const serializedRoomLayout = serializeRoomLayoutForShowtime(
    roomLayout,
    showtime,
  );
  const startTime = new Date(showtime.startTime);
  const endTime = new Date(showtime.endTime);
  const price = showtime.price ?? showtime.basePrice ?? DEFAULT_BASE_PRICE;

  return {
    id: String(showtime._id),
    movieId: toId(movie),
    tmdbId: movie?.tmdbId || null,
    cinemaId: toId(cinema),
    roomId: toId(room),
    screenId: serializedRoomLayout?.screenId || "",
    roomName: serializedRoomLayout?.roomName || room?.name || "",
    screenName: room?.name || "",
    date: showtime.date || formatDateKey(startTime),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    startTimeLabel: formatTimeLabel(startTime),
    endTimeLabel: formatTimeLabel(endTime),
    durationMinutes: showtime.durationMinutes,
    price,
    basePrice: showtime.basePrice,
    status: normalizeShowtimeStatus(showtime.status),
    createdAt: showtime.createdAt,
    updatedAt: showtime.updatedAt,
    movie: movie
      ? {
          id: toId(movie),
          tmdbId: movie.tmdbId || null,
          title: movie.tmdbRaw?.title || "",
        }
      : null,
    cinema: cinema
      ? {
          id: toId(cinema),
          name: cinema.name || "",
          address: cinema.address || "",
        }
      : null,
    room: room
      ? {
          id: toId(room),
          name: room.name || "",
          screenId: serializedRoomLayout?.screenId || "",
        }
      : null,
    roomLayout: serializedRoomLayout,
    seatTemplate: seatTemplate
      ? {
          id: toId(seatTemplate),
          name: seatTemplate.name || "",
          seats: seatTemplate.seats || [],
        }
      : null,
    soldSeats,
  };
}
