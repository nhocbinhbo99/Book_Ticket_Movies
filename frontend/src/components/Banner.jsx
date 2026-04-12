import { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getBannerMovies } from "../services/movies";

function Banner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBanner = async () => {
      const data = await getBannerMovies();
      setMovies(data);
    };
    fetchBanner();
  }, []);

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const handleNext = useCallback(() => {
    setDirection("next");
    setNextIndex((prev) => (prev + 1) % movies.length);
    setIsTransitioning(true);
  }, [movies.length]);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 5000);
  }, [stopAutoSlide, handleNext, isTransitioning]);

  // Auto slide
  useEffect(() => {
    if (movies.length === 0) return;
    
    startAutoSlide();
    return () => stopAutoSlide();
  }, [movies.length, startAutoSlide, stopAutoSlide]);
    
  const handlePrev = useCallback(() => {
    setDirection("prev");
    setNextIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsTransitioning(true);
  }, [movies.length]);

  const goToSlide = useCallback((index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? "next" : "prev");
    setNextIndex(index);
    setIsTransitioning(true);
  }, [currentIndex]);

  // Transition handler
  useEffect(() => {
    if (!isTransitioning) return;

    const transitionTimer = setTimeout(() => {
      setCurrentIndex(nextIndex);
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        startAutoSlide();
      }, 100);
      return () => clearTimeout(resetTimer);
    }, 800);

    return () => clearTimeout(transitionTimer);
  }, [isTransitioning, nextIndex, startAutoSlide]);

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[nextIndex];

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-black">
      
      {/* Main Container */}
      <div className="relative w-full h-full">
        
        {/* Current Slide */}
        <div 
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            isTransitioning && direction === "next"
              ? "animate-slideOutLeft"
              : isTransitioning && direction === "prev"
              ? "animate-slideOutRight"
              : ""
          }`}
        >
          <img
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Next Slide */}
        {isTransitioning && (
          <div 
            className={`absolute inset-0 ${
              direction === "next"
                ? "animate-slideInRight"
                : "animate-slideInLeft"
            }`}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${nextMovie.backdrop_path}`}
              alt={nextMovie.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center px-16 text-white">
        <div className={`max-w-xl transition-all duration-700 delay-200 ${
          isTransitioning ? "animate-fadeOut" : "animate-fadeIn"
        }`}>
          
          {/* Badge - NHỎ HƠN */}
          <div className="inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold mb-3 shadow-lg">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
            ĐANG CHIẾU HOT
          </div>

          {/* Title - NHỎ HƠN */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 drop-shadow-2xl">
            {currentMovie.title}
          </h1>

          {/* Info Row - NHỎ HƠN */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-white text-base">{currentMovie.vote_average?.toFixed(1)}</span>
              <span className="text-gray-300 text-xs">/10</span>
            </div>

            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
              📅 {new Date(currentMovie.release_date).getFullYear()}
            </div>

            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
              🎬 2D • 3D • IMAX
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
              ⏱️ {currentMovie.runtime || "120"} phút
            </div>
          </div>

          {/* Overview - NHỎ HƠN */}
          <p className="mt-3 text-gray-200 line-clamp-3 text-sm leading-relaxed drop-shadow-md">
            {currentMovie.overview}
          </p>

          {/* Buttons - NHỎ HƠN */}
          <div className="mt-5 flex gap-3">
            <Link to={`/movie/${currentMovie.id}`}>
              <button className="group relative bg-gradient-to-r from-yellow-500 to-red-500 px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center gap-1.5">
                  🎫 ĐẶT VÉ NGAY
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </Link>

            <Link to={`/movie/${currentMovie.id}`}>
              <button className="group border border-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                <span className="flex items-center gap-1.5">
                  ▶ XEM TRAILER
                </span>
              </button>
            </Link>
          </div>

          {/* Showtimes - NHỎ HƠN */}
          <div className="mt-5 pt-3 border-t border-white/20">
            <p className="text-xs text-gray-300 mb-2 flex items-center gap-1.5">
              <span>🎟️ SUẤT CHIẾU HÔM NAY:</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["10:00", "13:30", "16:45", "19:30", "22:15"].map((time) => (
                <span key={time} className="bg-white/10 hover:bg-yellow-500 hover:text-black px-2.5 py-1 rounded-full text-xs cursor-pointer transition-all duration-300">
                  {time}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
      >
        <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-[5000ms] linear"
          style={{ 
            width: isTransitioning ? "0%" : "100%",
            transition: isTransitioning ? "none" : "width 5000ms linear"
          }}
        />
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
            className="group relative"
          >
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-yellow-500"
                : "bg-white/50 group-hover:bg-white/80"
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Banner;