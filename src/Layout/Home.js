// "/"
// Shows a list of decks wirh options to create, view, study, or delete a deck

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteDeck } from "../utils/api/index";


function Home({decks}) {
 
    const navigate = useNavigate()
    // delete deck 
    const removeDeck = async (deckIdToDelete) => {
        const confirm = window.confirm("Are you sure you want to delete this deck?")
        if (confirm) {
            try {
                await deleteDeck(deckIdToDelete);
                navigate("/"); // navigate back to Home after deletion
            } catch (error) {
                console.error("Error deleting deck:", error);
            }
        }    
    }

    const deckItems = decks.map((deck, index) => (
    <li key={index}>
        <div className="card">
            <div className="card-body">
                <div className="card-header">
                    <h5 className="card-title">{deck.name}</h5> 
                    {deck.cards.length} cards
                </div>
                <p className="card-text">{deck.description}</p>
                <Link to={`/decks/${deck.id}`} className="btn btn-secondary">View</Link>
                <Link to={`/decks/${deck.id}/study`} className="btn btn-primary">Study</Link>
                <button className="btn btn-danger" onClick={() => removeDeck(deck.id)}>Delete</button>
            </div>
        </div>
    </li>
    ));

    return  (
        <>
            <div>
                <Link to="/decks/new" className="btn btn-secondary"> + Create Deck</Link>
            </div>
            <br />
            <ul>{deckItems}</ul> 
        </>
    );
}

export default Home;