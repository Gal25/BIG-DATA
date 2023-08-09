from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import scrapSun
import json

# Creating a FastAPI instance
app = FastAPI()

# Defining a Pydantic model for incoming message data
class Message(BaseModel):
    message: Optional[str] = None

# Endpoint for '/sun' to receive a message and return scraped table data
@app.post("/sun")
async def receive_message(message: Message):
    print("Received message: ", message.message)
    table_data = scrapSun.create_table()
    data = json.dumps(table_data)
    return data

# Endpoint for '/sun2' to receive a message and return scraped sun image data
@app.post("/sun2")
async def receive_message(message: Message):
    print("Received message:", message.message)
    image_data = scrapSun.bringImage()
    data = json.dumps(image_data)
    return data

# Endpoint for '/sun3' to receive a message and return scraped the sun position
@app.post("/sun3")
async def receive_message(message: Message):
    print("Received message:", message.message)
    sun_data = scrapSun.bringImage2()
    return sun_data

# Endpoint for '/sun3' to receive a message and return scraped sun data (rise, set)
@app.post("/sun4")
async def receive_message(message: Message):
    print("Received message:", message.message)
    sun_data = scrapSun.rise_set()
    return sun_data

@app.post("/sun5")
async def receive_message(message: Message):
    print("Received message:", message.message)
    sun_data = scrapSun.sunData()
    data = json.dumps(sun_data)
    return data
