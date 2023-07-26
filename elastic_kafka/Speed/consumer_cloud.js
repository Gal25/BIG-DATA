process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";
const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const { Kafka } = require('kafkajs');
const elastic = require('../Batch/elasticSearch');
var val = "";

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['sulky.srvs.cloudkafka.com:9094'],
  ssl: true,
  sasl: {
    mechanism: 'SCRAM-SHA-512',
    username: 'azxxgsem',
    password: 'EbdE6WUk0wm21p2aY13g90FCQVFpPpJ6',
  },
});

const consumer = kafka.consumer({ groupId: 'azxxgsem-events'})

const run = async () => {
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'azxxgsem-events', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      e = {
        topic,
        partition,
        key: message.key.toString(),
        value: message.value.toString()
      }
      val = message.value.toString();
      socket.emit('simulator', val);
      await elastic.addDocument('my_index3',JSON.parse(val));
    },
  })

}

run().catch(console.error);
