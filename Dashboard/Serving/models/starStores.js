const elastic = require('../../../elastic_kafka/Batch/elasticSearch.js');
const redis_r = require('redis'); 
const redisClient = redis_r.createClient({ 
  url: 'redis://localhost:6379', // Configuring the URL and port for connecting to Redis
});
redisClient.connect();
console.log('Connected to Redis');
const redis = require('../../../elastic_kafka/Batch/serverRedis.js'); 

async function getStar(ra, dec) {
    const star = await redis.findStarByRADec(ra, dec, redisClient)
    return star;
  }

  async function getRA_DEC(name) {
    const star = await redis.findStarByNAME(name, redisClient)
    RA = star.RA
    DEC = star.DEC
    return { RA, DEC };
  }

  async function quary_by_name(RA, DEC, start_date, end_date){
    searchResults = await elastic.quary_by_name(RA, DEC, start_date, end_date);
    return searchResults;
  }

  async function quary_by_type(type_event, start_date, end_date){
    searchResults = await elastic.quary_by_type(type_event, start_date, end_date);
    return searchResults;
}

async function quary_by_telescope(telescope, start_date, end_date){
    searchResults = await  elastic.quary_by_telescope(telescope, start_date, end_date);
    return searchResults;
}

  module.exports.getRA_DEC = getRA_DEC;
  module.exports.getStar = getStar;
  module.exports.quary_by_name = quary_by_name;
  module.exports.quary_by_type = quary_by_type;
  module.exports.quary_by_telescope = quary_by_telescope;