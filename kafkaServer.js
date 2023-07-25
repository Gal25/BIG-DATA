const { json } = require("body-parser");

// const redis = require('redis');
var starData;

async function checkNextStarName(name, index, redisClient) {
  if (index > 9110) {
    console.log('Star not found');
    return;
  }
  const starKeystr = 'harvard_ref_#:' + index;
  try {
    const data = await redisClient.get(starKeystr);
    starData = JSON.parse(data);
    if (starData && index+'' === name+'') {
      // console.log(starData);
      return starData;
    } else {
      return checkNextStarName(name, index + 1, redisClient);
    }
  } catch (error) {
    console.error('Error retrieving star data:', error);
  }
}


//////////////////////////////////////////

async function checkNextStar(ra, dec, index,redisClient){
  if (index > 9110) {
    console.log('Star not found-ra,dec');
    return;
  }
  const starKeystr = 'harvard_ref_#:' + index;
  try {
    const data = await redisClient.get(starKeystr);
    starData = JSON.parse(data);
    if (starData && starData.RA === ra && starData.DEC === dec) {
      // console.log(starData);
      return starData;
    } else {
      return checkNextStar(ra, dec, index + 1, redisClient);
    }
  } catch (error) {
    console.error('Error retrieving star data:', error);
  }
};



async function findStarByRADec(ra, dec, redisClient){
  const star = await checkNextStar(ra, dec, 1, redisClient);
  return star
};


///////////////////////////////////////
async function findStarByNAME(name, redisClient){
  const star = await checkNextStarName(name, 1, redisClient);
  // console.log("star_redis: ",star)
  return star;
};


module.exports.findStarByNAME = findStarByNAME
module.exports.findStarByRADec = findStarByRADec

  // Create a Redis client
  // const redisClient = redis.createClient({
  //   url: 'redis://localhost:6379',
  // });
  
  // redisClient.connect();
  // console.log('Connected to Redis');
  
    // // Call the function after the connection is established
    // const raToSearch = "00:05:42.00";
    // const decToSearch = "+13:23:46.00";
    // const name = "G1IV";
    
  
    // findStarByNAME(name);
    // findStarByRADec(raToSearch, decToSearch);
