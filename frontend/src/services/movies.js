const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_URL = API_BASE ? `${API_BASE}/api` : "/api";

export const getPopularMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=vi-VN`
  );

  const data = await res.json();
  return data.results;
};

// PHIM ĐANG CHIẾU
export const getNowPlayingMovies = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=vi-VN&region=VN&page=${page}`
  );

  const data = await res.json();
  return data.results;
};

// PHIM SẮP CHIẾU
export const getUpcomingMovies = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=vi-VN&region=VN&page=${page}`
  );

  const data = await res.json();
  return data.results;
};

// PHIM ĐÁNH GIÁ CAO NHẤT (THÊM MỚI)
export const getTopRatedMovies = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=vi-VN&page=${page}`
  );

  const data = await res.json();
  return data.results;
};

export const getBannerMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=vi-VN&region=VN&page=1`
  );

  const data = await res.json();

  // lấy 3 phim đang chiếu đầu tiên
  return data.results.slice(0, 3);
};

// Local movies seeded in backend
export const getLocalMovies = async () => {
  try {
    const res = await fetch(`${API_URL}/movies`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch local movies:", err);
    return [];
  }
};

export const getMovieTrailer = async (movieId) => {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=vi-VN`
  );

  const data = await res.json();

  const trailer = data.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return trailer;
  
};
export const getMovieCredits = async (movieId) => {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=vi-VN`
  );
  const data = await res.json();
  return data;
};