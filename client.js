const { Client } = require('@elastic/elasticsearch');

const client = new Client({ 
  node: 'http://localhost:9200',
  log: 'trace'
});

const searchDocuments = async function(query) {
  const { body } = await client.search({
    index: 'my_index',
    body: {
      query: {
        match: {
          content: query
        }
      }
    }
  });

  const hits = body && body.hits ? body.hits.hits : []; // Check if body and body.hits are defined

  return hits;
};

searchDocuments('my_index')
  .then(results => console.log(results))
  .catch(error => console.error(error));
