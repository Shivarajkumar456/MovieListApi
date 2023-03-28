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
        const response = await fetch('https://react-http-83ec6-default-rtdb.firebaseio.com/movies.json');
        if (!response.ok) {
          throw new Error('Something went wrong...Retrying');
        }
        const data = await response.json();
        const loadMovies = [];
        for(const key in data){
          loadMovies.push({
            id:key,
            title:data[key].title,
            openingText: data[key].openingText,
            releaseDate:data[key].releaseDate
          });
        }
        setMovies(loadMovies);
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

  const movieHandler = async (movie) => {
    const response = await fetch('https://react-http-83ec6-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type':'Application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  const deleteHandler = async (id) => {
    try {
        const response = await fetch(`https://react-http-83ec6-default-rtdb.firebaseio.com/movies.json/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(error);
    }
};


  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDelete={deleteHandler}/>;
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



