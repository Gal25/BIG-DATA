const express = require('express'); // Importing the Express framework
const app = express(); // Creating an Express app instance
const server = require('http').createServer(app); // Creating an HTTP server
const port = 5000; // Setting the server port
const producer = require('../Speed/producer_cloud.js')
const consumer = require('../Speed/consumer_cloud.js')

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



