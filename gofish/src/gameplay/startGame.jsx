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

const baseURL = "https://coffee-carnation-muscari.glitch.me"; 

const startGame = async () => {
    try {
        
        const deckResponse = await fetch(`${baseURL}/deck`);
        const deckId = await deckResponse.json(); 

        setDeckId(deckId);
     
        const drawResponse = await fetch(`${baseURL}/draw/${deckId}?count=14`);// This draws 14 cards from the deck, 7 for the player and 7 for the CPU
        const drawData = await drawResponse.json();

        setPlayerHand(sortHand(drawData.slice(0, 7))); // this takes the 14 cards and slices them equally for the player and CPU 
        setCpuHand(sortHand(drawData.slice(7, 14)));
        setRemainingCards((prevRemaining) => prevRemaining - 14); //after the cards are given to the player, this sets the amount of cards left in the deck; 38 cards.
        setGameStart(true); //after the cards have been drawn, the game starts
    } catch (error) {
        console.error("Error starting game:", error);
        setError(error);
    }
};

    return { playerHand, cpuHand, deckId, remainingCards, setPlayerHand, setCpuHand, setDeckId, setRemainingCards, gameStart, startGame }; // this returns the state of the game to be used in the GameContainer component

};

export default useInitGame;