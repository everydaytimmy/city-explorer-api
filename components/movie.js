'use strict'

require('dotenv').config();

const superagent = require('superagent');

async function getMovieHandler(request, response) {
  const key = process.env.MOVIE_KEY;
  const title = request.query.searchQuery;
  console.log(key);
  console.log(title);
  const url = `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${key}`;
  const movieResponse = await superagent.get(url);
  const movieObject = JSON.parse(movieResponse.text);
  const movieArray = movieObject.results;

  const movie = movieArray.map(movie => new Movies (movie));

  response.send(movie);
}

class Movies {
  constructor(movie) {
    this.title = movie.title,
    this.overview= movie.overview
    this.popularity= movie.popularity
  }
}

module.exports = getMovieHandler;