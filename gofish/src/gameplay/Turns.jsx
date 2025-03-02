import { useState,  } from 'react';
import useInitGame from './startGame';

const useTurns = () => {

    const { playerHand, cpuHand, deckId, remainingCards, setPlayerHand, setCpuHand, setRemainingCards } = useInitGame();

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
            playerGoFish();
            changeTurn();
        }
    }

    const cpuTurn = (requestedCardValue) => {
        if (cpuHand.length === 0) return;

        const matchingCard = playerHand.find(card => card.value === requestedCardValue);
        if (matchingCard) {
            setCpuHand(prevHand => [...prevHand, matchingCard]);
            setPlayerHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
            changeTurn();
        }
        else {
            cpuGoFish();
            changeTurn()
        }
    }

    const playerGoFish = async () => {
        if (remainingCards === 0) return;
     
        const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        setPlayerHand(prevHand => [...prevHand, data.cards[0]]);
        setRemainingCards(data.remaining);
    }
    const cpuGoFish = async () => {
        if (remainingCards === 0) return;

        const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        setCpuHand(prevHand => [...prevHand, data.cards[0]]);
        setRemainingCards(data.remaining);
    }

    return { playerHand, cpuHand, currentTurn, playerTurn, cpuTurn };
}
export default useTurns;