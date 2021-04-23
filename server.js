'use strict';
require('dotenv').config();

// Application Dependencies
const cors = require('cors');
const { response } = require('express');
const express = require('express');

const getMovieHandler = require('./components/movie.js');
const getWeatherHandler = require('./components/weather.js');

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.get('/weather', getWeatherHandler);
app.get('/movie', getMovieHandler);

app.listen(PORT, () => console.log(`listening on ${PORT}`));





