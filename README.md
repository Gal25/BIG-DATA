# Astronomical events & alerts #

# **goal**
In this project, we designed a BigData processing system fed by relays that warn of astronomical events.
The system displays the events in real time or at a daily update level, stores and enables analysis and search.

# **Creating astronomical events in the simulator**
The system displays every astronomical event (contains date and time, telescope, location in RA and DEC units, type of event, level of urgency).
Astronomical events are created in a simulator that uses information from a **catalog of bright star**  objects (Bright Star Catalogue).
The catalog is stored locally in Redis and we use it to create events.

# **Saving the events in the cloud**
We save the events in the Kapka cloud.
The data for the **server** or the **ELT** is pulled through Kafka.

# **Dashboard**
• The system displays a list of recent event data within the Dashboard.

• A recent event will be displayed separately with full details about the source and if the urgency level is 4 or higher it is highlighted and there are UX effects to attract the user's attention.

• The system displays the list of bodies that are supposed to pass near the Earth in the next 24 hours from (https://cneos.jpl.nasa.gov/ca/).

• The system displays the solar activity forecast for the next few hours from (https://theskylive.com/).

# **Search and locate by ELT:**
There are 3 search options
1. ll the events, in which any star is involved in a time frame.
2. All events, or events of a certain type, within a time frame.
3. All events originating from a certain observatory/telescope in a time frame.

# **Anzalia**
o Distribution of the types of events in the last week (cut by urgency 1-5)

o Graph of the distribution of asteroids that passed near KA in the last month (by size)

o Today's rise, transit and set times of The Sun

o Today Sunspots Activity image

