//this displays the hands of the player and CPU, as well as the score of the player
function Hand({title, hand, isCpu}) {

    return (
        <div>
            <div className="flex gap-3">
                <h2 className="font-bold">{title}</h2>
                {hand.map((card, index) => (
                    <img key={index} src={isCpu ? "https://deckofcardsapi.com/static/img/back.png" : card.image} className="w-16 h-auto" />
                ))}
            </div>

        </div>
    )
}
export default Hand;