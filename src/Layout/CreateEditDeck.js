// path= /decks/new
// create new deck 

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { createDeck, updateDeck, readDeck } from "../utils/api/index";

function CreateEditDeck() {
    const initialFormState = {
        name:"",
        description:"",
    };

    const [formData, setFormData] = useState({...initialFormState})
    const handleChange = ({target}) => {
        setFormData({...formData, [target.name]: target.value})
    };

    const navigate = useNavigate();
    const { deckId } = useParams();
    const location = useLocation();

    useEffect(() => {
        const abortController = new AbortController();
        async function loadDeck() {
            if(deckId) {
                try {
                    // fetch deck details if editing an existing deck
                    const deckData = await readDeck(deckId, abortController.signal);
                    setFormData(deckData);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        loadDeck(); // call loadDeck func 
        return () => abortController.abort();
    }, [deckId]);

    // handle form submission for creating a new deck 
    const handleSubmit = async (event) => {
        console.log("handleSubmit");
        event.preventDefault();
        const newDeck = await createDeck(formData);
        setFormData(initialFormState);
        navigate(`/decks/${newDeck.id}`);
    };

    // handle form submissions for editing an existing deck 
    const handleEdit = async (event) => {
        console.log("handleEdit")
        event.preventDefault();
        await updateDeck(formData);
        setFormData(initialFormState); 
        navigate(`/decks/${deckId}`);
    };

    // new deck form 
    const createDeckForm = (
        <div>
            <br />
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">
                    Name:
                    <br />
                    <input 
                        id="name"
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                        placeholder="Deck Name"
                    />
                </label>
                < br /> 
                <label htmlFor="description">
                    Description:
                    <br /> 
                    <textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the deck"
                    onChange={handleChange}
                    value={formData.description}
                    >
                    </textarea>
                </label>
                <br />
                <Link to="/" className="btn btn-secondary">Cancel</Link>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
    // update deck 
    const upadteDeckForm = (
        <div>
            <br />
            <form onSubmit={handleEdit}>
                <label htmlFor="name">
                    Name:
                    <br/>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                        placeholder="Deck Name"
                    />
                </label>
                <br/>
                <label htmlFor="description">
                    Description:
                    <br/>
                    <textarea 
                    id="description" 
                    name="description"
                    placeholder="Brief description of the deck"
                    onChange={handleChange}
                    value={formData.description}
                    >
                    </textarea>
                </label>
                <br/>
                <Link to={`/decks/${deckId}`} className= "btn btn-secondary">Cancel</Link>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
    
    return (
        <>
        <nav aria-label="breadcrumb">
            {/* Breadcrumb navigation */}
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                {location.pathname.includes("edit") ? (
                    // Show breadcrumb for editing an existing deck 
                <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{formData.name}</Link></li>
                    ) : null }
                <li className="breadcrumb-item active" aria-current="page">
                    {/* Display "Edit Deck" or "Create Deck" based on URL */}
                    {location.pathname.includes("edit") ? "Edit Deck": "Create Deck"}
                </li>    
            </ol>
        </nav>
        {location.pathname.includes("new") ? createDeckForm : upadteDeckForm}
        </>
    );
}

export default CreateEditDeck; 