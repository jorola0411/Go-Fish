import { useState, useEffect } from 'react';

const useTurns = ({ playerHand, setPlayerHand, cpuHand, setCpuHand, deckId, remainingCards, setRemainingCards }) => { //these take the params from the GameContainer component
    const [currentTurn, setCurrentTurn] = useState('player');
    const [playerScore, setPlayerScore] = useState(0);
    const [cpuScore, setCpuScore] = useState(0);
    const [playerMessage, setPlayerMessage] = useState('');
    const [cpuMessage, setCpuMessage] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);

    const cardOrder = { "ace": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "jack": 11, "queen": 12, "king": 13 };
    const baseURL = "https://coffee-carnation-muscari.glitch.me"
    const sortHand = (hand) => {
        return [...hand].sort((a, b) => {
            const rankA = cardOrder[String(a.name).toLowerCase()] || 0; // Default to 0 if undefined
            const rankB = cardOrder[String(b.name).toLowerCase()] || 0;
            return rankA - rankB;
        });
    };

    const completedSet = (hand, setHand, setScore) => {
        const cardCounts = hand.reduce((acc, card) => {
            acc[card.value] = (acc[card.value] || 0) + 1;
            return acc;
        }, {});

        let updatedHand = [...hand];
        let scoreIncrease = 0;

        Object.keys(cardCounts).forEach(value => {
            const numberValue = Number(value);
            if (cardCounts[numberValue] === 4) {
                updatedHand = updatedHand.filter(card => card.value !== numberValue);
                scoreIncrease += 1;
            }
        });

        if (scoreIncrease > 0) {
            setHand(updatedHand);
            setScore(prevScore => prevScore + scoreIncrease);
        }
    };

    const changeTurn = () => {
        setCurrentTurn(prevTurn => (prevTurn === 'player' ? 'cpu' : 'player'));
    };

    const playerTurn = (requestedCardValue) => {
        if (currentTurn !== 'player' || gameOver) return;
   

        const matchingCards = cpuHand.filter(card => card.value === requestedCardValue);

        if (matchingCards.length > 0) {

            setPlayerHand(prevHand => {
                const newHand = sortHand([...prevHand, ...matchingCards]);
                completedSet(newHand, setPlayerHand, setPlayerScore);
                return newHand;
            });

            setCpuHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));

            return;
        } else {
            playerGoFish();
        }

        changeTurn();
    };

    const cpuTurn = async () => {
        if (currentTurn !== 'cpu' || cpuHand.length === 0 || gameOver) return;

        const randomCard = cpuHand[Math.floor(Math.random() * cpuHand.length)];
        const requestedCardValue = randomCard.value;
        const requestedCardName = randomCard.name;
        setCpuMessage(`Do you have any ${requestedCardName}s?`);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const matchingCards = playerHand.filter(card => card.value === requestedCardValue);

        if (matchingCards.length > 0) {
            setCpuHand(prevHand => {
                const newHand = [...prevHand, ...matchingCards];
                completedSet(newHand, setCpuHand, setCpuScore);
                return newHand;
            });

            setPlayerHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
            setTimeout(cpuTurn, 1500);
        } else {
            setCpuMessage('Go Fish!');
            await new Promise(resolve => setTimeout(resolve, 1500));
            await cpuGoFish();
            setCpuMessage('Your turn!');
            await new Promise(resolve => setTimeout(resolve, 1500)); // Keep "Your turn!" for a moment
            setCpuMessage('');
            changeTurn();
        }
    };

    const playerGoFish = async () => {
        if (remainingCards === 0) {
            changeTurn();
            return;
        }

        try{

        const response = await fetch(`${baseURL}/draw/${deckId}?count=1`);
        const data = await response.json();

        setPlayerHand(prevHand => {
            const newHand = sortHand([...prevHand, data]);
            completedSet(newHand, setPlayerHand, setPlayerScore);
            return newHand;
        });

        setRemainingCards(prev => (data.remaining !== undefined ? data.remaining : prev - 1));
        
    } catch (error) {
        console.error("Error fetching card:", error);
    }
    };

    const cpuGoFish = async () => {
        if (remainingCards === 0) return;

        const response = await fetch(`${baseURL}/draw/${deckId}?count=1`);
        const data = await response.json();
     

        setCpuHand(prevHand => {
            const newHand = [...prevHand, data];
            completedSet(newHand, setCpuHand, setCpuScore);
            return newHand;
        });

        setRemainingCards(prev => (data.remaining !== undefined ? data.remaining : prev - 1));

    };

    useEffect(() => {
        if (currentTurn === 'cpu') {
            cpuTurn();
        }
    }, [currentTurn]);

    const checkGameOver = () => {
        if ((playerHand.length === 0 && remainingCards === 0) || (cpuHand.length === 0 && remainingCards === 0)) {
            setGameOver(true);
            setWinner(playerScore > cpuScore ? 'player' : cpuScore > playerScore ? "cpu" : 'Tie')
        }
    };

    useEffect(() => {
        checkGameOver();
    }, [playerHand, cpuHand, remainingCards]);

    return { currentTurn, playerTurn, cpuTurn, playerScore, cpuScore, gameOver, winner, playerMessage, cpuMessage };
};

export default useTurns;