import { useState, useEffect } from 'react';
import useInitGame from './startGame';

function Turns() {

    const { playerHand, cpuHand, deckId, remainingCards, setPlayerHand, setCpuHand, setDeckId, setRemainingCards } = useInitGame();

    const [currentTurn, setCurrentTurn] = useState('player');

    const changeTurn = () => {
        setCurrentTurn(prevTurn => prevTurn === 'player' ? 'cpu' : 'player');
    }
    const playerTurn = (requestedCardValue) => {
        const matchingCard = cpuHand.find(card => card.value === requestedCardValue);
        if (matchingCard) {
            setPlayerHand(prevHand => [...prevHand, matchingCard]);
            setCpuHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
            changeTurn();
        }
        else {
            console.log('Go Fish!');
            goFish(playerHand);

            changeTurn();
        }
    }



    const playerGoFish = async () => {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        setPlayerHand(prevHand => [...prevHand, data.cards[0]]);
        setRemainingCards(data.remaining);
    }
    const cpuGoFish = async () => {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        setCpuHand(prevHand => [...prevHand, data.cards[0]]);
        setRemainingCards(data.remaining);
    }
}
    export default Turns;