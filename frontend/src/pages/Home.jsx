import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import MovieList from "../components/MovieList";
import { getPopularMovies } from "../services/movies";

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getPopularMovies();
      setMovies(data);
    };

    fetchMovies();
  }, []);

  return (
    <>
      <Banner />
      <MovieList movies={movies} />
    </>
  );
}

export default Home;
