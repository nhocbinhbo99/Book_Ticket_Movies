import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieCredits } from "../services/movies";
import { useAuth } from "../context/AuthContext";
import { getFavorites, toggleFavorite } from "../services/favorites";

function MovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newName, setNewName] = useState("");
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      try {
        const [movieRes, trailerRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_API_KEY}&language=vi-VN`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_API_KEY}`),
          getMovieCredits(id)
        ]);

        const movieData = await movieRes.json();
        const trailerData = await trailerRes.json();
        
        setMovie(movieData);
        setCredits(creditsRes);
        
        const yt = trailerData.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (yt) setTrailer(yt.key);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      if (token && id) {
        try {
          const data = await getFavorites(token);
          if (data && data.favorites && data.favorites.includes(Number(id))) {
            setIsFavorite(true);
          }
        } catch (error) {
          console.error("Error fetching favorite status:", error);
        }
      }
    };

    fetchMovieData();
    checkFavoriteStatus();
  }, [id, token]);

  const handleToggleFavorite = async () => {
    if (!token) {
      alert("Vui lòng đăng nhập để lưu phim yêu thích.");
      navigate("/account");
      return;
    }
    
    try {
      // Optimitistic update
      setIsFavorite(!isFavorite);
      
      const data = await toggleFavorite(Number(id), token);
      if (data && typeof data.added === "boolean") {
        setIsFavorite(data.added);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert on error
      setIsFavorite(isFavorite);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const addReview = () => {
    if (!newReview || !newName || rating === 0) return;
    setReviews([...reviews, { name: newName, text: newReview, rating, date: new Date().toLocaleDateString('vi-VN') }]);
    setNewReview("");
    setNewName("");
    setRating(0);
  };

  // Lấy thông tin đạo diễn và diễn viên
  const director = credits?.crew?.find(member => member.job === "Director")?.name || "Đang cập nhật";
  const writers = credits?.crew?.filter(member => member.job === "Screenplay" || member.job === "Writer" || member.job === "Story").slice(0, 3);
  const mainCast = credits?.cast?.slice(0, 10) || [];

  // Format runtime từ phút sang giờ và phút
  const formatRuntime = (minutes) => {
    if (!minutes || minutes === 0) return "Chưa cập nhật";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} phút`;
    return `${hours} giờ ${mins} phút`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "Chưa cập nhật";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
    {/* BACKDROP BANNER - BẢN RÕ NÉT NHẤT */}
<div
  className="relative h-[550px] bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
  {/* Overlay nhẹ để đọc chữ */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
  
  {/* Play Button lớn và rõ */}
  {trailer && (
    <div className="absolute inset-0 flex items-center justify-center">
      <button
        onClick={() => setShowTrailer(true)}
        className="group relative w-28 h-28 rounded-full bg-black/30 backdrop-blur-sm hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 border-2 border-white/30"
      >
        <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        <span className="text-5xl text-white group-hover:text-black transition-colors">▶</span>
      </button>
    </div>
  )}
</div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-28 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* POSTER */}
          <div className="md:w-72 shrink-0">
            <img
              src={`${import.meta.env.VITE_IMG_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl border border-gray-700"
            />
            
            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate(`/movie/ticketbooking/${movie.id}`)}
                className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-black font-bold py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm"
              >
                🎫 ĐẶT VÉ NGAY
              </button>
              <button
                onClick={handleToggleFavorite}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                {isFavorite ? "❤️ Đã thích" : "🤍 Thêm vào yêu thích"}
              </button>
            </div>
          </div>

          {/* INFO */}
          <div className="flex-1">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            
            {/* Original Title */}
            {movie.original_title !== movie.title && (
              <p className="text-gray-400 text-sm mb-3">{movie.original_title}</p>
            )}

            {/* Stats Row - ĐÃ SỬA: runtime thật từ API */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full">
                <span className="text-yellow-400">⭐</span>
                <span className="text-white font-bold text-sm">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-gray-400 text-xs">/10</span>
              </div>
              <div className="text-gray-300 text-xs bg-gray-800/50 px-3 py-1 rounded-full">
                📅 {new Date(movie.release_date).getFullYear()}
              </div>
              <div className="text-gray-300 text-xs bg-gray-800/50 px-3 py-1 rounded-full">
                ⏱️ {formatRuntime(movie.runtime)}
              </div>
              <div className="text-gray-300 text-xs bg-gray-800/50 px-3 py-1 rounded-full">
                🎬 {movie.status === "Released" ? "Đang chiếu" : "Sắp chiếu"}
              </div>
            </div>

            {/* Genres */}
            <div className="flex gap-2 flex-wrap mb-5">
              {movie.genres?.slice(0, 5).map((g) => (
                <span
                  key={g.id}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs hover:bg-yellow-500 hover:text-black transition-colors cursor-pointer"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* TABS */}
            <div className="border-b border-gray-700 mb-5">
              <div className="flex gap-5">
                {["overview", "cast", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 px-1 font-semibold transition-all duration-300 relative text-sm ${
                      activeTab === tab
                        ? "text-yellow-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab === "overview" && "📖 Tổng quan"}
                    {tab === "cast" && "🎭 Diễn viên"}
                    {tab === "reviews" && `💬 Đánh giá (${reviews.length})`}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "overview" && (
              <div className="bg-gray-800/50 rounded-xl p-5">
                <h3 className="text-base font-semibold text-white mb-2">Nội dung phim</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {showFullOverview ? movie.overview : movie.overview?.slice(0, 350)}
                  {movie.overview?.length > 350 && (
                    <button
                      onClick={() => setShowFullOverview(!showFullOverview)}
                      className="text-yellow-500 hover:text-yellow-400 ml-2 text-xs"
                    >
                      {showFullOverview ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </p>
                
                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-700">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">ĐẠO DIỄN</p>
                    <p className="text-white text-sm font-medium">{director}</p>
                  </div>
                  {writers && writers.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">BIÊN KỊCH</p>
                      <p className="text-white text-sm">{writers.map(w => w.name).join(", ")}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500 text-xs mb-1">THỜI LƯỢNG</p>
                    <p className="text-white text-sm">{formatRuntime(movie.runtime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">NGÔN NGỮ</p>
                    <p className="text-white text-sm">
                      {movie.spoken_languages?.map(l => l.english_name).slice(0, 2).join(", ") || "Đang cập nhật"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">QUỐC GIA</p>
                    <p className="text-white text-sm">
                      {movie.production_countries?.map(c => c.name).slice(0, 2).join(", ") || "Đang cập nhật"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">NGÂN SÁCH</p>
                    <p className="text-white text-sm">{formatCurrency(movie.budget)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">DOANH THU</p>
                    <p className="text-white text-sm">{formatCurrency(movie.revenue)}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cast" && (
              <div className="space-y-5">
                {/* ĐẠO DIỄN */}
                <div className="bg-gray-800/50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-yellow-500 mb-3">🎬 ĐẠO DIỄN</h3>
                  <div className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                      🎥
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{director}</p>
                      <p className="text-gray-500 text-xs">Director</p>
                    </div>
                  </div>
                </div>

                {/* DIỄN VIÊN */}
                <div className="bg-gray-800/50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-yellow-500 mb-3">⭐ DIỄN VIÊN CHÍNH</h3>
                  {mainCast.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">Đang cập nhật...</p>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {mainCast.map((actor) => (
                        <div key={actor.cast_id} className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-2 hover:bg-gray-700 transition-colors">
                          {actor.profile_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                              alt={actor.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                              🎭
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{actor.name}</p>
                            <p className="text-gray-500 text-xs">vai {actor.character || "..."}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-xl p-8 text-center">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-gray-400 text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {reviews.map((r, i) => (
                      <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-white text-sm">{r.name}</p>
                          <p className="text-xs text-gray-500">{r.date}</p>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`text-xs ${star <= r.rating ? "text-yellow-400" : "text-gray-600"}`}>★</span>
                          ))}
                        </div>
                        <p className="text-gray-300 text-xs">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Review Form */}
                <div className="bg-gray-800/50 rounded-xl p-5 mt-5">
                  <h3 className="text-sm font-semibold text-white mb-3">Viết đánh giá</h3>
                  
                  <input
                    type="text"
                    placeholder="Tên của bạn"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 mb-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-yellow-500"
                  />

                  <textarea
                    placeholder="Chia sẻ cảm nhận của bạn về phim..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 mb-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-yellow-500 resize-none"
                  />

                  {/* Star Rating */}
                  <div className="mb-3">
                    <p className="text-gray-400 text-xs mb-1">Đánh giá của bạn:</p>
                    <div className="flex gap-1 text-2xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`transition-transform hover:scale-110 ${
                            star <= rating ? "text-yellow-400" : "text-gray-600"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={addReview}
                    className="bg-gradient-to-r from-yellow-500 to-red-500 text-black font-semibold px-4 py-1.5 rounded-lg text-sm hover:shadow-lg transition-all duration-300"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

     
        {/* TRAILER MODAL - POPUP TO CHẤT LƯỢNG CAO */}
{/* TRAILER MODAL - FIX VỠ NÉT */}
{showTrailer && trailer && (
  <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowTrailer(false)}>
    <div className="relative w-[95%] max-w-6xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setShowTrailer(false)}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white text-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
      >
        ✕
      </button>
      
      {/* Video Player - FIX VỠ NÉT */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* Tỉ lệ 16:9 */}
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${trailer}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&vq=hd1080&quality=high&hd=1`}
          title="Movie Trailer"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          style={{ border: 'none', objectFit: 'contain' }}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-semibold">{movie?.title}</p>
        <p className="text-gray-300 text-sm">Trailer chính thức - Chất lượng HD</p>
      </div>
    </div>
  </div>
)}
    </div>
  );
  
}


export default MovieDetail;