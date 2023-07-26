process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";
const { Kafka } = require('kafkajs');
const simulator = require('../../simulator/simulator');
const uuid = require("uuid");

// connect to the kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['sulky.srvs.cloudkafka.com:9094'],
  ssl: true,
  sasl: {
    mechanism: 'SCRAM-SHA-512',
    username: 'azxxgsem',
    password: 'EbdE6WUk0wm21p2aY13g90FCQVFpPpJ6',
  },
});

const producer = kafka.producer();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const producerMessage = async () => {
  return new Promise((resolve, reject) => {
    const interval = 60 * 1000 / 5; // Interval between each event in milliseconds
    let counter = 0;
    setInterval(async () => {
      const e = simulator.createMessage()
      const eventMessage =  Promise.resolve(e);
      try {
        await sleep(700);
        eventMessage.then((resolvedValue) => {
          console.log({key: uuid.v4(), value: JSON.stringify(resolvedValue)});
          counter++;
          topic= 'azxxgsem-events';
          producer.send({
            topic: topic,
            messages: [
              {
                key: uuid.v4(),
                value: JSON.stringify(resolvedValue)
              }
            ],
          });     
        })
      } catch (error) {
        console.log(error);
      }
    }, interval);
  });
}

async function run(){
  // Producing
  await producer.connect()
  console.log('Producer is ready.');
  producerMessage()
  

}

run().catch(console.error)