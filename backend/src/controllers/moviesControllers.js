import Movie from "../models/Movie.js";

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).lean();
    // map to a lightweight shape frontend expects
    const mapped = (movies || []).map((m) => ({
      tmdbId: m.tmdbId,
      id: m.tmdbId,
      title: m.tmdbRaw?.title || "",
      poster_path: m.tmdbRaw?.poster || null,
      release_date: m.tmdbRaw?.releaseDate || null,
      rating: m.tmdbRaw?.rating || 0,
      raw: m.tmdbRaw || {},
    }));
    res.status(200).json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load movies" });
  }
};

