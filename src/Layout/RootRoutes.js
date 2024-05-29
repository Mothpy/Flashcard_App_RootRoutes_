import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import CreateEditDeck from "./CreateEditDeck";
import AddEditCard from "./Routes/AddEditCard"
import Deck from "./Routes/Deck";
import Study from "./Routes/Study";
import NotFound from "./NotFound";
import { listDecks } from "../utils/api";

function RootRoutes() {

const [decks, setDecks] = useState([])

    useEffect(() => {
        async function fetchDecks() {
            try {
                const fetchDecks = await listDecks() 
                setDecks(fetchDecks)
            } catch (error) {
                console.error("Error fetching decks:", error)
            }
        }
        fetchDecks()
    }, [setDecks])

    return (
        <Routes>
            <Route path="/" element={<Home decks={decks}/>} />
            <Route path="decks/new" element={<CreateEditDeck />} />
            <Route path="decks/:deckId" element={<Deck />} />
            <Route path="decks/:deckId/study" element={<Study decks={decks}/>} />
            <Route path="decks/:deckId/edit" element={<CreateEditDeck />} />
            <Route path="decks/:deckId/cards/new" element={<AddEditCard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default RootRoutes;