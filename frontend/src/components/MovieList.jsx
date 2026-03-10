import { useState } from "react";
import { Link } from "react-router-dom";

function MovieList({ movies = [] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");

  let filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "az") {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      <h2 className="text-3xl font-bold mb-6 text-red-500">Tất cả</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Tìm tên phim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-3 rounded-xl text-black w-full md:w-80 shadow-lg focus:ring-2 focus:ring-red-500"
        />
  
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-5 py-3 rounded-xl text-black shadow-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {filteredMovies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id}>
            <div className="bg-gray-800 p-3 rounded-lg hover:scale-105 transition shadow-md hover:shadow-red-500/40">
              <img
                src={`${import.meta.env.VITE_IMG_URL}${movie.poster_path}`}
                className="rounded mb-2"
              />
              <h3 className="text-sm font-semibold text-center">
                {movie.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
