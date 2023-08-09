const sendMessageToFastAPI = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: null })
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        console.error('Failed to send message to FastAPI:', response.status);
      }
    } catch (error) {
      console.error('Error sending message to FastAPI:', error);
    }
  };
  
  const sendMessageToFastAPIImage = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sun2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: null })
      });
  
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        console.error('Failed to send message to FastAPI:', response.status);
      }
    } catch (error) {
      console.error('Error sending message to FastAPI:', error);
    }
  };
  
  const sendMessageToFastAPIGraph = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sun3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: null })
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        console.error('Failed to send message to FastAPI:', response.status);
      }
    } catch (error) {
      console.error('Error sending message to FastAPI:', error);
    }
  };

  const sendMessageToFastAPIRiseAndSet = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sun4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: null })
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        console.error('Failed to send message to FastAPI:', response.status);
      }
    } catch (error) {
      console.error('Error sending message to FastAPI:', error);
    }
  };

  const sendMessageToFastAPIsunData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sun5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },  
        body: JSON.stringify({ message: null })
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        console.error('Failed to send message to FastAPI:', response.status);
      }
    } catch (error) {
      console.error('Error sending message to FastAPI:', error);
    }
  };

  module.exports.sendMessageToFastAPI = sendMessageToFastAPI;
  module.exports.sendMessageToFastAPIImage = sendMessageToFastAPIImage;
  module.exports.sendMessageToFastAPIGraph = sendMessageToFastAPIGraph;
  module.exports.sendMessageToFastAPIRiseAndSet = sendMessageToFastAPIRiseAndSet;
  module.exports.sendMessageToFastAPIsunData = sendMessageToFastAPIsunData;