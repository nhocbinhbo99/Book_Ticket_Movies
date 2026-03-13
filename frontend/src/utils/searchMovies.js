const API_KEY = import.meta.env.VITE_API_KEY;

export const searchMovies = async (query) => {
  if (!query) return [];

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=vi-VN&query=${query}`
  );

  const data = await res.json();

  const today = new Date();

  // chỉ lấy phim đang chiếu hoặc sắp chiếu
  const filtered = data.results.filter((movie) => {
    const release = new Date(movie.release_date);

    return (
      movie.release_date &&
      (release <= today || release > today) // có ngày phát hành
    );
  });

  return filtered.slice(0, 8);
};