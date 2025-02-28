import { useState,useEffect } from 'react';
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
            else{
                console.log('Go Fish!');
                goFish(playerHand);

                changeTurn();
            }
    }
}
export default Turns;