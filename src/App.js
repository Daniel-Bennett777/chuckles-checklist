import React, { useEffect, useState } from 'react';
import './App.css';
import { getAllFacts, postNewFact, updateFact, deleteFact } from './services/factService';
import movieIcon from "./assets/movie-icon.png";

const Header = () => {
  return (
    <div className="app-heading">
      <h1 className="app-heading-text">Movie Facts Board</h1>
    </div>
  );
};

export const App = () => {
  const [allFacts, setAllFacts] = useState([]); // All movie facts fetched from the server.
  const [newFactText, setNewFactText] = useState(""); // Input field for adding a new fact.
  const [untoldFacts, setUntoldFacts] = useState([]); // Facts not yet "shared."
  const [sharedFacts, setSharedFacts] = useState([]); // Facts already "shared."
  const [factAdded, setFactAdded] = useState(false); // Triggers a re-fetch when a new fact is added.

  useEffect(() => {
    getAllFacts()
      .then((data) => {
        setAllFacts(data);

        // Separate "untold" and "shared" facts
        const untold = data.filter((fact) => !fact.shared);
        const shared = data.filter((fact) => fact.shared);
        setUntoldFacts(untold);
        setSharedFacts(shared);
      })
      .catch((error) => console.error('Error fetching facts:', error));
  }, [factAdded]);

  const handleAddFact = () => {
    if (newFactText.trim() !== "") {
      postNewFact(newFactText)
        .then((newFact) => {
          setAllFacts([...allFacts, newFact]);
          setNewFactText(""); // Clear input field
          setFactAdded(!factAdded); // Trigger re-fetch
        })
        .catch((error) => console.error('Error posting fact:', error));
    }
  };

  const handleToggleShared = async (fact) => {
    const updatedFact = {
      ...fact,
      shared: !fact.shared,
    };

    try {
      await updateFact(updatedFact);

      const updatedAllFacts = allFacts.map((f) => (f.id === updatedFact.id ? updatedFact : f));
      setAllFacts(updatedAllFacts);

      const untold = updatedAllFacts.filter((fact) => !fact.shared);
      const shared = updatedAllFacts.filter((fact) => fact.shared);
      setUntoldFacts(untold);
      setSharedFacts(shared);
    } catch (error) {
      console.error('Error updating fact:', error);
    }
  };

  const handleDeleteFact = async (fact) => {
    try {
      await deleteFact(fact);

      const updatedAllFacts = allFacts.filter((f) => f.id !== fact.id);
      setAllFacts(updatedAllFacts);

      const untold = updatedAllFacts.filter((fact) => !fact.shared);
      const shared = updatedAllFacts.filter((fact) => fact.shared);
      setUntoldFacts(untold);
      setSharedFacts(shared);
    } catch (error) {
      console.error('Error deleting fact:', error);
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