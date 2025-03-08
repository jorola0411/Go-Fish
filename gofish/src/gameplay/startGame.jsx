//gets the new deck from the API and sets the state of the game, sets intial hands for player and CPU
// SECTION DONE
import { useState } from 'react';

const useInitGame = () => { //useInitGame instead of InitGame to signify that it is a custom hook

    const [playerHand, setPlayerHand] = useState([]);
    const [cpuHand, setCpuHand] = useState([]);
    const [deckId, setDeckId] = useState('');
    const [remainingCards, setRemainingCards] = useState(52);
    const [gameStart, setGameStart] = useState(false);
    const cardOrder = { "ACE": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "JACK": 11, "QUEEN": 12, "KING": 13 };

const sortHand = (hand) => {
    return [...hand].sort((a, b) => {
        const rankA = cardOrder[a.value] || 0; // Default to 0 if undefined
        const rankB = cardOrder[b.value] || 0;
        return rankA - rankB;
    });
};

        const startGame = async () => {
            try {
                const deckResponse = await fetch(`https://coffee-carnation-muscari.glitch.me/deck`) // new deck
                const deckData = await deckResponse.json();
                setDeckId(deckId);

                const dataResponse = await fetch(`https://coffee-carnation-muscari.glitch.me/draw/${deckId}?count=14`) // This draws 14 cards from the deck, 7 for the player and 7 for the CPU
                const drawData = await dataResponse.json();

                setPlayerHand(sortHand(drawData.cards.slice(0, 7))); // this takes the 14 cards and slices them equally for the player and CPU
                setCpuHand(sortHand(drawData.cards.slice(7, 14)));
                setRemainingCards(drawData.remaining); //after the cards are given to the player, this sets the amount of cards left in the deck; 38 cards.
                setGameStart(true); //after the cards have been drawn, the game starts

            } catch (error) {
                setError(error);
            }
        };

    return { playerHand, cpuHand, deckId, remainingCards, setPlayerHand, setCpuHand, setDeckId, setRemainingCards, gameStart, startGame }; // this returns the state of the game to be used in the GameContainer component

};

export default useInitGame;