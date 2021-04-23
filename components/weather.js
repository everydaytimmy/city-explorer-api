'use strict'

require('dotenv').config();

const superagent = require('superagent');

const inMemoryDB = {};

async function getWeatherHandler(request, response) {

  const lat = request.query.lat;
  const lon = request.query.lon;
  
  try {
    const dataAlreadyFetched = inMemoryDB[lat + lon] !== undefined;

    if (dataAlreadyFetched) {
      const forecasts = inMemoryDB[lat + lon];
      response.status(200).send(forecasts);
      console.log('from memory')
    } else {


    const key = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;
    const weatherResponse = await superagent.get(url);
    const weatherObject = JSON.parse(weatherResponse.text)
    const weatherArray = weatherObject.data;
    const forecasts = weatherArray.map(day => new Forecast(day));

    response.send(forecasts)
    }
  }
  catch (error) {
    response.status(500).send('There is an error');
  }
}

class Forecast {
  constructor(day) {
    this.forecast = day.weather.description,
      this.time = day.datetime;
  }
}





//   const query = {
//     q: ingredient,
//     app_id: process.env.FOOD_APP_ID,
//     app_key: process.env.FOOD_APP_KEY
//   }
// }

module.exports = getWeatherHandler;