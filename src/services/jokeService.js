

export const getAllFacts = () => {
  return fetch(`http://localhost:3000/facts`).then((res) => res.json());
};
  
export const postNewFact = async (factText) => {
  const response = await fetch(`http://localhost:3000/facts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: factText,
      shared: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to post new fact');
  }

  return response.json();
};

export const updateFact = async (fact) => {
  const response = await fetch(`http://localhost:3000/facts/${fact.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fact),
  });

  if (!response.ok) {
    throw new Error('Failed to update fact');
  }

  return response.json();
};

export const deleteFact = async (fact) => {
  const response = await fetch(`http://localhost:3000/facts/${fact.id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/*The function getAllJokes is defined.
It uses the fetch function to make a GET request to the URL http://localhost:8088/jokes.
The fetch function returns a promise that resolves to the response from the server.
The then method is called on the response object to handle the response once it's available.
Inside the then callback, res.json() is called to parse the response body as JSON. This returns another promise.
The chained .then() is used to handle the parsed JSON data when it's available.
So, your function will return a promise that resolves with the JSON data containing all the jokes from the specified endpoint*/