import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newName, setNewName] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_API_KEY}&language=vi-VN`,
      );
      const data = await res.json();
      setMovie(data);
    };

    const fetchTrailer = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await res.json();
      const yt = data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      if (yt) setTrailer(yt.key);
    };

    fetchMovie();
    fetchTrailer();
  }, [id]);

  const addReview = () => {
    if (!newReview || !newName || rating === 0) return;
    setReviews([...reviews, { name: newName, text: newReview, rating }]);
    setNewReview("");
    setNewName("");
    setRating(0);
  };

  if (!movie) return <p className="p-10 text-white">Loading...</p>;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* BANNER */}
      <div
        className="h-[480px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${import.meta.env.VITE_IMG_URL}${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          {trailer && (
            <button
              onClick={() => setShowTrailer(true)}
              className="w-24 h-24 bg-white/30 rounded-full text-4xl hover:scale-110 transition backdrop-blur"
            >
              ▶
            </button>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-16">
        <div className="flex flex-col md:flex-row gap-10">
          {/* POSTER */}
          <img
            src={`${import.meta.env.VITE_IMG_URL}${movie.poster_path}`}
            className="
    w-64 
    h-[380px] 
    object-cover 
    rounded-xl 
    shadow-2xl 
    border border-gray-700
  "
          />

          {/* INFO */}
          <div className="flex-1 mt-20">
            <h1 className="text-5xl font-bold mb-3">{movie.title}</h1>

            <p className="text-gray-400 mb-3">
              📅 {movie.release_date} • ⭐ {movie.vote_average}
            </p>

            {/* GENRES */}
            <div className="flex gap-2 flex-wrap mb-6">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mb-6">
              <button
                className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 shadow transition"
                onClick={() => {
                  navigate(`/movie/ticketbooking/${movie.id}`);
                }}
              >
                ▶ Đặt Vé Ngay
              </button>
              <button className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 shadow transition">
                ❤ Yêu Thích
              </button>
            </div>

            {/* OVERVIEW */}
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
              <h2 className="text-xl font-semibold mb-3">Tóm tắt</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

        {reviews.map((r, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded mb-4 shadow">
            <p className="font-semibold">{r.name}</p>
            <p className="text-yellow-400">{"★".repeat(r.rating)}</p>
            <p className="text-gray-300">{r.text}</p>
          </div>
        ))}

        {/* FORM */}
        <div className="bg-gray-900 p-6 rounded mt-8 border border-gray-800">
          <input
            placeholder="Tên"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 mb-3 text-black rounded"
          />

          <textarea
            placeholder="Nhập đánh giá..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="w-full p-2 text-black rounded"
          />

          {/* STAR PICK */}
          <div className="my-3 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${
                  star <= rating ? "text-yellow-400" : "text-gray-600"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <button
            onClick={addReview}
            className="mt-3 bg-yellow-500 px-6 py-2 rounded hover:bg-yellow-600 transition"
          >
            Gửi đánh giá
          </button>
        </div>
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-[85%] h-[75%] bg-black relative rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-3 text-white text-2xl"
            >
              ✕
            </button>

            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer}`}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
