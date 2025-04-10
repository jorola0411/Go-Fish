// reusable card animation component
import { motion } from 'framer-motion';
import back from "/src/assets/back.svg"
const AnimatedCard = ({ card, index, isCpu, onClick, style, variants, initial, animate, custom, transition }) => {
  return (
    <motion.img
      key={index}
      src={isCpu ? back : card.image}
      alt={isCpu ? "Card back" : card.value}
      className={`absolute w-24 h-32 ${isCpu ? "" : "cursor-pointer hover:scale-110"}`}
      style={style}
      variants={variants}
      initial={initial}
      animate={animate}
      custom={custom}
      transition={transition}
      onClick={onClick}
    />
  );
};

export default AnimatedCard;