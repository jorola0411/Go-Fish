//gets the new deck from the API and sets the state of the game, sets intial hands for player and CPU
// SECTION DONE
import { useState } from 'react';

const useInitGame = () => { //useInitGame instead of InitGame to signify that it is a custom hook

    const [playerHand, setPlayerHand] = useState([]);
    const [cpuHand, setCpuHand] = useState([]);
    const [deckId, setDeckId] = useState('');
    const [remainingCards, setRemainingCards] = useState(52);
    const [gameStart, setGameStart] = useState(false);
    const [error, setError] = useState(null);
    const cardOrder = { "ace": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "jack": 11, "queen": 12, "king": 13 };

const sortHand = (hand) => {
    return [...hand].sort((a, b) => {
        const rankA = cardOrder[String(a.name).toLowerCase()] || 0; // Default to 0 if undefined
        const rankB = cardOrder[String(b.name).toLowerCase()] || 0;
        return rankA - rankB;
    });
};

const baseURL = "https://coffee-carnation-muscari.glitch.me"; // Replace with your actual Glitch API URL

const startGame = async () => {
    try {
        // Request a new shuffled deck from the Glitch API
        const deckResponse = await fetch(`${baseURL}/deck`);
        const deckId = await deckResponse.json(); // Get deck ID

        setDeckId(deckId);

        // Now draw 14 cards (7 for the player, 7 for the CPU)
        const drawResponse = await fetch(`${baseURL}/draw/${deckId}?count=14`);
        const drawData = await drawResponse.json();

        setPlayerHand(sortHand(drawData.slice(0, 7)));
        setCpuHand(sortHand(drawData.slice(7, 14)));
        setRemainingCards((prevRemaining) => prevRemaining - 14);
        setGameStart(true);
    } catch (error) {
        console.error("Error starting game:", error);
        setError(error);
    }
};

    return { playerHand, cpuHand, deckId, remainingCards, setPlayerHand, setCpuHand, setDeckId, setRemainingCards, gameStart, startGame }; // this returns the state of the game to be used in the GameContainer component

};

export default useInitGame;