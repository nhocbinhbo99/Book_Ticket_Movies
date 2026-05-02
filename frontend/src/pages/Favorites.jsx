import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFavorites } from "../services/favorites";
import { useAuth } from "../context/AuthContext";

function Favorites() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const data = await getFavorites(token);
        if (data && data.favorites && data.favorites.length > 0) {
          // Fetch details for each movie ID
          const moviePromises = data.favorites.map((id) =>
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_API_KEY}&language=vi-VN`).then(res => res.json())
          );
          const moviesData = await Promise.all(moviePromises);
          // Filter out any failed requests
          const validMovies = moviesData.filter(m => m && m.id);
          setMovies(validMovies);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  const MovieCard = ({ movie }) => {
    const releaseDate = movie.release_date ? new Date(movie.release_date) : new Date();
    const now = new Date();
    const isUpcoming = releaseDate > now;
    const formattedDate = releaseDate.toLocaleDateString("vi-VN");

    return (
      <Link to={`/movie/${movie._id || movie.id}`}>
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
          {/* Poster Container */}
          <div className="relative overflow-hidden">
            <img
              src={
                movie.poster_path
                  ? `${import.meta.env.VITE_IMG_URL || "https://image.tmdb.org/t/p/w500"}${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Hover Action Button */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2.5 rounded-full font-bold text-sm transform hover:scale-105 transition duration-300 shadow-lg flex items-center gap-2">
                <span>❤️</span> Xem phim
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-pink-400 transition-colors text-center">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>{releaseDate.getFullYear()}</span>
              {movie.runtime && (
                <>
                  <span>•</span>
                  <span>{movie.runtime} phút</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060e1f] to-black pt-24 pb-16 px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                        rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 flex items-center justify-center gap-3">
            <span className="text-pink-500">❤️</span> Danh sách yêu thích
          </h1>
          <p className="text-gray-400">Những bộ phim mà {user?.fullName || "bạn"} đã lưu lại</p>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Chưa có phim yêu thích</h3>
            <p className="text-gray-400">Bạn chưa thả tim bộ phim nào cả!</p>
            <Link to="/movie">
              <button className="mt-6 bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-400 transition transform hover:scale-105 shadow-lg shadow-pink-500/25">
                Khám phá phim ngay
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
