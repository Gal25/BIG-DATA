const { name } = require('ejs');
const express = require('express');
const socketIO = require('socket.io');
const elastic = require('./elasticSearch.js');
const { type } = require('os');
const neo = require('./neo.js');
const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);
const port = 3000;
const last_event = []
var last = null
const redis_r = require('redis');
const redisClient = redis_r.createClient({
  url: 'redis://localhost:6379',
});
redisClient.connect();
console.log('Connected to Redis');
const redis = require('./serverRedis.js')
var result = {};

var event1 = 0;
var event2 = 0;
var event3 = 0;
var event4 = 0;
var event5 = 0; 

var range1 = 0;
var range2 = 0;
var range3 = 0;
var range4 = 0;



app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  const message = 'Hello from JavaScript server!';
  ans_str = await sendMessageToFastAPI(message);
  // const tableData = await ans_str.tableData;
  // const imageUrl = await ans_str.imageUrl;

  list_data = JSON.parse(ans_str);
  ans = list_data.map(item => [...item]);
  try {
    const data = await neo.getData();
    const jsonData = JSON.parse(data);
    const startData = [];
    for (const item of jsonData) {
      const formattedItem = [
        item.id,
        item.name,
        item.estimated_diameter.meters.estimated_diameter_min,
        item.estimated_diameter.meters.estimated_diameter_max,
        item.close_approach_data[0].close_approach_date_full,
        item.close_approach_data[0].orbiting_body
      ];
      startData.push(formattedItem);
    }
    if (last  == null) {
      formattedEvent = [];
    } else {
      formattedEvent = last;
    }
    var temp = last_event;

    res.render("pages/dashboard", { ans, formattedData: startData, eventData: formattedEvent, all_events: temp });
  } catch (error) {
    console.error('Error retrieving formatted data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/search', async (req, res) => {
  res.render("partials/search")
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
    res.render('partials/table_search', { startData })
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
  res.render('partials/table_search', { startData })
});

app.get('/graphs', async (req, res) => {
  try {
    const message = 'Hello from JavaScript server!';
    img = await sendMessageToFastAPIImage(message);

    const eventGraph = [
      { eventType: 'Event 1', count: event1 },
      { eventType: 'Event 2', count: event2 },
      { eventType: 'Event 3', count: event3 },
      { eventType: 'Event 4', count: event4 },
      { eventType: 'Event 5', count: event5 },
    ];
    const eventGraph2 = [
      { eventType: 'range 1', count: range1 },
      { eventType: 'range 2', count: range2 },
      { eventType: 'range 3', count: range3 },
      { eventType: 'range 4', count: range4 },
    ];
    console.log(img)
    res.render('partials/table_graphs', { eventGraph, eventGraph2 ,img: img});
  } catch (error) {
    console.error('Error retrieving event data:', error);
    res.status(500).send('Internal Server Error');
  }
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
  res.render('partials/table_search', { startData })
});


io.on('connection', socket => {

  console.log('A client connected');


  socket.on('simulator', async data => {
    try {
      var parsedData = JSON.parse(data);
      const star = await getStar(parsedData.location.RA, parsedData.location.DEC);

      const { MAG, 'Title HD': titleHD } = star;

      // Create a new object that contains only the desired properties
      const starObject = {
        MAG: MAG,
        'Title HD': titleHD
      };
      result = {
        data: parsedData,
        star: starObject
      };

      const formattedEvent = {
        'Timestamp': result.data.timestamp,
        'Telescope': result.data.telescope,
        'RA': result.data.location.RA,
        'DEC': result.data.location.DEC,
        'EventType': result.data.eventType,
        'UrgencyLevel': result.data.urgencyLevel,
        'MAG': result.star.MAG,
        'Title': result.star['Title HD']
      };


      const all_events = []
      const formattedAllEvent = [
        parsedData.timestamp,
        parsedData.telescope,
        parsedData.location.RA,
        parsedData.location.DEC,
        parsedData.eventType,
        parsedData.urgencyLevel,
      ];



      all_events.push(formattedAllEvent);

      last_event.push(formattedAllEvent);
      last = formattedEvent;
      io.emit('events', formattedEvent);
      io.emit('all_event', all_events);
      const currentDate = new Date(); // Get current date

      all_events.forEach(result => {
        const source = result._source;
        const eventDate = new Date(result[0]); // Convert event timestamp to Date object
        // console.log(result[0]);
        // Calculate the difference in milliseconds between the current date and the event date
        const timeDifference = currentDate.getTime() - eventDate.getTime();
        
        // Check if no more than a week has passed since the event date (7 days = 7 * 24 * 60 * 60 * 1000 milliseconds)
        if (timeDifference <= 7 * 24 * 60 * 60 * 1000) {
          // console.log("hello timme")
          // console.log(formattedEvent['UrgencyLevel']);
          if( formattedEvent['UrgencyLevel'] == 1){
            event1+=1;
          }
          if( formattedEvent['UrgencyLevel'] == 2){
            event2+=1;
          }
          if( formattedEvent['UrgencyLevel'] == 3){
            event3+=1;
          }
          if( formattedEvent['UrgencyLevel'] == 4){
            event4+=1;
          }
          if( formattedEvent['UrgencyLevel'] == 5){
            
            event5+=1;
          } 
        }
      });
      const eventGraph = [
        { eventType: 'Urgency Level 1', count: event1 },
        { eventType: 'Urgency Level 2', count: event2 },
        { eventType: 'Urgency Level 3', count: event3 },
        { eventType: 'Urgency Level 4', count: event4 },
        { eventType: 'Urgency Level 5', count: event5 },
      ];
      // console.log(eventGraph);
      io.emit('eventGraph', eventGraph);
      // renderTableGraphs();

      

    } catch (error) {
      console.error(error);
    }
  });

  socket.on('neo', data => {
    const formattedData = [];
    const jsonData = JSON.parse(data);
    // Get the current date to compare with the event dates
    const currentDate = new Date();
    var endDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    var startDate = new Date();


    // Define the date for one month ago from the current date
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    for (const item of jsonData) {
      const eventDate = new Date(item.close_approach_data[0].close_approach_date_full);
    
      // console.log(currentDate);
    
     
      const formattedItem = [
        item.id,
        item.name,
        item.estimated_diameter.meters.estimated_diameter_min,
        item.estimated_diameter.meters.estimated_diameter_max,
        item.close_approach_data[0].close_approach_date_full,
        item.close_approach_data[0].orbiting_body
      ];

      const timeDifference = currentDate.getTime() - eventDate.getTime();
      // console.log(timeDifference)
      // Check if no more than a week has passed since the event date (7 days = 7 * 24 * 60 * 60 * 1000 milliseconds)
      if (timeDifference <= 7 * 24 * 60 * 60 * 1000 *4) {
          // console.log("hii neo");
          if(item.estimated_diameter.meters.estimated_diameter_min < 200 ){
            range1+=1;
          }
          else if(item.estimated_diameter.meters.estimated_diameter_min < 400){
            range2+=1;
          }
          else if(item.estimated_diameter.meters.estimated_diameter_min < 600){
            range3+=1;
          }
          else{
          range4+=1;
          }
        }
        var closeApproachDateTime = new Date(item.close_approach_data[0].close_approach_date_full);
        if (closeApproachDateTime <= endDate && closeApproachDateTime>= startDate) {

          formattedData.push(formattedItem);
        }
    }
    const eventGraph2 = [
      { eventType: 'Distance < 200', count: range1 },
      { eventType: 'Distance < 400', count: range2 },
      { eventType: 'Distance < 600', count: range3 },
      { eventType: 'Distance > 600', count: range4 },
    ];
    // console.log(eventGraph2);
    io.emit('formattedDataUpdate', formattedData); // Send formattedData to all connected clients
    io.emit('eventGraph2', eventGraph2);

  });


  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

const sendMessageToFastAPI = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/sun', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: null })
    });

    if (response.ok) {
      const responseData = await response.json();


      return responseData;
    } else {
      console.error('Failed to send message to FastAPI:', response.status);
    }
  } catch (error) {
    console.error('Error sending message to FastAPI:', error);
  }
};




const sendMessageToFastAPIImage = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/sun2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: null })
    });

    if (response.ok) {
      const responseData = await response.json();


      return responseData;
    } else {
      console.error('Failed to send message to FastAPI:', response.status);
    }
  } catch (error) {
    console.error('Error sending message to FastAPI:', error);
  }
};


// Start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function getRA_DEC(name) {
  const star = await redis.findStarByNAME(name, redisClient)
  RA = star.RA
  DEC = star.DEC
  return { RA, DEC };
}


async function getStar(ra, dec) {
  const star = await redis.findStarByRADec(ra, dec, redisClient)
  return star;
}
