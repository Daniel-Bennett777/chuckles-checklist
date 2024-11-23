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
        <img className="app-logo" src={movieIcon} alt="Movie Icon" />
      </div>
      <div>
        <Header />
        <div className="fact-add-form">
          <input
            className="fact-input"
            type="text"
            id="newFactInput"
            value={newFactText}
            placeholder="Add a Movie Fact"
            onChange={(event) => setNewFactText(event.target.value)}
          />
          <button
            className="fact-input-submit btn-primary"
            onClick={handleAddFact}
          >
            Add Fact
          </button>
        </div>
        <div className="fact-lists-container">
          <div className="fact-list-container">
            <h2 className="fact-list-container-header">Untold Facts</h2>
            <ul className="fact-list-container">
              {untoldFacts.map((fact) => (
                <li className="fact-list-item" key={fact.id}>
                  <p className='fact-list-item-text'>{fact.text}</p>
                  <button onClick={() => handleToggleShared(fact)}>
                    {fact.shared ? 'Unshare' : 'Share'}
                  </button>
                  <button onClick={() => handleDeleteFact(fact)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="fact-list-container">
            <h2 className="fact-list-container-header">Shared Facts</h2>
            <ul className="fact-list-container">
              {sharedFacts.map((fact) => (
                <li className="fact-list-item" key={fact.id}>
                  <p className='fact-list-item-text'>{fact.text}</p>
                  <button onClick={() => handleToggleShared(fact)}>
                    {fact.shared ? 'Unshare' : 'Share'}
                  </button>
                  <button onClick={() => handleDeleteFact(fact)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
