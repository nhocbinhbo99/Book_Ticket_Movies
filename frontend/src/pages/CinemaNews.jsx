import { useEffect, useState } from "react";
import { getNowPlayingMovies } from "../services/movies";

function CinemaNews() {
  const [movies, setMovies] = useState([]);
  const [comments, setComments] = useState({});
  const [openMovieId, setOpenMovieId] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      // lấy danh sách phim đang chiếu
      const nowPlaying = await getNowPlayingMovies(1);
      setMovies(nowPlaying); 
    };
    fetchMovies();
  }, []);

  const addComment = (movieId, text) => {
    setComments((prev) => ({
      ...prev,
      [movieId]: [...(prev[movieId] || []), { text, likes: 0 }]
    }));
  };

  const likeComment = (movieId, index) => {
    setComments((prev) => {
      const updated = [...prev[movieId]];
      updated[index].likes += 1;
      return { ...prev, [movieId]: updated };
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h2 className="text-2xl font-bold mb-6">Phim đang chiếu</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 p-4 rounded-lg cursor-pointer hover:scale-105 transition"
            onClick={() =>
              setOpenMovieId(openMovieId === movie.id ? null : movie.id)
            }
          >
            <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
            <img
              src={
                movie.poster_path
                  ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              className="w-full rounded mb-2"
            />
            <p className="text-sm text-gray-400 mb-2">
              Ngày phát hành: {movie.release_date}
            </p>

            {/* Chỉ hiện bình luận khi bấm vào */}
            {openMovieId === movie.id && (
              <CommentBox
                movieId={movie.id}
                comments={comments[movie.id] || []}
                onAdd={addComment}
                onLike={likeComment}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentBox({ movieId, comments, onAdd, onLike }) {
  const [text, setText] = useState("");

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Viết bình luận..."
          className="flex-1 px-3 py-1 rounded bg-gray-700 text-white"
        />
        <button
          onClick={() => {
            if (text.trim()) {
              onAdd(movieId, text);
              setText("");
            }
          }}
          className="bg-yellow-500 px-3 py-1 rounded"
        >
          Gửi
        </button>
      </div>

      {comments.map((c, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-gray-800 p-2 rounded mb-2"
        >
          <span>{c.text}</span>
          <button
            onClick={() => onLike(movieId, i)}
            className="flex items-center gap-1 text-red-400"
          >
            ❤️ {c.likes}
          </button>
        </div>
      ))}
    </div>
  );
}

export default CinemaNews;
