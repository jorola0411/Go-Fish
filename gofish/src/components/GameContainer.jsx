import useInitGame from "../gameplay/startGame";
import useTurns from "../gameplay/Turns";
import Hand from "./Hand";
import back from "/src/assets/back.svg"
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
        <div className="flex flex-col items-center p-4 text-center min-h-screen justify-center text-white gap-y-10">


            {!gameStart ? (
                <>
                    <h1 className="text-9xl font-bold">Go Fish!</h1>
                    <button
                        onClick={startGame}
                        className="mt-4 px-4 py-2 text-4xl bg-red-500 rounded hover:bg-red-700"
                    >
                        Start Game
                    </button>
                </>
            ) : gameOver ? (
                <div className="mt-4 text-center text-2xl font-semibold">
                    <p>Game Over!</p>
                    <p>{winner === "Tie" ? "It's a tie!" : `${winner} wins!`}</p>
                </div>
            ) : (

                <>
                    <div className="items-center w-full ">
                        <Hand title="CPU Hand" hand={cpuHand} isCpu={true} />
                        {cpuMessage && <p className="text-lg my-2">{cpuMessage}</p>}
                        <p className="text-lg mb-6">CPU Score: {cpuScore}</p>
                        <div className="flex items-center justify-center  mt-4">
                        <div className="relative flex items-center justify-center">
                            <div className="w-24 h-32  relative left-[-50%]">
                                <div className="absolute w-24 h-32">
                                    <img src={back} className="opacity-60 w-24 h-32" />
                                    <p className="mt-3 sm:text-md font-bold lg:text-lg text-center">{remainingCards} cards remaining</p>
                                </div>
                            </div>
                        </div>
                        <p className="sm:text-2xl md:text-3xl lg:text-3xl my-6">Current Turn: {currentTurn === "player" ? "Your Turn" : "CPU's Turn"}</p>
                    </div>
                    </div>

                    {playerMessage && <p className="text-lg">{playerMessage}</p>}
                    <Hand title="Your Hand" hand={playerHand} isCpu={false} onCardClick={playerTurn} />
                    <p className="text-xl font-semibold">Your Score: {playerScore}</p>
                </>
            )}
        </div>
    );
}

export default GameContainer;