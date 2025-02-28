//gets the new deck from the API and sets the state of the game, sets intial hands for player and CPU
// SECTION DONE
import { useState, useEffect } from 'react';

const useInitGame = () => {

    const [playerHand, setPlayerHand] = useState([]);
    const [cpuHand, setCpuHand] = useState([]);
    const [deckId, setDeckId] = useState('');
    const [remainingCards, setRemainingCards] = useState(52);

    useEffect(() => {
        const startGame = async () => {
            try {
                const response = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=14`)
                const data = await response.json();

                setDeckId(data.deck_id);
                setPlayerHand(data.cards.slice(0, 7));
                setCpuHand(data.cards.slice(7, 14));
                setRemainingCards(data.remaining);
            } catch (error) {
                console.error("Error setting up game:", error);
            }
        };

        startGame();
    }, []);

    return { playerHand, cpuHand, deckId, remainingCards, setPlayerHand, setCpuHand, setDeckId, setRemainingCards };

};

export default useInitGame;