//this holds the entire game
//PLACEHOLDER
import useInitGame from "../gameplay/startGame";
import Hand from './Hand'; 

function GameContainer() {
    const { playerHand, cpuHand } = useInitGame(); 

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center">Go Fish!</h1>
            
            {/* Hands */}
            <Hand title="CPU Hand" hand={cpuHand} isCpu={true} />
            <Hand title="Your Hand" hand={playerHand} isCpu={false} />
            
        </div>
    );
}

export default GameContainer;
