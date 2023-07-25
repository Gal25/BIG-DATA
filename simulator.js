// Import required modules
const fs = require('fs');
const moment = require('moment');
const redis = require('redis');


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// List of telescopes
const telescopes = [
  'MMT',
  'Gemini Observatory Telescopes',
  'Very Large Telescope',
  'Subaru Telescope',
  'Large Binocular Telescope',
  'Southern African Large Telescope',
  'Keck 1 and 2',
  'Hobby-Eberly Telescope',
  'Gran Telescopio Canarias',
  'The Giant Magellan Telescope',
  'Thirty Meter Telescope',
  'European Extremely Large Telescope'
];

const eventType = [
    'GRB',
    'Apparent Brightness Rise',
    'UV Rise',
    'X-Ray Rise',
    'Comet',
  ];



// Function to create a new message
async function createMessage() {
  
  const runResult = await run();
  const timestamp = moment().utc().format('YYYY-MM-DD HH:mm:ss');

  const message = {
    timestamp: timestamp,
    telescope: telescopes[Math.floor(Math.random() * telescopes.length)],
    location: {
      RA: runResult.RA,
      DEC: runResult.DEC
    },
    eventType: eventType[Math.floor(Math.random() * eventType.length)],
    urgencyLevel: Math.floor(Math.random() * 5)+1
  };
  return message;
}
module.exports = { createMessage }
// // Generate 5 events per minute indefinitely
// function generateEvents() {
//     return new Promise((resolve, reject) => {
//       const interval = 60 * 1000 / 5; // Interval between each event in milliseconds
//       let counter = 0;
  
//       const intervalId = setInterval(() => {

//           const eventMessage = createMessage();
//           sleep(700)
//             .then(() => {
//               console.log(eventMessage);
//               counter++;
//               getMessage(eventMessage);
//             })
//             .catch(reject);
  
//       }, interval);
//     });
    
//   }


async function run() {
  const client = redis.createClient({
    url: 'redis://localhost:6379',
  });

  await client.connect();

  const starKey = 'harvard_ref_#:'+ Math.floor(Math.random() * 9110); // Replace with the appropriate key

  const data = await client.get(starKey);
  const starData = JSON.parse(data);
  const { RA, DEC } = starData;
  await client.quit(); // Close the Redis client connection
  return { RA ,DEC };
}


  

// generateEvents();
