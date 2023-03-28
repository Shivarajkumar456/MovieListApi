import React from 'react';

import classes from './Movie.module.css';

const Movie = (props) => {
  const deleteBtn = ()=>{
    console.log(props.releaseDate)
    props.onDelete(props.releaseDate)
  }
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={deleteBtn}>Delete</button>
    </li>
  );
};

export default Movie;
