 <img width="900" src="https://github.com/einav242/BIG-DATA/blob/main/images/Astronomical%20Events%20%26%20Alerts.jpg">

# **Goal**
In this project, we designed a BigData processing system fed by relays that warn of astronomical events.
The system displays the events in real time or at a daily update level, stores and enables analysis and search.

# **Creating astronomical events in the simulator**
The system displays every astronomical event (contains date and time, telescope, location in RA and DEC units, type of event, level of urgency).
Astronomical events are created in a simulator that uses information from a **catalog of bright star**  objects (Bright Star Catalogue).
The catalog is stored locally in Redis and we use it to create events.


<img width="200" src="https://github.com/einav242/BIG-DATA/blob/main/images/REDIS.jpg">


# **Saving the events in the cloud** 
We save the events in the **kafka** cloud.
The data for the **server** or the **Elasticsearch** is pulled through Kafka.

 <img width="150" src="https://github.com/einav242/BIG-DATA/blob/main/images/kafka.png">
   <img width="200" src="https://github.com/einav242/BIG-DATA/blob/main/images/Elastic.png">

# **Dashboard**
<img width="700" src="https://github.com/einav242/BIG-DATA/blob/main/images/dashborad.jpg">
<img width="700" src="https://github.com/einav242/BIG-DATA/blob/main/images/dash2.jpg">
• The system displays a list of recent event data within the Dashboard.

• A recent event will be displayed separately with full details about the source and if the urgency level is 4 or higher it is highlighted and there are UX effects to attract the user's attention.

• The system displays the list of bodies that are supposed to pass near the Earth in the next 24 hours from (https://cneos.jpl.nasa.gov/ca/).

• The system displays the solar activity forecast for the next few hours from (https://theskylive.com/).


# **Search and locate by Elasticsearch:**
<img width="700" src="https://github.com/einav242/BIG-DATA/blob/main/images/search.jpeg">

There are 3 search options
1. All the events, in which any star is involved in a time frame.
2. All events, or events of a certain type, within a time frame.
3. All events originating from a certain observatory/telescope in a time frame.

# **Analyze**
<img width="700" src="https://github.com/einav242/BIG-DATA/blob/main/images/graph1.jpeg">
<img width="700" src="https://github.com/einav242/BIG-DATA/blob/main/images/graph2.jpeg">
o Distribution of the types of events in the last week (cut by urgency 1-5)

o Graph of the distribution of asteroids that passed near Earth in the last month (by size)

o Today's rise, transit and set times of The Sun

o Today Sunspots Activity image

# Diagram showing technological mapping of the system:
<img  width="500" src="https://github.com/einav242/BIG-DATA/blob/main/images/arc.jpg">

# How to run:
o Clone the project

o run on **docker** Elasticsearch (must be  run on port 9200 and Redis on port 6379)

o Open 5 terminals

1. cd elastic_kafka\Speed and run node **producer_cloud.js**

2. cd elastic_kafka\Speed and run node **consumer_cloud.js**

3. cd Dashboard\Batch\sunServerpy

  3.1 py -m venv venv

  3.2 "./venv/scripts/activate"

  3.3 uvicorn **main:app** --reload

4. cd **Dashboard\Serving** and run npm start

5. cd **elastic_kafka\Serving** and run npm start

Finally go to **http://localhost:3000**



