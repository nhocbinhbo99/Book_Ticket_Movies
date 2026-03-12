import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import { getPopularMovies } from "../services/movies";
import { Link } from "react-router-dom";

function Movie() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filters, setFilters] = useState({
    status: "Đang chiếu",
    genre: "Hành động",
    language: "Tiếng Việt",
    country: "Việt Nam",
    month: 1,
    year: 2022,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getPopularMovies();
      setMovies(data);
      setFilteredMovies(data);
    };
    fetchMovies();
  }, []);

  const applyFilters = () => {
    const now = new Date();
    const filtered = movies.filter((movie) => {
      if (!movie.release_date) return false;
      const releaseDate = new Date(movie.release_date);
      const movieYear = releaseDate.getFullYear();
      const movieMonth = releaseDate.getMonth() + 1;

      if (filters.status === "Đang chiếu") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        if (releaseDate < oneYearAgo) return false;
      }

      if (filters.status === "Hoàn thành") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        if (releaseDate >= oneYearAgo) return false;
      }

      if (movieYear !== filters.year) return false;
      if (movieMonth !== filters.month) return false;

      
      return true;
    });
    setFilteredMovies(filtered);
  };

  return (
    <>
      <Banner />

      
      <section className="bg-[#111] border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 w-full">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300">Trạng thái</label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full appearance-none px-3 py-2 bg-[#222] border border-yellow-500 rounded text-sm text-white focus:outline-none focus:ring-0 focus:bg-[#222] active:bg-[#222] pr-8"
                  >
                    <option>Đang chiếu</option>
                    <option>Hoàn thành</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">▼</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300">Thể loại</label>
                <div className="relative">
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters((prev) => ({ ...prev, genre: e.target.value }))}
                    className="w-full appearance-none px-3 py-2 bg-[#222] border border-yellow-500 rounded text-sm text-white focus:outline-none focus:ring-0 focus:bg-[#222] active:bg-[#222] pr-8"
                  >
                    <option>Hành động</option>
                    <option>Hài hước</option>
                    <option>Tình cảm</option>
                    <option>Kinh dị</option>
                    <option>Phiêu lưu</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">▼</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300">Ngôn ngữ</label>
                <div className="relative">
                  <select
                    value={filters.language}
                    onChange={(e) => setFilters((prev) => ({ ...prev, language: e.target.value }))}
                    className="w-full appearance-none px-3 py-2 bg-[#222] border border-yellow-500 rounded text-sm text-white focus:outline-none focus:ring-0 focus:bg-[#222] active:bg-[#222] pr-8"
                  >
                    <option>Tiếng Việt</option>
                    <option>Tiếng Anh</option>
                    <option>Tiếng Hàn</option>
                    <option>Tiếng Nhật</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">▼</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300">Quốc gia</label>
                <div className="relative">
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
                    className="w-full appearance-none px-3 py-2 bg-[#222] border border-yellow-500 rounded text-sm text-white focus:outline-none focus:ring-0 focus:bg-[#222] active:bg-[#222] pr-8"
                  >
                    <option>Việt Nam</option>
                    <option>Mỹ</option>
                    <option>Hàn Quốc</option>
                    <option>Nhật Bản</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">▼</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300">Tháng</label>
                <div className="relative">
                  <select
                    value={filters.month}
                    onChange={(e) => setFilters((prev) => ({ ...prev, month: Number(e.target.value) }))}
                    className="w-full appearance-none px-3 py-2 bg-[#222] border border-yellow-500 rounded text-sm text-white focus:outline-none focus:ring-0 focus:bg-[#222] active:bg-[#222] pr-8"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>{`Tháng ${m}`}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">▼</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300">Năm</label>
                <div className="relative">
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters((prev) => ({ ...prev, year: Number(e.target.value) }))}
                    className="w-full appearance-none px-3 py-2 bg-[#222] border border-yellow-500 rounded text-sm text-white focus:outline-none focus:ring-0 focus:bg-[#222] active:bg-[#222] pr-8"
                  >
                    {Array.from({ length: 6 }, (_, i) => 2022 + i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">▼</span>
                </div>
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="h-10 px-4 rounded bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
            >
              Lọc
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 text-white">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <div className="bg-gray-800 p-3 rounded-lg hover:scale-105 transition shadow-md hover:shadow-red-500/40">
                <img
                  src={`${import.meta.env.VITE_IMG_URL}${movie.poster_path}`}
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