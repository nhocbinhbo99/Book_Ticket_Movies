import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import { getNowPlayingMovies, getUpcomingMovies } from "../services/movies";
import { Link } from "react-router-dom";

function Home() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [nowPlayingRes, upcomingRes] = await Promise.all([
          getNowPlayingMovies(1),
          getUpcomingMovies(1)
        ]);

        // Chỉ lấy 5 phim mỗi loại
        setNowPlaying(nowPlayingRes.slice(0, 5));
        setUpcoming(upcomingRes.slice(0, 5));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const MovieCard = ({ movie, type }) => (
    <Link to={`/movie/${movie.id}`}>
      <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        {/* Status Badge */}
        {type === "upcoming" && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
            🎬 Sắp chiếu
          </div>
        )}
        {type === "now" && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
            🔥 Đang chiếu
          </div>
        )}

        {/* Rating */}
        {movie.vote_average > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Poster */}
        <div className="relative overflow-hidden">
          <img
            src={
              movie.poster_path
                ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-yellow-400 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
            <span className="text-yellow-400 font-semibold">Đặt vé →</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm transform hover:scale-105 transition duration-300">
            {type === "now" ? "ĐẶT VÉ NGAY" : "ĐẶT VÉ TRƯỚC"}
          </button>
        </div>
      </div>
    </Link>
  );

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
      <Banner />

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* PHIM ĐANG CHIẾU */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎬</span>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Phim đang chiếu
              </h2>
            </div>
            {/* Sửa link từ /now-playing thành /movie */}
            <Link 
              to="/movie" 
              state={{ filterStatus: "Đang chiếu" }}
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm flex items-center gap-1 group"
            >
              Xem tất cả ({nowPlaying.length}+) 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {nowPlaying.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="now" />
            ))}
          </div>
        </div>

        {/* PHIM SẮP CHIẾU */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏰</span>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Phim sắp chiếu
              </h2>
            </div>
            {/* Sửa link từ /upcoming thành /movie */}
            <Link 
              to="/movie" 
              state={{ filterStatus: "Sắp chiếu" }}
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm flex items-center gap-1 group"
            >
              Xem tất cả ({upcoming.length}+) 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {upcoming.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="upcoming" />
            ))}
          </div>
        </div>

        {/* ƯU ĐÃI ĐẶC BIỆT */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                🎫 Ưu đãi đặc biệt
              </h2>
              <p className="text-gray-300 mb-6">
                Đặt vé ngay hôm nay để nhận ưu đãi lên đến 50% cho các suất chiếu sớm!
              </p>
              <button className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition transform hover:scale-105">
                Nhận ưu đãi ngay
              </button>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2 animate-bounce">🎬</div>
              <p className="text-white text-sm">Áp dụng đến 31/12/2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;