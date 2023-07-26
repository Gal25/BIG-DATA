import requests
from bs4 import BeautifulSoup
import json


def create_table() -> list:
    # The URL of the webpage containing the table we want to extract
    URL = "https://theskylive.com/sun-info"

    # Sending an HTTP GET request to the URL and getting the response
    response = requests.get(URL)
    
    # Extracting the HTML content from the response
    html_content = response.text
    
    # Parsing the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Finding all the table elements in the parsed HTML content
    tables = soup.find_all('table')

    if len(tables) >= 3:
        # Selecting the third table (index 2) from the list of tables
        second_table = tables[2]
        table_data = []

        # Finding all the table rows (<tr>) within the selected table
        rows = second_table.find_all('tr')
        for row in rows:
            # Finding all the table cells (<td>) within the row
            columns = row.find_all('td')

            # Extracting the text from each cell and removing leading/trailing whitespaces
            row_data = [column.text.strip() for column in columns]
            
            # Adding the list of cell data for each row to the table_data list
            table_data.append(row_data)

        return table_data
    else:
        # If there are less than three tables on the page, print a message and return None
        print("There are less than two tables on the page.")
        return None


def rise_set():
    # The URL of the webpage containing the sun rise/set information
    URL = "https://theskylive.com/sun-info"
    
    # Sending an HTTP GET request to the URL and getting the response
    response = requests.get(URL)
    
    # Extracting the HTML content from the response
    html_content = response.text
    
    # Parsing the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Finding the div elements for rise, transit, and set using their respective classes
    # 'rise', 'transit', and 'set'
    rise = soup.find('div', {'class': 'rise'})
    transit = soup.find('div', {'class': 'transit'})
    set = soup.find('div',{'class': 'set'})

    # Extracting the relevant data from each div and storing it in separate dictionaries
    rise_data = {
        "azimuth": rise.find('azimuth').text,
        "label": rise.find('label').text,
        "time": rise.find('time').text,
    }

    transit_data = {
        "altitude" : transit.find('altitude').text,
        "label": transit.find('label').text,
        "time": transit.find('time').text,
    }

    set_data = {
        "azimuth": set.find('azimuth').text,
        "label": set.find('label').text,
        "time": set.find('time').text,
    }

    # Creating a dictionary to hold all the sun data, including rise, transit, and set
    sun_data = {
        "rise": rise_data,
        "transit": transit_data,
        "set": set_data,
    }

    # Converting the dictionary to JSON format
    json_data = json.dumps(sun_data)

    # Returning the JSON data containing sun rise, transit, and set information
    return json_data


def bringImage() -> bytes:
    # The URL of the webpage containing the sun image
    URL = "https://theskylive.com/sun-info"
    
    # Sending an HTTP GET request to the URL and getting the response
    response = requests.get(URL)
    
    # Extracting the HTML content from the response
    html_content = response.text
    
    # Parsing the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Finding the 'img' tag within the 'div' with class 'sun_container'
    img_tag = soup.select_one('div.sun_container img')
    
    # Extracting the 'src' attribute of the 'img' tag to get the relative image URL
    relative_image_url = img_tag['src']
    
    # Adding the prefix to the relative image URL to get the complete image URL
    prefix = 'https://theskylive.com'
    image_url = prefix + relative_image_url
    
    # Returning the complete image URL
    return image_url

