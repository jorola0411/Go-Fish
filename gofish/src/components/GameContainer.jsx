import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useInitGame from "../gameplay/startGame";
import useTurns from "../gameplay/Turns";
import Hand from "./Hand";
import back from "/src/assets/back.svg";
import logo from '../assets/gofishlogo.png';

function GameContainer() {
    const { playerHand, setPlayerHand, cpuHand, setCpuHand, deckId, remainingCards, setRemainingCards, gameStart, startGame, loading } = useInitGame();    // Pass game state to useTurns
    const [newPlayerCards, setNewPlayerCards] = useState([]);
    const [newCpuCards, setNewCpuCards] = useState([]);
    const [showCompletedSet, setShowCompletedSet] = useState(false);
    const [completedSetCards, setCompletedSetCards] = useState([]);
    const [completedBy, setCompletedBy] = useState(null);


    const { 
        currentTurn, 
        playerTurn, 
        playerScore, 
        cpuScore, 
        gameOver, 
        winner, 
        playerMessage, 
        cpuMessage,
    } = useTurns({
        playerHand,
        setPlayerHand,
        cpuHand,
        setCpuHand,
        deckId,
        remainingCards,
        setRemainingCards,
        onCardDrawn: (card, player) => {
            if (player === 'player') {
                setNewPlayerCards([card]);
                setTimeout(() => setNewPlayerCards([]), 1500);
            } else {
                setNewCpuCards([card]);
                setTimeout(() => setNewCpuCards([]), 1500);
            }
        },
        onCardsTaken: (cards, player) => {
            if (player === 'player') {
                setNewPlayerCards(cards);
                setTimeout(() => setNewPlayerCards([]), 1500);
            } else {
                setNewCpuCards(cards);
                setTimeout(() => setNewCpuCards([]), 1500);
            }
        },
        onSetCompleted: (cards, player) => {
            setCompletedSetCards(cards);
            setCompletedBy(player);
            setShowCompletedSet(true);
            setTimeout(() => setShowCompletedSet(false), 2000);
        }
    });

    const resetGame = () => {
        startGame();
        setNewPlayerCards([]);
        setNewCpuCards([]);
        setShowCompletedSet(false);
    };
    
    // Animation variants
    const deckVariants = {
        hover: {
            scale: 1.05,
            rotate: [0, -1, 1, -1, 0],
            transition: {
                duration: 0.3
            }
        }
    };

    const completedSetVariants = {
        initial: { scale: 0, opacity: 0, y: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        exit: {
            scale: 0,
            opacity: 0,
            y: -100,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="flex flex-col items-center p-4 text-center min-h-screen justify-between text-white">
            {!gameStart ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                    <motion.img 
                        src={logo}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <motion.button
                        onClick={startGame}
                        className="mt-4 px-4 py-2 text-4xl bg-red-500 rounded hover:bg-red-700"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                    >
                        Start Game
                    </motion.button>
                    {loading && (
                        <motion.div 
                            className="flex flex-col items-center mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-2 text-lg">Please wait until the API wakes up...</p>
                        </motion.div>
                    )}
                </div>
            ) : gameOver ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                    <motion.div 
                        className="text-center text-2xl font-semibold"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p>Game Over!</p>
                        <p>{winner === "Tie" ? "It's a tie!" : `${winner === "player" ? "The Player" : "CPU"} wins!`}</p>
                        <motion.button 
                            onClick={resetGame} 
                            className="mt-4 px-4 py-2 text-4xl bg-red-500 rounded hover:bg-red-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Play Again
                        </motion.button>
                    </motion.div>
                </div>
            ) : (
                <>
                    {/* CPU Hand */}
                    <div className="w-full mb-4">
                        <Hand title="CPU Hand" hand={cpuHand} isCpu={true} newCards={newCpuCards} />
                        {cpuMessage && (
                            <motion.p 
                                className="text-lg my-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={cpuMessage}
                            >
                                {cpuMessage}
                            </motion.p>
                        )}
                        <p className="text-lg">CPU Score: {cpuScore}</p>
                    </div>
                    
                    {/* deck and turn indicator */}
                    <div className="flex flex-grow flex-col items-center justify-center w-full">
                        <div className="text-center">
                            {/* deck */}
                            <motion.div 
                                className="inline-block mb-4"
                                whileHover="hover"
                                variants={deckVariants}
                            >
                                <img src={back} className="w-24 h-32 mx-auto opacity-60" />
                                <p className="mt-2 text-center font-bold">{remainingCards} cards remaining</p>
                            </motion.div>
                            
                            {/* turn indictator */}
                            <motion.p 
                                className="text-2xl md:text-3xl mt-4"
                                animate={{ 
                                    scale: currentTurn === "player" ? [1, 1.05, 1] : 1,
                                    color: currentTurn === "player" ? ["#ffffff", "#ffcc00", "#ffffff"] : "#ffffff"
                                }}
                                transition={{ duration: 0.5, repeat: currentTurn === "player" ? 1 : 0 }}
                            >
                                Current Turn: {currentTurn === "player" ? "Your Turn" : "CPU's Turn"}
                            </motion.p>
                            
                            {playerMessage && (
                                <motion.p 
                                    className="text-lg mt-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={playerMessage}
                                >
                                    {playerMessage}
                                </motion.p>
                            )}
                        </div>
                    </div>

                    {/* Player hand section */}
                    <div className="w-full mt-4">
                        <Hand title="Your Hand" hand={playerHand} isCpu={false} onCardClick={playerTurn} newCards={newPlayerCards} />
                        <p className="text-xl font-semibold">Your Score: {playerScore}</p>
                    </div>
                    
                    {/* Completed set animation */}
                    <AnimatePresence>
                        {showCompletedSet && (
                            <motion.div 
                                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
                                variants={completedSetVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className="text-center">
                                    <h2 className="text-3xl mb-4 text-yellow-300">Set Completed!</h2>
                                    <p className="text-xl mb-6">{completedBy === "player" ? "You" : "CPU"} completed a set of {completedSetCards.length > 0 ? completedSetCards[0].name + "s" : "cards"}!</p>
                                    <div className="flex justify-center space-x-2">
                                        {completedSetCards.slice(0, 4).map((card, index) => (
                                            <motion.img 
                                                key={index} 
                                                src={card.image} 
                                                alt={card.value}
                                                className="w-16 h-24"
                                                initial={{ rotate: -10 + (index * 5), y: 50, opacity: 0 }}
                                                animate={{ 
                                                    rotate: -10 + (index * 5),
                                                    y: 0, 
                                                    opacity: 1,
                                                    transition: { delay: index * 0.1, duration: 0.3 }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}

export default GameContainer;