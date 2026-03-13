import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBannerMovies } from "../services/movies";

function Banner() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      const data = await getBannerMovies();
      setMovies(data);
    };
    fetchBanner();
  }, []);

  // auto slide
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  const movie = movies[current];

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % movies.length);

  const prevSlide = () =>
    setCurrent((prev) =>
      prev === 0 ? movies.length - 1 : prev - 1
    );

  return (
    <div className="relative w-full h-[520px] overflow-hidden">

      {/* BACKGROUND */}
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        className="absolute w-full h-full object-cover transition-opacity duration-700"
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center px-16 text-white max-w-7xl mx-auto">

        <div className="max-w-xl">

          {/* TITLE */}
          <h1 className="text-5xl font-bold leading-tight">
            {movie.title}
          </h1>

          {/* RATING */}
          <div className="mt-3 flex items-center gap-3">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded font-semibold">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>

            <span className="text-gray-300 text-sm">
              {movie.release_date}
            </span>
          </div>

          {/* OVERVIEW */}
          <p className="mt-4 text-gray-300 line-clamp-3">
            {movie.overview}
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-4">

            <Link to={`/movie/${movie.id}`}>
              <button className="bg-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition">
                ▶ Đặt vé
              </button>
            </Link>

            <Link to={`/movie/${movie.id}`}>
              <button className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
                Chi tiết
              </button>
            </Link>

          </div>

        </div>

      </div>

      {/* ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-3 rounded-full"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-3 rounded-full"
      >
        ❯
      </button>

      {/* DOTS */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3">
        {movies.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              index === current
                ? "bg-yellow-400 scale-125"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>

    </div>
  );
}

export default Banner;