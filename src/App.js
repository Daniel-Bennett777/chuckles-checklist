import React, { useEffect, useState } from 'react';
import './App.css';
import { getAllJokes, postNewJoke, updateJoke, getJokes,deleteJoke} from './services/jokeService'; // Make sure to import postNewJoke
import stevePic from "./assets/steve.png"

const Header = () => {
  return (
    <div className="app-heading">
      <h1 className="app-heading-text">Joke Generator</h1>
    </div>
  );
};

export const App = () => {
  const [allJokes, setAllJokes] = useState([]) //allJokes stores all the jokes fetched from the server.
  const [newJokeText, setNewJokeText] = useState(""); //newJokeText stores the value of the input field for adding a new joke.
  const [untoldJokes, setUntoldJokes] = useState([]); //untoldJokes stores the filtered array of untold jokes.
  const [toldJokes, setToldJokes] = useState([]); // toldJokes stores the filtered array of told jokes.
  const [jokeAdded, setJokeAdded] = useState(false); //is a flag to trigger the useEffect when a new joke is added.

  useEffect(() => {
    getAllJokes()
      .then((data) => {
        setAllJokes(data);

        // Filter and set untold and told jokes
        const untold = data.filter((joke) => !joke.told);//separate array for untold jokes
        const told = data.filter((joke) => joke.told);//separate array 
        setUntoldJokes(untold);
        setToldJokes(told);
      })
      
  }, [jokeAdded]); 

  const handleAddJoke = () => {
    if (newJokeText.trim() !== "") {
      postNewJoke(newJokeText)
        .then((newJoke) => {
          // Add the new joke to the allJokes list
          setAllJokes([...allJokes, newJoke]);
          // Clear the input field
          setNewJokeText("");
          setJokeAdded(true);
        })
        .catch((error) => {
          console.error('Error posting joke:', error);
          // Display an error message to the user
          // Update the state to indicate the error
        });
    }
  };// By using .trim(), it will remove the whitespace characters, and if the resulting string is empty, you know that the user didn't provide any actual content.

  const handleToggleTold = async (joke) => {
    const updatedJoke = {
      ...joke,
      told: !joke.told,
    };
  
    try {
      await updateJoke(updatedJoke);
  
      // Update the joke locally instead of fetching all jokes again
      const updatedAllJokes = allJokes.map((j) => {
        if (j.id === updatedJoke.id) {
          return updatedJoke;
        }
        return j;
      });
  
      setAllJokes(updatedAllJokes);
  
      // Update the untold and told jokes lists
      const untold = updatedAllJokes.filter((joke) => !joke.told);
      const told = updatedAllJokes.filter((joke) => joke.told);
      setUntoldJokes(untold);
      setToldJokes(told);
    } catch (error) {
      console.error('Error updating joke:', error);
      // Display an error message to the user
      // Update the state to indicate the error
    }
  };
  
  const handleDeleteJoke = async (joke) => {
    try {
      await deleteJoke(joke);

      const updatedAllJokes = allJokes.filter((j) => j.id !== joke.id);
      setAllJokes(updatedAllJokes);

      const untold = updatedAllJokes.filter((joke) => !joke.told);
      const told = updatedAllJokes.filter((joke) => joke.told);
      setUntoldJokes(untold);
      setToldJokes(told);
    } catch (error) {
      console.error('Error deleting joke:', error);
    }
  };

  return (
    <>
      <div className="app-heading-circle">
        <img className="app-logo" src={stevePic} alt="Good job Steve" />
      </div>
      <div>
        <Header />
        <div className="joke-add-form">
          <input
            className="joke-input"
            type="text"
            id="newJokeInput"
            value={newJokeText}
            placeholder="New One Liner"
            onChange={(event) => setNewJokeText(event.target.value)}
          />
          <button
            className="joke-input-submit btn-primary"
            onClick={handleAddJoke}
          >
            Add Joke
          </button>
        </div>
        <div className="joke-lists-container">
          <div className="joke-list-container">
            <h2 className="joke-list-container-header">Untold Jokes</h2>
            <ul className="joke-list-container">
              {untoldJokes.map((joke) => (
                <li className="joke-list-item" key={joke.id}>
                  <p className='joke-list-item-text'>{joke.text}</p>
                  <button onClick={() => handleToggleTold(joke)}>{joke.told ? 'Untold' : 'Told'}Toggle</button>
                  <button onClick={() => handleDeleteJoke(joke)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="joke-list-container">
            <h2 className="joke-list-container-header">Told Jokes</h2>
            <ul className=".joke-list-container">
              {toldJokes.map((joke) => (
                <li className="joke-list-item" key={joke.id}>
                  <p className='joke-list-item-text'>{joke.text}</p>
                  <button onClick={() => handleToggleTold(joke)}>{joke.told ? 'Untold' : 'Told'}Toggle</button>
                  <button onClick={() => handleDeleteJoke(joke)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
} 