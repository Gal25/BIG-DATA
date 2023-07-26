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
      return starData;
    } else {
      return checkNextStarName(name, index + 1, redisClient);
    }
  } catch (error) {
    console.error('Error retrieving star data:', error);
  }
}

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

async function findStarByNAME(name, redisClient){
  const star = await checkNextStarName(name, 1, redisClient);
  return star;
};


module.exports.findStarByNAME = findStarByNAME
module.exports.findStarByRADec = findStarByRADec

