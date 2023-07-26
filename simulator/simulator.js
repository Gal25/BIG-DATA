const moment = require('moment');
const redis = require('redis');

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
    urgencyLevel: Math.floor(Math.random() * 5) + 1
  };
  return message;
}

async function run() {
  const client = redis.createClient({
    url: 'redis://localhost:6379',
  });

  await client.connect();

  const starKey = 'harvard_ref_#:'+ Math.floor(Math.random() * 9110); // Replace with the appropriate key

  while(1){
    try {
      const data = await client.get(starKey);
      const starData = JSON.parse(data);
      const { RA, DEC } = starData;
      await client.quit(); 
      return { RA ,DEC };
    } catch (error) {
      
    }
  }
}

module.exports = { createMessage }

