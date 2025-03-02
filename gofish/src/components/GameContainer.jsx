import { useState } from "react";
import useInitGame from "../gameplay/startGame";
import useTurns from "../gameplay/Turns";
import Hand from "./Hand";

function GameContainer() {
    const { playerHand, setPlayerHand, cpuHand, setCpuHand, deckId, remainingCards, setRemainingCards, gameStart, startGame } = useInitGame();

    // Pass game state to useTurns
    const { currentTurn, playerTurn, cpuTurn } = useTurns({ 
        playerHand, 
        setPlayerHand, 
        cpuHand, 
        setCpuHand, 
        deckId, 
        remainingCards, 
        setRemainingCards 
    });

    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold">Go Fish!</h1>

            {!gameStart ? (
                <button 
                    onClick={startGame} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Start Game
                </button>
            ) : (
                <>
                    <Hand title="Your Hand" hand={playerHand} isCpu={false} onCardClick={playerTurn} />
                    <Hand title="CPU Hand" hand={cpuHand} isCpu={true} />
                    <p className="mt-4">Current Turn: {currentTurn === "player" ? "Your Turn" : "CPU's Turn"}</p>
                </>
            )}
        </div>
    );
}

export default GameContainer;
