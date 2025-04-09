import { useState, useEffect } from 'react';

const useTurns = ({  //these take the params from the GameContainer component
    playerHand, 
    setPlayerHand, 
    cpuHand, 
    setCpuHand, 
    deckId, 
    remainingCards, 
    setRemainingCards,
    onCardDrawn = () => {},
    onCardsTaken = () => {},
    onSetCompleted = () => {}
}) => {
    const [currentTurn, setCurrentTurn] = useState('player');
    const [playerScore, setPlayerScore] = useState(0);
    const [cpuScore, setCpuScore] = useState(0);
    const [playerMessage, setPlayerMessage] = useState('');
    const [cpuMessage, setCpuMessage] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [lastDrawnCard, setLastDrawnCard] = useState(null);
    const [lastTakenCards, setLastTakenCards] = useState([]);
    const [lastCompletedSet, setLastCompletedSet] = useState([]);

    const cardOrder = { "ace": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "jack": 11, "queen": 12, "king": 13 };
    const baseURL = "https://coffee-carnation-muscari.glitch.me"
    
    const sortHand = (hand) => {
        return [...hand].sort((a, b) => {
            const rankA = cardOrder[String(a.name).toLowerCase()] || 0;  // Default to 0 if undefined
            const rankB = cardOrder[String(b.name).toLowerCase()] || 0;
            return rankA - rankB;
        });
    };

    const completedSet = (hand, setHand, setScore, player) => {
        const cardCounts = hand.reduce((acc, card) => {
            acc[card.value] = (acc[card.value] || 0) + 1;
            return acc;
        }, {});

        let updatedHand = [...hand];
        let scoreIncrease = 0;
        let completedSetCards = [];

        Object.keys(cardCounts).forEach(value => {
            const numberValue = Number(value);
            if (cardCounts[numberValue] === 4) {
                const setCards = hand.filter(card => card.value === numberValue);
                completedSetCards = [...setCards];
                updatedHand = updatedHand.filter(card => card.value !== numberValue);
                scoreIncrease += 1;
            }
        });

        if (scoreIncrease > 0) {
            setHand(updatedHand);
            setScore(prevScore => prevScore + scoreIncrease);
            setLastCompletedSet(completedSetCards);
            onSetCompleted(completedSetCards, player);
        }
    };

    const changeTurn = () => {
        setCurrentTurn(prevTurn => (prevTurn === 'player' ? 'cpu' : 'player'));
    };

    const playerTurn = (requestedCardValue) => {
        if (currentTurn !== 'player' || gameOver) return;
   
        const matchingCards = cpuHand.filter(card => card.value === requestedCardValue);

        if (matchingCards.length > 0) {
            setPlayerMessage(`Got ${matchingCards.length} ${matchingCards[0].name}${matchingCards.length > 1 ? 's' : ''}!`);
            setLastTakenCards(matchingCards);
            onCardsTaken(matchingCards, 'player');

            setPlayerHand(prevHand => {
                const newHand = sortHand([...prevHand, ...matchingCards]);
                completedSet(newHand, setPlayerHand, setPlayerScore, 'player');
                return newHand;
            });

            setCpuHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
            return;
        } else {
            setPlayerMessage('Go Fish!');
            playerGoFish();
        }

        setTimeout(() => {
            changeTurn();
        }, 1000);
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
            setCpuMessage(`Got ${matchingCards.length} ${matchingCards[0].name}${matchingCards.length > 1 ? 's' : ''}!`);
            setLastTakenCards(matchingCards);
            onCardsTaken(matchingCards, 'cpu');

            setCpuHand(prevHand => {
                const newHand = sortHand([...prevHand, ...matchingCards]);
                completedSet(newHand, setCpuHand, setCpuScore, 'cpu');
                return newHand;
            });

            setPlayerHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
            
            // CPU gets another turn after successful ask
            setTimeout(() => {
                cpuTurn();
            }, 1500);
        } else {
            setCpuMessage('Go Fish!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await cpuGoFish();
            setCpuMessage('Your turn!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCpuMessage('');
            changeTurn();
        }
    };

    const playerGoFish = async () => {
        if (remainingCards === 0) {
            changeTurn();
            setPlayerMessage('No cards left in the deck!');
            return;
        }

        try {
            const response = await fetch(`${baseURL}/draw/${deckId}?count=1`);
            const data = await response.json();
            
            setLastDrawnCard(data);
            onCardDrawn(data, 'player');

            setPlayerHand(prevHand => {
                const newHand = sortHand([...prevHand, data]);
                completedSet(newHand, setPlayerHand, setPlayerScore, 'player');
                return newHand;
            });

            setRemainingCards(prev => (data.remaining !== undefined ? data.remaining : prev - 1));
            
        } catch (error) {
            console.error("Error fetching card:", error);
        }
    };

    const cpuGoFish = async () => {
        if (remainingCards === 0) return;

        try {
            const response = await fetch(`${baseURL}/draw/${deckId}?count=1`);
            const data = await response.json();
            
            setLastDrawnCard(data);
            onCardDrawn(data, 'cpu');

            setCpuHand(prevHand => {
                const newHand = sortHand([...prevHand, data]);
                completedSet(newHand, setCpuHand, setCpuScore, 'cpu');
                return newHand;
            });

            setRemainingCards(prev => (data.remaining !== undefined ? data.remaining : prev - 1));
        } catch (error) {
            console.error("Error fetching card:", error);
        }
    };

    useEffect(() => {
        if (currentTurn === 'cpu') {
            const timer = setTimeout(() => {
                cpuTurn();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentTurn]);

    const checkGameOver = () => {
        if ((playerHand.length === 0 && remainingCards === 0) || (cpuHand.length === 0 && remainingCards === 0)) {
            setGameOver(true);
            setWinner(playerScore > cpuScore ? 'player' : cpuScore > playerScore ? "cpu" : 'Tie');
        }
    };

    useEffect(() => {
        checkGameOver();
    }, [playerHand, cpuHand, remainingCards]);

    return { 
        currentTurn, 
        playerTurn, 
        cpuTurn, 
        playerScore, 
        cpuScore, 
        gameOver, 
        winner, 
        playerMessage, 
        cpuMessage,
        lastDrawnCard,
        lastTakenCards,
        lastCompletedSet
    };
};

export default useTurns;