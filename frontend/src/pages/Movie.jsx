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
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("Đang chiếu");

  // Lấy nhiều trang phim
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const nowPlaying = await getNowPlayingMovies(1);
        const upcoming = await getUpcomingMovies(1);
        const allMovies = [...nowPlaying, ...upcoming];
        setMovies(allMovies);
        setFilteredMovies(allMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auto apply filters when filters change
  useEffect(() => {
    const now = new Date();

    const filtered = movies.filter((movie) => {
      const releaseDate = new Date(movie.release_date);

      if (selectedStatus === "Đang chiếu" && releaseDate > now) return false;
      if (selectedStatus === "Sắp chiếu" && releaseDate <= now) return false;

      if (selectedGenre !== "all" && !movie.genre_ids?.includes(parseInt(selectedGenre))) {
        return false;
      }

      return true;
    });

    setFilteredMovies(filtered);
  }, [selectedStatus, selectedGenre, movies]);

  // reset filter
  const resetFilters = () => {
    setSelectedStatus("Đang chiếu");
    setSelectedGenre("all");
  };

  const genres = [
    { id: "all", name: "Tất cả", icon: "🎬" },
    { id: "28", name: "Hành động", icon: "⚡" },
    { id: "12", name: "Phiêu lưu", icon: "🗺️" },
    { id: "16", name: "Hoạt hình", icon: "🐭" },
    { id: "35", name: "Hài", icon: "😂" },
    { id: "18", name: "Chính kịch", icon: "🎭" },
    { id: "27", name: "Kinh dị", icon: "👻" },
    { id: "10749", name: "Tình cảm", icon: "💕" },
    { id: "878", name: "Viễn tưởng", icon: "🚀" },
  ];

  const MovieCard = ({ movie }) => {
    const releaseDate = new Date(movie.release_date);
    const now = new Date();
    const isUpcoming = releaseDate > now;
    const formattedDate = releaseDate.toLocaleDateString("vi-VN");

    return (
      <Link to={`/movie/${movie.id}`}>
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
          
          {/* Poster Container */}
          <div className="relative overflow-hidden">
            <img
              src={
                movie.poster_path
                  ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Status Badge */}
            {isUpcoming ? (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">
                🎬 Sắp chiếu
              </div>
            ) : (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                🔥 Đang chiếu
              </div>
            )}

            {/* Rating Badge */}
            {movie.vote_average > 0 && (
              <div className="absolute top-3 right-3 z-10 bg-black/80 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <span>⭐</span>
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            )}

            {/* Hover Action Button */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <button className="bg-gradient-to-r from-yellow-500 to-red-500 text-black px-6 py-2.5 rounded-full font-bold text-sm transform hover:scale-105 transition duration-300 shadow-lg">
                {isUpcoming ? "ĐẶT VÉ TRƯỚC" : "ĐẶT VÉ NGAY"}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-yellow-400 transition-colors text-center">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>{releaseDate.getFullYear()}</span>
              <span>•</span>
              <span>{movie.runtime ? `${movie.runtime} phút` : "N/A"}</span>
            </div>

            {isUpcoming && (
              <p className="text-xs text-yellow-400 text-center mt-2 font-semibold">
                Khởi chiếu: {formattedDate}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      
      {/* VIDEO HERO SECTION */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <video
          src={video}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        {/* Hero Text */}
        <div className="absolute bottom-10 left-0 right-0 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 animate-fadeInUp">
            PHIM HAY TẠI RẠP
          </h1>
          <p className="text-gray-300 text-lg animate-fadeInUp animation-delay-200">
            KHÁM PHÁ NHANH THÔI 
          </p>
        </div>
      </div>

      {/* FILTER SECTION */}
      <section className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-yellow-500/30 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Status Tabs */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSelectedStatus("Đang chiếu")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedStatus === "Đang chiếu"
                  ? "bg-gradient-to-r from-yellow-500 to-red-500 text-black shadow-lg transform scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              🎬 Đang chiếu
            </button>
            <button
              onClick={() => setSelectedStatus("Sắp chiếu")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedStatus === "Sắp chiếu"
                  ? "bg-gradient-to-r from-yellow-500 to-red-500 text-black shadow-lg transform scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              ⏰ Sắp chiếu
            </button>
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-gray-400 text-sm mr-2">🎭 Thể loại:</span>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  selectedGenre === genre.id
                    ? "bg-yellow-500 text-black font-semibold shadow-md"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {genre.icon} {genre.name}
              </button>
            ))}
            
            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="ml-auto px-4 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full text-sm transition-all duration-300 flex items-center gap-1"
            >
              <span>🔄</span> Reset
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Tìm thấy <span className="text-yellow-500 font-bold">{filteredMovies.length}</span> phim
          </div>
        </div>
      </section>

      {/* MOVIE GRID */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy phim</h3>
            <p className="text-gray-400">Hãy thử chọn thể loại hoặc trạng thái khác nhé!</p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {/* Load More Button */}
            {filteredMovies.length >= 10 && (
              <div className="text-center mt-12">
                <button className="bg-transparent border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:scale-105">
                  Xem thêm phim
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Movie;