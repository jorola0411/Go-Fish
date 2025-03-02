//this displays the hands of the player and CPU, as well as the score of the player
function Hand({ title, hand, isCpu, onCardClick }) {
    return (
        <div className="my-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex gap-2">
                {hand.map((card, index) => (
                    <img 
                        key={index} 
                        src={isCpu ? "https://deckofcardsapi.com/static/img/back.png" : card.image} 
                        alt={card.value} 
                        className="w-16 h-auto cursor-pointer" 
                        onClick={() => !isCpu && onCardClick(card.value)} // Only clickable if it's the player's hand
                    />
                ))}
            </div>
        </div>
    );
}

export default Hand;
