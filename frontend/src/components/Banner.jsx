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
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  const movie = movies[current];

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      
      {/* IMAGE */}
      <Link to={`/movie/${movie.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="w-full h-full object-cover cursor-pointer"
        />
      </Link>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50 flex items-center">
        <div className="ml-16 text-white max-w-xl">
          <h1 className="text-5xl font-bold">{movie.title}</h1>

          <p className="mt-4 text-gray-300 line-clamp-3">
            {movie.overview}
          </p>

          <Link to={`/movie/${movie.id}`}>
            <button className="mt-6 border border-red-500 px-6 py-2 rounded-full hover:bg-red-500">
              ▶ ĐẶT VÉ
            </button>
          </Link>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {movies.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === current ? "bg-yellow-400" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;
