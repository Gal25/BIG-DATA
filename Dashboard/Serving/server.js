const express = require('express'); // Importing Express framework for building the web application
const socketIO = require('socket.io'); // Importing Socket.IO for real-time communication
const neo = require('../Speed/neo.js'); 
const app = express(); // Creating an instance of the Express app
const server = require('http').createServer(app); // Creating an HTTP server using Express
const io = socketIO(server); // Creating a Socket.IO server instance to handle real-time communication
const port = 3000; // Defining the port number on which the server will listen
const redis_r = require('redis'); 
const redisClient = redis_r.createClient({ 
  url: 'redis://localhost:6379', // Configuring the URL and port for connecting to Redis
});
redisClient.connect();
console.log('Connected to Redis');
const redis = require('../../elastic_kafka/Batch/serverRedis.js'); 

// list of all the events
const last_events = []; 
// last event
var last = null;

// Variables for the distribution of types of events in the last week
var event1 = 0;
var event2 = 0;
var event3 = 0;
var event4 = 0;
var event5 = 0; 

// Variables for the distribution graph of asteroids that passed near the Earth in the last month
var range1 = 0;
var range2 = 0;
var range3 = 0;
var range4 = 0;

// Serves static files from the 'public' directory in the application.
app.use(express.static('public'))

// Sets the view engine to 'ejs' for rendering dynamic templates using EJS 
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  const message = 'Hello from JavaScript server!';
  // ---to get the sun table---
  ans_str = await sendMessageToFastAPI(message);
  list_data = JSON.parse(ans_str);
  ans = list_data.map(item => [...item]);
  // ---to get the sun table---
  try {
    // --to get the neo table--
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
    // --to get the neo table--

    // --for the data from the simulator--
    if (last  == null) {
      formattedEvent = [];
    } else {
      formattedEvent = last;
    }
    var temp = last_events;
    // --for the data from the simulator--

    // Rendering the "dashboard.ejs" template with data for dynamic rendering.
    res.render("pages/dashboard", { ans, formattedData: startData, eventData: formattedEvent, all_events: temp });
  } catch (error) {
    console.error('Error retrieving formatted data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/graphs', async (req, res) => {
  try {
    const message = 'Hello from JavaScript server!';
    // to get the sun image
    var imgSrc = await sendMessageToFastAPIImage(message);
    // to get the rise, transit and set
    var sunData = await sendMessageToFastAPIGraph(message);
    var sunJson = JSON.parse(sunData);
    imgSrc = imgSrc.replace(/"/g, '');
    // Rendering the "analyze.ejs" template with data for dynamic rendering.
    res.render('pages/analyze', { img: imgSrc , sun: sunJson });
  } catch (error) {
    console.error('Error retrieving event data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// to create a real-time communication
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

    // merge all the data of the star
    var result = {
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

      last_events.push(formattedAllEvent);
      last = formattedEvent;
      io.emit('events', formattedEvent);
      io.emit('all_event', all_events);

      const currentDate = new Date(); // Get current date

      all_events.forEach(result => {
        const eventDate = new Date(result[0]); // Convert event timestamp to Date object

        // Calculate the difference in milliseconds between the current date and the event date
        const timeDifference = currentDate.getTime() - eventDate.getTime();
        
        // Check if no more than a week has passed since the event date (7 days = 7 * 24 * 60 * 60 * 1000 milliseconds)
        if (timeDifference <= 7 * 24 * 60 * 60 * 1000) {
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
      io.emit('eventGraph', eventGraph);
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
      const formattedItem = [
        item.id,
        item.name,
        item.estimated_diameter.meters.estimated_diameter_min,
        item.estimated_diameter.meters.estimated_diameter_max,
        item.close_approach_data[0].close_approach_date_full,
        item.close_approach_data[0].orbiting_body
      ];
      const timeDifference = currentDate.getTime() - eventDate.getTime();

      // Check if no more than a week has passed since the event date (1 mount = 7 * 24 * 60 * 60 * 1000 *4 milliseconds)
      if (timeDifference <= 7 * 24 * 60 * 60 * 1000 *4) {
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
    var eventGraph2 = [
      { eventType: 'Distance < 200', count: range1 },
      { eventType: 'Distance < 400', count: range2 },
      { eventType: 'Distance < 600', count: range3 },
      { eventType: 'Distance > 600', count: range4 },
    ];
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

const sendMessageToFastAPIGraph = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/sun3', {
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

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function getStar(ra, dec) {
  const star = await redis.findStarByRADec(ra, dec, redisClient)
  return star;
}
