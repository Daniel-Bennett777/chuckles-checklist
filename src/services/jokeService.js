

export const getAllJokes = () => {
    return fetch(`http://localhost:3000/jokes`).then((res) => res.json());
  };
  
  export const postNewJoke = async (jokeText) => {
    const response = await fetch(`http://localhost:3000/jokes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: jokeText,
        told: false,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to post new joke');
    }
  
    const data = await response.json();
    return data; // This could be the new joke object returned from the server
  };

  export const updateJoke = async (joke) => {
    try {
      const response = await fetch(`http://localhost:3000/jokes/${joke.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(joke),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update joke');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error('Failed to update joke');
    }
  };
  /*The try is used for statements with possible errors to evaluate. It is followed by a catch block,  that contains statements that specify what to do if an exception is thrown in the try block. The catch block is only executed if an exception occurs in the try block. so its kind of a way to write indicators or fail safes into code. */
  
  export const getJokes = async () => {
    try {
      const response = await fetch('http://localhost:3000/jokes');
  
      if (!response.ok) {
        throw new Error('Failed to fetch jokes');
      }
  
      const jokes = await response.json();
      return jokes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const deleteJoke = async (joke) => {
    const response = await fetch(`http://localhost:3000/jokes/${joke.id}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }
/*The function getAllJokes is defined.
It uses the fetch function to make a GET request to the URL http://localhost:8088/jokes.
The fetch function returns a promise that resolves to the response from the server.
The then method is called on the response object to handle the response once it's available.
Inside the then callback, res.json() is called to parse the response body as JSON. This returns another promise.
The chained .then() is used to handle the parsed JSON data when it's available.
So, your function will return a promise that resolves with the JSON data containing all the jokes from the specified endpoint*/