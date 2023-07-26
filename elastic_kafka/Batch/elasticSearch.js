const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

async function createIndex(indexName) {
  try {
    const response = await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              location: {
                type: 'object',
                enabled: false, // Disable dynamic mapping for the location field
              },
            },
          },
        },
      });

    console.log(`Index "${indexName}" created`);
  } catch (error) {
    console.error(`Error creating index "${indexName}":`, error);
  }
}

async function addDocument(indexName, document) {
  try {

    time = document.timestamp;
    tel = document.telescope;
    locationData = {  RA: document.location.RA, DEC: document.location.DEC};
    console.log(locationData);
    val = {
        timestamp : time,
        telescope :tel,
        RA : document.location.RA,
        DEC: document.location.DEC,
        eventType: document.eventType,
        urgencyLevel: document.urgencyLevel
    };

    const response = await client.index({
      index: indexName,
      body: val
    });
    console.log(val)
    console.log(`Document added to index "${indexName}"`);
  } catch (error) {
    console.error(`Error adding document to index "${indexName}":`, error);
  }
}

async function search(indexName, query) {
  try {
    const response = await client.search({
      index: indexName,
      body: { query },
    });
    
    const searchResults = response.hits.hits;
    return searchResults;
  } catch (error) {
    console.error(`Error searching in index "${indexName}":`, error);
  }
}

async function deleteIndex(indexName) {
  try {
    const response = await client.indices.delete({ index: indexName });
    console.log(`Index "${indexName}" deleted`);
  } catch (error) {
    console.error(`Error deleting index "${indexName}":`, error);
  }
}

async function deleteDocument(indexName, documentId) {
  try {
    const response = await client.delete({
      index: indexName,
      id: documentId,
    });
    console.log(`Document "${documentId}" deleted from index "${indexName}"`);
  } catch (error) {
    console.error(`Error deleting document "${documentId}" from index "${indexName}":`, error);
  }
}

async function quary_by_name(RA, DEC, start_date, end_date){
  const query = {
    bool: {
      must: [
        {
          term: {
            "RA.keyword": RA
          }
        },
        {
          term: {
            "DEC.keyword": DEC
          }
        },
        {
          range: {
            "timestamp.keyword": {
              "gte": start_date,
              "lte": end_date,
            }
          }
        }
      ]
    }
  };
  
  result= await search('my_index3', query);
  return result;
}

async function quary_by_type(type,start_date,end_date){
  const query = {
    bool: {
      must: [
        {
          term: {
            "eventType.keyword": type
          }
        },
        {
          range: {
            "timestamp.keyword": {
              "gte": start_date,
              "lte": end_date,
            }
          }
        }
      ]
    }
  }

  result= await search('my_index3', query);
  return result;
}

async function quary_by_telescope(telescope,start_date,end_date){
  const query = {
    bool: {
      must: [
        {
          term: {
            "telescope.keyword": telescope
          }
        },
        {
          range: {
            "timestamp.keyword": {
              "gte": start_date,
              "lte": end_date,
            }
          }
        }
      ]
    }
  };
  result= await search('my_index3', query);
  return result;
}

module.exports.addDocument = addDocument;
module.exports.quary_by_name = quary_by_name;
module.exports.quary_by_type = quary_by_type;
module.exports.quary_by_telescope = quary_by_telescope;

