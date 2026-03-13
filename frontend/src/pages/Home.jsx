import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import { getNowPlayingMovies, getUpcomingMovies } from "../services/movies";
import { Link } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const nowPlaying = await getNowPlayingMovies(1);
      const upcoming = await getUpcomingMovies(1);

      // lấy 6 phim đang chiếu + 4 phim sắp chiếu
      const combined = [
        ...nowPlaying.slice(0, 6).map((m) => ({ ...m, status: "now" })),
        ...upcoming.slice(0, 4).map((m) => ({ ...m, status: "upcoming" })),
      ];

      setMovies(combined);
    };

    fetchMovies();
  }, []);

  return (
    <>
      <Banner />

      <div className="max-w-7xl mx-auto px-6 py-10 text-white">

        <h2 className="text-2xl font-bold mb-6">
          Phim đang chiếu & sắp chiếu
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

          {movies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>

              <div className="bg-gray-800 p-3 rounded-lg hover:scale-105 transition relative">

                {/* label sắp chiếu */}
                {movie.status === "upcoming" && (
                  <span className="absolute top-2 left-2 bg-red-500 text-xs px-2 py-1 rounded">
                    Sắp chiếu
                  </span>
                )}

                <img
                  src={
                    movie.poster_path
                      ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}`
                      : "https://via.placeholder.com/300x450"
                  }
                  className="rounded mb-2"
                />

                <h3 className="text-sm font-semibold text-center">
                  {movie.title}
                </h3>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </>
  );
}

export default Home;