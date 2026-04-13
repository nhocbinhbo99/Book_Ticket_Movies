import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { searchMovies } from "../utils/searchMovies";

function Header() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Detect scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search realtime
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setIsSearchOpen(true);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setSearch("");
    setResults([]);
    setIsSearchOpen(false);
  };

  const navItems = [
    { path: "/", name: "Trang chủ", icon: "" },
    { path: "/movie", name: "Phim", icon: "" },
    { path: "/news", name: "Tin điện ảnh", icon: "" },
    { path: "/ticket", name: "Vé của tôi", icon: "" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-2xl"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src={logo} className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110" alt="Logo" />
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-white transition-all duration-300">
              TicketFlix
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 group"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-red-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* SEARCH BAR - Desktop */}
            <div ref={searchRef} className="hidden md:block relative">
              <div className={`relative transition-all duration-300 ${isSearchOpen ? "w-80" : "w-64"}`}>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Tìm phim..."
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-black/50 transition-all duration-300"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* SEARCH RESULTS DROPDOWN */}
              {isSearchOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 right-0 w-96 bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-fadeInDown z-50">
                  <div className="p-2 border-b border-gray-700">
                    <p className="text-xs text-gray-400 px-3 py-1">🎬 Kết quả tìm kiếm</p>
                  </div>
                  {results.map((movie, index) => (
                    <div
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id)}
                      className="flex gap-3 p-3 hover:bg-white/10 cursor-pointer transition-all duration-300 group animate-slideIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                            : "https://via.placeholder.com/80x120?text=No+Image"
                        }
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          {movie.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {movie.release_date?.split('-')[0] || "Sắp chiếu"}
                        </p>
                        {movie.vote_average > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-xs">⭐</span>
                            <span className="text-xs text-gray-400">{movie.vote_average.toFixed(1)}/10</span>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-500 group-hover:text-yellow-400 transition-colors">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* USER MENU */}
            <div className="relative group">
              <Link
                to="/account"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-red-500 p-0.5 rounded-full hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-gray-800 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-slideDown">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white font-medium group-hover:text-yellow-400 transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
            
            {/* Mobile Search */}
            <div className="px-4 pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Tìm phim..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;