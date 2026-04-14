import Movie from "../models/Movie.js";

export const getNews = async (req, res) => {
  try {
    // fetch all movies and compute top by rating
    const movies = await Movie.find({}).lean();

    const topMovies = (movies || [])
      .map((m) => ({
        id: m.tmdbId,
        title: m.tmdbRaw?.title || "",
        poster: m.tmdbRaw?.poster || "",
        rating: m.tmdbRaw?.rating || 0,
        releaseDate: m.tmdbRaw?.releaseDate || null,
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    // Create simple news items from the newest movies (by createdAt) or top rated
    const news = (movies || [])
      .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
      .slice(0, 6)
      .map((m, idx) => ({
        id: `n_${m.tmdbId}_${idx}`,
        title: `${m.tmdbRaw?.title} đang thu hút khán giả`,
        excerpt: (m.tmdbRaw?.overview || "").slice(0, 120),
        movieId: m.tmdbId,
      }));

    console.log("GET /api/news - returning news from DB");
    res.status(200).json({ topMovies, news });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load news" });
  }
};


