const model = require('../models/sunStores.js');
const neoModel = require('../models/neoStores.js');
var last_events = []; 
var last = null;

const getMainPage = async (req, res) => {
    const message = 'Hello from JavaScript server!';
    // ---to get the sun table---
    ans_str = await model.sendMessageToFastAPI(message);
    list_data = JSON.parse(ans_str);
    ans = list_data.map(item => [...item]);
    // ---to get the sun table---
    try {
      // --to get the neo table--
      const data = await neoModel.getData();
      const jsonData = JSON.parse(data);
      const startData = [];
      for (const item of jsonData) {
        const formattedItem = [
          item.id,
          item.name,
          item.estimated_diameter.meters.estimated_diameter_min,
          item.estimated_diameter.meters.estimated_diameter_max,
          item.close_approach_data[0].close_approach_date_full,
          item.close_approach_data[0].orbiting_body
        ];
        startData.push(formattedItem);
      }
      // --to get the neo table--
  
      // --for the data from the simulator--
        if (last  == null) {
        formattedEvent = [];
        } else {
        formattedEvent = last;
        }
        var temp = last_events;
   
      // --for the data from the simulator--
  
      // Rendering the "dashboard.ejs" template with data for dynamic rendering.
      res.render("pages/dashboard", { ans, formattedData: startData, eventData: formattedEvent, all_events: temp });
    } catch (error) {
      console.error('Error retrieving formatted data:', error);
      res.status(500).send('Internal Server Error');
    }
}

function setEvents(events, event){
    last_events.push(events);
    last = event;
}

module.exports = {
    getMainPage
}

module.exports.setEvents = setEvents;