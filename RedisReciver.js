
const redis = require('redis');
const client = redis.createClient({
  url: 'redis://localhost:6379',
});

async function run() {
  
  await client.connect();

  console.log('Connected to Redis:', client.isOpen);
  const starKey = 'harvard_ref_#:1'; // Replace with the appropriate key

  // const data  =await client.get(key)
  const data = await client.get(starKey);
  const starData = JSON.parse(data);
  const { RA, DEC } = starData;
  console.log('RA:', RA);
  console.log('DEC:', DEC);
  console.log('\nStar Objects:', starData);
  await client.quit(); // Close the Redis client connection
}

run();
