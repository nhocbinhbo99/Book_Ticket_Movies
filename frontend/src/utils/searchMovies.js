const API_KEY = import.meta.env.VITE_API_KEY;

export const searchMovies = async (query) => {
  if (!query) return [];

  // lấy phim đang chiếu ngoài rạp
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=vi-VN&region=VN`
  );

  const data = await res.json();

  // filter theo tên phim
  const filtered = data.results.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return filtered.slice(0, 8);
};