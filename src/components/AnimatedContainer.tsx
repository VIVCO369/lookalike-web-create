import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const AnimatedContainer = ({ 
  children, 
  className = "", 
  delay = 0, 
  direction = "up" 
}: AnimatedContainerProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 30 };
      case "down": return { opacity: 0, y: -30 };
      case "left": return { opacity: 0, x: -30 };
      case "right": return { opacity: 0, x: 30 };
      default: return { opacity: 0, y: 30 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case "up": return { opacity: 1, y: 0 };
      case "down": return { opacity: 1, y: 0 };
      case "left": return { opacity: 1, x: 0 };
      case "right": return { opacity: 1, x: 0 };
      default: return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialPosition()}
      animate={getAnimatePosition()}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
