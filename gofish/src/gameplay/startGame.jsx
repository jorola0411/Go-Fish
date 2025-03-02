//gets the new deck from the API and sets the state of the game, sets intial hands for player and CPU
// SECTION DONE
import { useState, useEffect } from 'react';

const useInitGame = () => {

    const [playerHand, setPlayerHand] = useState([]);
    const [cpuHand, setCpuHand] = useState([]);
    const [deckId, setDeckId] = useState('');
    const [remainingCards, setRemainingCards] = useState(52);
    const [gameStart, setGameStart] = useState(false);

    useEffect(() => {
        const startGame = async () => {
            try {
                const deckResponse = await fetch(`/api/api/deck/new/shuffle/?deck_count=1`) // new deck
                const deckData = await deckResponse.json();
                setDeckId(deckData.deck_id);

                const dataResponse = await fetch(`/api/api/deck/${deckData.deck_id}/draw/?count=14`) // This draws 14 cards from the deck, 7 for the player and 7 for the CPU
                const drawData = await dataResponse.json();

                setPlayerHand(drawData.cards.slice(0, 7));
                setCpuHand(drawData.cards.slice(7, 14));
                setRemainingCards(drawData.remaining);
                setGameStart(true);

            } catch (error) {
                setError(error);
            }
        };

        startGame();
    }, []);

    return { playerHand, cpuHand, deckId, remainingCards, setPlayerHand, setCpuHand, setDeckId, setRemainingCards, gameStart };

};

export default useInitGame;