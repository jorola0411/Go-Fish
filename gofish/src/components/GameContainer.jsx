import useInitGame from "../gameplay/startGame";
import useTurns from "../gameplay/Turns";
import Hand from "./Hand";

function GameContainer() {
    const { playerHand, setPlayerHand, cpuHand, setCpuHand, deckId, remainingCards, setRemainingCards, gameStart, startGame } = useInitGame();
    
    // Pass game state to useTurns
    const { currentTurn, playerTurn, cpuTurn, playerScore, cpuScore, gameOver, winner, playerMessage, cpuMessage } = useTurns({
        playerHand,
        setPlayerHand,
        cpuHand,
        setCpuHand,
        deckId,
        remainingCards,
        setRemainingCards
    });

    return (
        <div className="p-4 text-center min-h-screen justify-center text-white text-center">
            <h1 className="text-2xl font-bold">Go Fish!</h1>
           
            {!gameStart ? (
                <button
                    onClick={startGame}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Start Game
                </button>
                
            ) : gameOver ? (
                <div className="mt-4 text-xl font-semibold">
                    <p>Game Over!</p>
                    <p>{winner === "Tie" ? "It's a tie!" : `${winner} wins!`}</p>
                </div>
            ) : (
                
                <>
                 <div className="flex justify-between">
                <p className="text-lg">Your Score: {playerScore}</p>
                <p className="text-lg">CPU Score: {cpuScore}</p>
            </div>
                    <Hand title="CPU Hand" hand={cpuHand} isCpu={true} />
                    {cpuMessage && <p className="text-lg">{cpuMessage}</p>}
                    
                    <div className="relative flex flex-col items-center w-full text-white ">
                        <p className="text-lg font-semibold">Deck</p>
                        <div className="relative w-24 h-32 flex items-center justify-center">
                            <div className="absolute w-24 h-32"><img src="https://deckofcardsapi.com/static/img/back.png"className="opacity-60"/></div>
                        </div>
                           </div>
                        <p className="mt-5 text-white font-bold text-lg text-center">Number of cards left: {remainingCards}</p>
                        <p className="text-lg">Current Turn: {currentTurn === "player" ? "Your Turn" : "CPU's Turn"}</p>
                        {playerMessage && <p className="text-lg">{playerMessage}</p>}
                    <Hand title="Your Hand" hand={playerHand} isCpu={false} onCardClick={playerTurn} />
                 
                </>
            )}
        </div>
    );
}

export default GameContainer;