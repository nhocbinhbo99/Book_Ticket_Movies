import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import { getNowPlayingMovies, getUpcomingMovies } from "../services/movies";
import { Link } from "react-router-dom";

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
      let allMovies = [];

      const page1 = await getNowPlayingMovies(1);
      const page2 = await getNowPlayingMovies(2);
      const page3 = await getNowPlayingMovies(3);

      const upcoming = await getUpcomingMovies(1);

      allMovies = [...page1, ...page2, ...page3, ...upcoming];

      // bỏ phim trùng
      const uniqueMovies = Array.from(
        new Map(allMovies.map((m) => [m.id, m])).values()
      );

      setMovies(uniqueMovies);
      setFilteredMovies(uniqueMovies);
    };

    fetchMovies();
  }, []);

  // filter
  const applyFilters = () => {
    const now = new Date();

    const filtered = movies.filter((movie) => {
      const releaseDate = new Date(movie.release_date);

      // Đang chiếu
      if (filters.status === "Đang chiếu" && releaseDate > now) return false;

      // Sắp chiếu
      if (filters.status === "Sắp chiếu" && releaseDate <= now) return false;

      // genre
      if (filters.genre !== "all") {
        if (!movie.genre_ids.includes(Number(filters.genre))) return false;
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
      <Banner />

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

          {filteredMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <div className="bg-gray-800 p-3 rounded-lg hover:scale-105 transition">

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

export default Movie;