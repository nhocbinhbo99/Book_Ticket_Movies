import { useEffect, useState } from "react";
import {
  getNowPlayingMovies,
  getUpcomingMovies,
} from "../services/movies";
import { Link } from "react-router-dom";
import video from "../assets/Tạo_Video_Giới_Thiệu_Kết_Thúc.mp4";

function Movie() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const [filters, setFilters] = useState({
    status: "Đang chiếu",
    genre: "all",
  });

  // Lấy nhiều trang phim
  useEffect(() => {
    const fetchMovies = async () => {
      const nowPlaying = await getNowPlayingMovies();
      const upcoming = await getUpcomingMovies();
      setMovies([...nowPlaying, ...upcoming]);
      setFilteredMovies([...nowPlaying, ...upcoming]);
    };

    fetchMovies();
  }, []);

  // filter
  const applyFilters = () => {
    const now = new Date();

    const filtered = movies.filter((movie) => {
      // TMDB movies have release_date
      const releaseDate = new Date(movie.release_date);

      // Đang chiếu
      if (filters.status === "Đang chiếu" && releaseDate > now) return false;

      // Sắp chiếu
      if (filters.status === "Sắp chiếu" && releaseDate <= now) return false;

      // Genre filtering for TMDB movies (genre_ids is array of numbers)
      if (filters.genre !== "all" && !movie.genre_ids?.includes(parseInt(filters.genre))) {
        return false;
      }

      return true;
    });

    setFilteredMovies(filtered);
  };

  // reset filter
  const resetFilters = () => {
    setFilters({
      status: "Đang chiếu",
      genre: "all",
    });
    setFilteredMovies(movies);
  };

  return (
    <>
      {/* VIDEO HERO SECTION */}
      <div className="w-full px-6 py-10">
        <div className="relative w-full h-[450px] bg-black rounded-lg border-2 border-yellow-500 overflow-hidden shadow-lg shadow-yellow-500/20">
          <video
            src={video}
            className="w-full h-full object-cover rounded-lg"
            autoPlay
            muted
            loop
            controls
          />
        </div>
      </div>

      {/* FILTER */}
      <section className="bg-[#111] border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-6 flex gap-4 items-end flex-wrap">

          {/* STATUS */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-2 bg-[#222] border border-yellow-500 rounded text-white"
          >
            <option>Đang chiếu</option>
            <option>Sắp chiếu</option>
          </select>

          {/* GENRE */}
          <select
            value={filters.genre}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, genre: e.target.value }))
            }
            className="px-3 py-2 bg-[#222] border border-yellow-500 rounded text-white"
          >
            <option value="all">Tất cả thể loại</option>
            <option value="28">Hành động</option>
            <option value="12">Phiêu lưu</option>
            <option value="16">Hoạt hình</option>
            <option value="35">Hài</option>
            <option value="18">Chính kịch</option>
            <option value="27">Kinh dị</option>
            <option value="10749">Tình cảm</option>
            <option value="878">Khoa học viễn tưởng</option>
          </select>

          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-yellow-500 text-black rounded"
          >
            Lọc
          </button>

          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Reset
          </button>

        </div>
      </section>

      {/* MOVIE LIST */}
      <div className="max-w-7xl mx-auto px-6 py-10 text-white">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

          {filteredMovies.map((movie) => {
            const releaseDate = new Date(movie.release_date);
            const now = new Date();
            const isUpcoming = releaseDate > now;
            const formattedDate = releaseDate.toLocaleDateString("vi-VN");

            return (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="bg-gray-800 p-3 rounded-lg hover:scale-105 transition relative">

                  <img
                    src={
                      movie.poster_path
                        ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}`
                        : "https://via.placeholder.com/300x450"
                    }
                    className="rounded mb-2"
                  />

                  {isUpcoming && (
                    <div className="absolute top-5 right-5 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      Sắp chiếu
                    </div>
                  )}

                  <h3 className="text-sm font-semibold text-center">
                    {movie.title}
                  </h3>

                  {isUpcoming && (
                    <p className="text-xs text-yellow-400 text-center mt-1">
                      {formattedDate}
                    </p>
                  )}

                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default Movie;