// Import required modules
const fs = require('fs');
const moment = require('moment');

// Function to generate a random value for RA between 0 and 24 hours
function generateRandomRA() {
    return Math.random() * 24;
  }
  
  // Function to generate a random value for Dec between -90 and 90 degrees
  function generateRandomDec() {
    return Math.random() * 180 - 90;
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
function createMessage() {
  const timestamp = moment().utc().format('YYYY-MM-DD HH:mm:ss');

  const message = {
    timestamp: timestamp,
    telescope: telescopes[Math.floor(Math.random() * telescopes.length)],
    location: {
        RA: generateRandomRA(),
        DEC: generateRandomDec(),
    },
    eventType: eventType[Math.floor(Math.random() * eventType.length)],
    urgencyLevel: Math.floor(Math.random() * 5)
  };

  return message;
}

// Generate 5 events per minute indefinitely
function generateEvents() {
    const interval = 60 * 1000 / 5; // Interval between each event in milliseconds
  
    setInterval(() => {
      for (let i = 0; i < 5; i++) {
        const eventMessage = createMessage();
        console.log(eventMessage);
      }
    }, interval);
  }
  
  // Start generating events
  generateEvents();