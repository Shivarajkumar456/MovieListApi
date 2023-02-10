import React, { useState, useEffect, useCallback } from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMovieHandler = useCallback(async ()=> {
    
      setisLoading(true);
      setError(null);
      try {
        const response = await fetch('https://swapi.dev/api/films/');
        if (!response.ok) {
          throw new Error('Something went wrong...Retrying');
        }
        const data = await response.json();
        const transformedMovie = data.results.map((movieData) => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date,
          };
        });
        setMovies(transformedMovie);
        setRetrying(false);
      } catch (err) {
        setError(err.message);
        setRetrying(true);
      }
      setisLoading(false);
  }, []) ;

  useEffect(() => {
    fetchMovieHandler();
    if (!retrying) {
      return;
    }
    const retryInterval = setInterval(() => {
      fetchMovieHandler();
      setRetryCount(retryCount + 1);
    }, 5000);
    return () => clearInterval(retryInterval);
  }, [retrying, retryCount, fetchMovieHandler]);

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={() => setRetrying(false)}>Cancel Retrying</button>
      </React.Fragment>
    );
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  const movieHandler = (movie) => {
    console.log(movie);
  }

  return (
    <React.Fragment>
    <section>
      <AddMovie onAddMovie={movieHandler}/>
    </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;



