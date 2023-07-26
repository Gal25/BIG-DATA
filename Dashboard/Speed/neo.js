const io = require('socket.io-client');
const socket = io('http://localhost:3000');

var apiKey = 'ZPxjwXSnGvmoYDJYQAQZT0gg4bfV4dgI34sBd1Bg';
var currentDate = new Date();
var endDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
var startDate = new Date();

var formattedEndDate = formatDate(endDate);
var formattedStartDate = formatDate(startDate);

var url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + formattedStartDate + '&end_date=' + formattedEndDate + '&api_key=' + apiKey;
const interval = 6000;

setInterval(async () => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      var asteroids = data.near_earth_objects;
      var filteredAsteroids = filterAsteroids(asteroids);
      var jsonData = JSON.stringify(filteredAsteroids);
      socket.emit('neo', jsonData);
    })
    .catch(error => {
      console.log('Error occurred while making the request:', error);
    });
},interval);

function filterAsteroids(asteroids) {
  var filteredAsteroids = [];
  asteroidsToday = asteroids[formattedStartDate]
  asteroidsTomorrow = asteroids[formattedEndDate]
  var combinedAsteroids = asteroidsToday.concat(asteroidsTomorrow);
  for (var i = 0; i < combinedAsteroids.length; i++) {
      filteredAsteroids.push(combinedAsteroids[i]);
  }
  return filteredAsteroids;
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

async function getData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        var asteroids = data.near_earth_objects;
        var filteredAsteroids = filterAsteroids(asteroids);
        var jsonData = JSON.stringify(filteredAsteroids);
        socket.emit('neo', jsonData);
        resolve(jsonData);
      })
      .catch(error => {
        console.log('Error occurred while making the request:', error);
        reject(error);
      });
  });
}

module.exports.getData = getData;
