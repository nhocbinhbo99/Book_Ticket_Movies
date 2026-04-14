const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=vi-VN`
  );

  const data = await res.json();
 // console.log("API KEY:", API_KEY);

  return data.results;
  
};
export const getBannerMovies = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=vi-VN`
  );

  const data = await res.json();
  return data.results.slice(0, 3); // lấy 3 phim đầu
};

export const getMovieTrailer = async (movieId) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_API_KEY}&language=vi-VN`
  );

  const data = await res.json();

  const trailer = data.results.find(
    (video) =>
      video.type === "Trailer" && video.site === "YouTube"
  );

  return trailer;
};
