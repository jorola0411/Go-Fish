import { useState, useEffect } from 'react';

const useTurns = ({ playerHand, setPlayerHand, cpuHand, setCpuHand, deckId, remainingCards, setRemainingCards }) => {
    const [currentTurn, setCurrentTurn] = useState('player');
    const [playerScore, setPlayerScore] = useState(0);
    const [cpuScore, setCpuScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [lastRequestedCard, setLastRequestedCard] = useState(null);

    const cardOrder = { "ACE": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "JACK": 11, "QUEEN": 12, "KING": 13 };

    const sortHand = (hand) => {
        return [...hand].sort((a, b) => {
            const rankA = cardOrder[a.value] || 0; // Default to 0 if undefined
            const rankB = cardOrder[b.value] || 0;
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
            if (cardCounts[value] === 4) {
                updatedHand = updatedHand.filter(card => card.value !== value);
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
        setLastRequestedCard(requestedCardValue);

        const matchingCards = cpuHand.filter(card => card.value === requestedCardValue);

        if (matchingCards.length > 0) {
            setPlayerHand(prevHand => {
                const newHand = sortHand([...prevHand, ...matchingCards]);
                completedSet(newHand, setPlayerHand, setPlayerScore);
                return newHand;
            });

            setCpuHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
            console.log(`Player matched with${requestedCardValue}`)
            return;
        } else {
            console.log('Go Fish!');
            playerGoFish();
        }

        changeTurn();
    };

    const cpuTurn = async () => {
        if (currentTurn !== 'cpu' || cpuHand.length === 0 || gameOver) return;

        const randomCard = cpuHand[Math.floor(Math.random() * cpuHand.length)];
        const requestedCardValue = randomCard.value;
        console.log(`CPU asks for: ${requestedCardValue}`);

        const matchingCards = playerHand.filter(card => card.value === requestedCardValue);

        if (matchingCards.length > 0) {
            setCpuHand(prevHand => {
                const newHand = [...prevHand, ...matchingCards];
                completedSet(newHand, setCpuHand, setCpuScore);
                return newHand;
            });

            setPlayerHand(prevHand => prevHand.filter(card => card.value !== requestedCardValue));
            setTimeout(changeTurn, 3000);
        } else {
            console.log('CPU: Go Fish!');
            await cpuGoFish();
        }
    };

    const playerGoFish = async () => {
        if (remainingCards === 0) {
            changeTurn();
            return;
        }

        const response = await fetch(`/api/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        const drawnCard = data.cards[0];

        setPlayerHand(prevHand => {
            const newHand = sortHand([...prevHand, data.cards[0]]);
            completedSet(newHand, setPlayerHand, setPlayerScore);
            return newHand;
        });

        setRemainingCards(data.remaining);
        if (drawnCard.value === lastRequestedCard) {
            console.log("You drew the card you asked for! Go again.");
        } else {
            changeTurn();
        }
    };

    const cpuGoFish = async () => {
        if (remainingCards === 0) return;

        const response = await fetch(`/api/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        const drawnCard = data.cards[0];

        setCpuHand(prevHand => {
            const newHand = [...prevHand, drawnCard];
            completedSet(newHand, setCpuHand, setCpuScore);
            return newHand;
        });

        setRemainingCards(data.remaining);

        if (drawnCard.value === lastRequestedCard) {
            console.log("CPU drew the card they asked for! Go again.");
            setTimeout(cpuTurn, 3000);
        } else {
            changeTurn();
        }
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

    return { currentTurn, playerTurn, cpuTurn, playerScore, cpuScore, gameOver };
};

export default useTurns;