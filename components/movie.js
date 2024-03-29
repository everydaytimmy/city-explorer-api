'use strict'

require('dotenv').config();

const superagent = require('superagent');

const inMemoryDB = {};

async function getMovieHandler(request, response) {
  const title = request.query.searchQuery;

  try {

    const dataAlreadyFetched = inMemoryDB[title] !== undefined;
    console.log('data already fetched', dataAlreadyFetched)
    if (dataAlreadyFetched && (Date.now() - inMemoryDB[title].timestamp < 10000)) {
      const movie = inMemoryDB[title];
      console.log('from memory');
      response.status(200).send(movie);
    } else {

    const key = process.env.MOVIE_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${key}`;
    const movieResponse = await superagent.get(url);
    const movieObject = JSON.parse(movieResponse.text);
    const movieArray = movieObject.results;
    const movie = movieArray.map(movie => new Movies(movie));
    inMemoryDB[title] = movie;
    inMemoryDB[title].timestamp = Date.now()
    response.send(movie);
    }
  }
  catch (error) {
    response.status(500).send("There is an error");
  }
}

class Movies {
  constructor(movie) {
    this.title = movie.title,
    this.overview = movie.overview
    this.popularity = movie.popularity
  }
}

module.exports = getMovieHandler;