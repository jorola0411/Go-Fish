//this displays the hands of the player and CPU, as well as the score of the player
function Hand({ title, hand, isCpu, onCardClick }) {
    return (
        <div className="my-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex justify-center items-center gap-4">
                {hand.map((card, index) => (
                    <img
                        key={index}
                        src={isCpu ? "https://deckofcardsapi.com/static/img/back.png" : card.image}
                        alt={card.value}
                        className={isCpu ? "w-24 h-32": "cursor-pointer w-24 h-32 transition-transform transform hover:scale-110"}
                        onClick={() => !isCpu && onCardClick(card.value)} // Only clickable if it's the player's hand
                    />
                ))}
            </div>
        </div>
    );
}

export default Hand;
