'use strict';
// Load Environment Variables from .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT
const superagent = require('superagent');

app.use(cors());

async function getWeatherHandler(request, response) {

  const lat = request.query.lat;
  const lon = request.query.lon;

  const key = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;
  const weatherResponse = await superagent.get(url);
  const weatherObject = JSON.parse(weatherResponse.text)
  const weatherArray = weatherObject.data;
  const forecasts = weatherArray.map(day => new Forecast(day));

  response.send(forecasts)
}

class Forecast {
  constructor(day) {
    this.forecast = day.weather.description,
      this.time = day.datetime;
  }
}

app.get('/weather', getWeatherHandler);

app.listen(PORT, () => console.log(`listening on ${PORT}`));



