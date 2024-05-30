// /decks:deckId/cards/new
// Allows user to add a new card to an exisisting deck 

// use the readDeck() func from src/utils/api/index.js to load the deck that you want to add the card to
// use readCard() func from src/utils/api/index.js to load the card that you want to edit 

import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import { createCard, updateCard, readDeck, readCard } from "../../utils/api/index";

function AddEditCard() {
    // set initial state for adding a new card 
    const initialFormState ={
        front: "",
        back: ""
    }

    // state variables for form data and deck name 
    const [formData, setFormData] = useState({...initialFormState});
    const [deckName, setDeckName] = useState("");

    // handler to update form data state on input change 
    const handleChange = ({target}) => {
        setFormData({...formData, [target.name]: target.value})
    }

    // hooks for navigation, location, and URL params 
    const navigate = useNavigate();
    const location = useLocation();
    const {deckId, cardId} = useParams();

    // handler for form submission when adding a new card 
    const handleSubmit = async (event) => {
        console.log("handleCardSubmit");
        event.preventDefault();
        await createCard(deckId, formData)
        setFormData(initialFormState);
        navigate(0);
    }

    // handler for submission when editing an exisiting card 
    const handleEdit = async (event) => {
        console.log("handleCardEdit");
        event.preventDefault();
        await updateCard(formData)
        setFormData(initialFormState); 
        navigate(`decks/${deckId}`); // navigate back to the deck view 
    }

    // effect to load the caed data if editing an exsisting card 
    useEffect(() => {
        const abortController = new AbortController();
        async function loadCard() {
            if(cardId) {
                try {
                    const cardData = await readCard(cardId, abortController.signal);
                    setFormData(cardData);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        loadCard();
        return () => abortController.abort();
    },[deckId]);

    // effect to load the deck data for displaying the deck name 
    useEffect(() => {
        const abortController = new AbortController();
        async function loadDeck() {
            if(deckId) {
                try {
                    const deckData = await readDeck(deckId, abortController.signal);
                    setDeckName(deckData.name);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        loadDeck();
        return () => abortController.abort();
    },[deckId]);

    // determine the form title and submit button label based on the URL path 
    const formTitle = location.pathname.includes("edit") ? "Edit Card" : "Add Card";
    const submitButtonLabel = location.pathname.includes("edit") ? "Submit" : "Save";
    const handleSubmitForm = location.pathname.includes("edit") ? handleEdit : handleSubmit;

    return (
        <>
        {/* Breadcrumb navigation */}
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                {location.pathname.includes('new')? 
                <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckName}</Link></li>
                    : null }
                <li className="breadcrumb-item active" aria-current="page">
                    {formTitle}
                </li>
            </ol>
        </nav>

        {/* Form for adding or editing a card */}
        <div>
            <h3>{formTitle}</h3>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor="front">
                    Front 
                    <br />
                    <textarea 
                        id="front"
                        type="text"
                        name="front"
                        onChange={handleChange}
                        value={formData.front}
                        placeholder="Card Front"
                    />
                </label>
                <br />
                <label htmlFor="back">
                    Back 
                    <br />
                    <textarea
                        id="back"
                        type="text"
                        name="back"
                        onChange={handleChange}
                        value={formData.back}
                        placeholder="Card Back"
                    />
                    </label>
                    <br />
                    <Link to={`/decks/${deckId}`} className="btn btn-secondary">Done</Link>
                    <button type="submit" className="btn btn-primary">{submitButtonLabel}</button>
                </form>
            </div>
        </>
    );
}

export default AddEditCard;