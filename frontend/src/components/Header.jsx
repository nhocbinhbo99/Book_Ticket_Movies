import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { searchMovies } from "../utils/searchMovies";

function Header() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  // search realtime
  useEffect(() => {
    const fetchMovies = async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      const data = await searchMovies(search);
      setResults(data.slice(0, 6));
    };

    const debounce = setTimeout(fetchMovies, 400);

    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <header className="w-full bg-[#1f1f1f] text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} className="w-10 h-10 object-contain" />
          <span className="text-xl font-semibold hover:text-yellow-400">
            TicketFlix
          </span>
        </Link>

        {/* MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-yellow-400">Trang chủ</Link>
          <Link to="/movie" className="hover:text-yellow-400">Phim</Link>
          <Link to="/ticket" className="hover:text-yellow-400">Vé</Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative">

          {/* SEARCH */}
          <div className="hidden md:flex items-center bg-[#2a2a2a] rounded-full px-3 py-1 shadow-inner">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm phim..."
              className="bg-transparent outline-none text-sm w-36 placeholder-gray-400"
            />

            <span className="ml-2 text-gray-400">🔍</span>
          </div>

          {/* DROPDOWN RESULT */}
          {results.length > 0 && (
            <div className="absolute top-12 right-0 w-80 bg-[#111] rounded-lg shadow-lg border border-gray-700 z-50">

              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => {
                    navigate(`/movie/${movie.id}`);
                    setSearch("");
                    setResults([]);
                  }}
                  className="flex gap-3 p-3 hover:bg-gray-800 cursor-pointer"
                >

                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "https://via.placeholder.com/80"
                    }
                    className="w-12 rounded"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      {movie.title}
                    </p>

                    <p className="text-xs text-gray-400">
                      {movie.release_date}
                    </p>
                  </div>

                </div>
              ))}

            </div>
          )}

          {/* AVATAR */}
          <Link
            to="/account"
            className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500"
          >
            👤
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Header;