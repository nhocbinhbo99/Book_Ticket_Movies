import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchMovies } from "../utils/searchMovies";

function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      if (query.length < 2) {
        setMovies([]);
        return;
      }

      const results = await searchMovies(query);


      const filtered = results.filter((movie) => {
        if (!movie.release_date) return false;
        return true;
      });

      setMovies(filtered);
    };

    const debounce = setTimeout(fetchMovies, 400);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 p-10 text-white">

      {/* SEARCH INPUT */}
      <div className="max-w-5xl mx-auto mb-10 flex items-center gap-3">

        <input
          autoFocus
          placeholder="Tìm phim..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-b border-gray-600 text-2xl outline-none pb-2"
        />

        <button onClick={onClose} className="text-3xl">
          ✕
        </button>

      </div>

      {/* RESULT */}
      <div className="max-w-5xl mx-auto">

        <p className="text-gray-400 mb-4">Danh sách phim</p>

        {movies.map((movie) => {

          const isUpcoming =
            new Date(movie.release_date) > new Date();

          return (
            <div
              key={movie.id}
              onClick={() => {
                navigate(`/movie/${movie.id}`);
                onClose();
              }}
              className="flex gap-4 items-center py-3 cursor-pointer hover:bg-gray-800 px-3 rounded transition"
            >

              {/* POSTER */}
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://via.placeholder.com/100"
                }
                className="w-14 rounded"
              />

              {/* INFO */}
              <div>
                <p className="font-semibold flex items-center gap-2">

                  {movie.title}

                  {isUpcoming && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                      Sắp chiếu
                    </span>
                  )}

                </p>

                <p className="text-sm text-gray-400">
                  {movie.release_date}
                </p>

              </div>

            </div>
          );
        })}

        {/* KHÔNG TÌM THẤY */}
        {movies.length === 0 && query.length >= 2 && (
          <p className="text-center text-gray-400 mt-10">
            ❌ Không tìm thấy phim
          </p>
        )}

      </div>

    </div>
  );
}

export default SearchOverlay;