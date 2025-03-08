//this displays the hands of the player and CPU, 
function Hand({ title, hand, isCpu, onCardClick }) {
    return (
        <>
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="relative flex justify-center items-center w-full h-40">
                {hand.map((card, index) => {
                    const offset = (index - (hand.length - 1) / 2) * 30; // Centers cards
                    return (
                        <img
                            key={index}
                            src={isCpu ? "/assets/back.svg" : card.image}
                            alt={card.value}
                            className={`absolute w-24 h-32 ${isCpu ? "" : "transition-transform transform hover:scale-110"}`}
                            style={{
                                transform: `translateX(${offset}px)`, // Centers the cards 
                                zIndex: index
                            }}
                            onClick={() => !isCpu && onCardClick(card.value)} // Clickable only for player's hand
                        />
                    );
                })}
            </div>

        </>
    );
}

export default Hand;
