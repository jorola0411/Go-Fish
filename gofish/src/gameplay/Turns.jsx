import { useState, useEffect } from 'react';

const useTurns = ({playerHand, setPlayerHand, cpuHand, setCpuHand, deckId, remainingCards, setRemainingCards }) => {

    const [currentTurn, setCurrentTurn] = useState('player');

    const changeTurn = () => {
        setCurrentTurn(prevTurn => prevTurn === 'player' ? 'cpu' : 'player');
    }

    const playerTurn = (requestedCardValue) => {
        if (currentTurn !== 'player') return;

        const matchingCard = cpuHand.find(card => card.value === requestedCardValue);
        if (matchingCard.length > 0) {
            setPlayerHand(prevHand => [...prevHand, ...matchingCard]);
            setCpuHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
        } else {
            console.log('Go Fish!');
            playerGoFish();
        }
        changeTurn();
    };

    const cpuTurn = async () => {
        if (currentTurn !== 'cpu') return;
        if (cpuHand.length === 0) return;

        const randomCard = cpuHand[Math.floor(Math.random() * cpuHand.length)];
        const requestedCardValue = randomCard.value;
        console.log(`CPU asks for: ${requestedCardValue}`);

        const matchingCard = playerHand.find(card => card.value === requestedCardValue);
        if (matchingCard.length > 0) {
            setCpuHand(prevHand => [...prevHand, ...matchingCard]);
            setPlayerHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
        } else {
            console.log('CPU: Go Fish!');
            cpuGoFish();
        }
        setTimeout(changeTurn, 2000);
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
    };

    useEffect(() => {
        if (currentTurn === 'cpu') {
            cpuTurn();
        }
    },[currentTurn]);

    return { currentTurn, playerTurn, cpuTurn };
};
export default useTurns;