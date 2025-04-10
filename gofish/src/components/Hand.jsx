import { motion } from 'framer-motion';
import back from "/src/assets/back.svg"

function Hand({ title, hand, isCpu, onCardClick, newCards = [] }) {
  // Animation variants for cards
  const cardVariants = {
    initial: (custom) => ({
      x: custom.offset,
      y: -200,
      opacity: 0,
      rotateY: isCpu ? 180 : 0,
    }),
    animate: (custom) => ({
      x: custom.offset,
      y: 0,
      opacity: 1,
      rotateY: isCpu ? 180 : 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: custom.index * 0.1, // Stagger the animations
      }
    }),
    exit: {
      y: isCpu ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3 }
    },
    highlight: {
      scale: 1.2,
      y: isCpu ? -10 : 10,
      boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="relative h-40 flex justify-center items-center">
        {hand.map((card, index) => {
          const offset = (index - (hand.length - 1) / 2) * 30; // Centers cards
          const isNewCard = newCards.some(newCard => 
            newCard.code === card.code || newCard.value === card.value
          );
          
          return (
            <motion.img
              key={`${card.code}-${index}`}
              src={isCpu ?  back : card.image}
              alt={isCpu ? "Card back" : card.value}
              className={`absolute w-24 h-32 ${isCpu ? "" : "cursor-pointer hover:scale-110"}`}
              style={{ zIndex: index }}
              variants={cardVariants}
              initial="initial"
              animate={isNewCard ? ["animate", "highlight"] : "animate"}
              custom={{ 
                offset,
                index,
                isNew: isNewCard
              }}
              onClick={() => !isCpu && onCardClick(card.value)} // Clickable only for player's hand
            />
          );
        })}
      </div>
    </div>
  );
}

export default Hand;