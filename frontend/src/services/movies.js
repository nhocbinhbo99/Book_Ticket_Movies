const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

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

export const getBannerMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=vi-VN&region=VN&page=1`
  );

  const data = await res.json();

  // lấy 3 phim đang chiếu đầu tiên
  return data.results.slice(0, 3);
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