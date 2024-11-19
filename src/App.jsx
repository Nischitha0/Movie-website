import { useReducer, useEffect } from 'react';
import axios from 'axios'
import "./app.css"

let initialState = {
  movieName: '',
  movies: [],
  loading: false,
  showSearchText: true,
};

let reducer = (state, action) => {
  switch (action.type) {
    case 'SET_MOVIE_NAME':
      return { ...state, movieName: action.payload, showSearchText: false };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SHOW_SEARCH_TEXT':
      return { ...state, showSearchText: true, movies: [], loading: false };
    default:
      return state;
  }
};

function App() {
  let [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.movieName) {
      dispatch({ type: 'SET_LOADING' });
      try {
        axios.get(`https://www.omdbapi.com/?s=${state.movieName}&apikey=a21e01e`)
          .then(response => {
            dispatch({ type: 'SET_MOVIES', payload: response.data.Search });
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, [state.movieName]);

  let handleSearch = () => {
    dispatch({ type: 'SET_MOVIE_NAME', payload: document.getElementById('movie-input').value });
  };

  return (
    <div>
      <div className='searches'>
        <input id="movie-input" type="text" placeholder="Enter movie name" />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className='moviies'>
        {state.showSearchText ? (
          <h2>Search Your Movie</h2>
        ) : (
          state.loading ? (
            <p>Loading...</p>
          ) : (
            state.movies.map((movie, index) => (
              <div key={index} className='cards'>
                <h2>{movie.Title}</h2>
                <img src={movie.Poster} alt={movie.Title} />
                <p>Year: {movie.Year}</p>
                <p>imdbID: {movie.imdbID}</p>
                <p>Type: {movie.Type}</p>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

export default App;
