const express = require('express'); // Importing the Express framework
const elastic = require('../Batch/elasticSearch.js');
const app = express(); // Creating an Express app instance
const server = require('http').createServer(app); // Creating an HTTP server
const port = 5000; // Setting the server port
const redis_r = require('redis'); // Importing the Redis library
const redisClient = redis_r.createClient({ url: 'redis://localhost:6379' }); // Creating a Redis client instance
redisClient.connect(); 
console.log('Connected to Redis'); 
const redis = require('../Batch/serverRedis.js'); // Importing 'serverRedis.js' module

app.use(express.static('public')); // Serving static files from 'public' directory

app.set('view engine', 'ejs'); // Setting 'ejs' as the view engine for dynamic templates

app.get('/search', async (req, res) => {
  res.render("pages/search")
})

app.get('/search_by_name', async (req, res) => {
  const object_name = req.query.name;
  const start_date = req.query.start;
  const end_date = req.query.end;
  try {
    const { RA, DEC } = await getRA_DEC(object_name);
    searchResults = await elastic.quary_by_name(RA, DEC, start_date, end_date);
    const startData = [];
    searchResults.forEach(result => {
      const source = result._source;
      const formattedItem = [
        source.timestamp,
        source.telescope,
        source.RA,
        source.DEC,
        source.eventType,
        source.urgencyLevel
      ];
      startData.push(formattedItem);
    });
    res.render('pages/table_search', { startData })
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/search_by_type', async (req, res) => {
  type_event = req.query.type
  start_date = req.query.start
  end_date = req.query.end
  searchResults = await elastic.quary_by_type(type_event, start_date, end_date);
  const startData = [];
  searchResults.forEach(result => {
    const source = result._source;
    const formattedItem = [
      source.timestamp,
      source.telescope,
      source.RA,
      source.DEC,
      source.eventType,
      source.urgencyLevel
    ];
    startData.push(formattedItem);
  });
  res.render('pages/table_search', { startData })
});

app.get('/search_by_telescope', async (req, res) => {
  telescope = req.query.telescope
  start_date = req.query.start
  end_date = req.query.end
  searchResults = await  elastic.quary_by_telescope(telescope, start_date, end_date);
  const startData = [];
  searchResults.forEach(result => {
    const source = result._source;
    const formattedItem = [
      source.timestamp,
      source.telescope,
      source.RA,
      source.DEC,
      source.eventType,
      source.urgencyLevel
    ];
    startData.push(formattedItem);
  });
  res.render('pages/table_search', { startData })
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function getRA_DEC(name) {
  const star = await redis.findStarByNAME(name, redisClient)
  RA = star.RA
  DEC = star.DEC
  return { RA, DEC };
}

