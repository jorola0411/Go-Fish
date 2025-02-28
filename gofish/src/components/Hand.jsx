//this displays the hands of the player and CPU, as well as the score of the player



function Hand() {

const playerHandValues = playerHand.map(card => card.value);
const cpuHandValues = cpuHand.map(card => card.value);
return(
    <div>

        <img src={{uri: cards.image}} className='w-full h-50'></img>
    </div>
)
}
export default Hand;