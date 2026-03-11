import React from 'react';
import { motion } from 'framer-motion';

export const RobotMouth = ({ robotState }) => {
  const mouthVariants = {
    Idle: { scaleY: 1, width: 60, height: 10, borderRadius: 10 },
    Listening: { scaleY: 1, width: 40, height: 40, borderRadius: 20 },
    Thinking: { scaleY: 1, width: 20, height: 10, borderRadius: 5 },
    Talking: { scaleY: [1, 2, 1], width: 60, height: 10, borderRadius: 10 },
    Happy: { scaleY: 1.5, width: 80, height: 30, borderRadius: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
    Confused: { scaleY: 1, width: 30, height: 10, borderRadius: 5, rotate: 10 }
  };

  return (
    <motion.div
      className="mouth"
      animate={robotState}
      variants={mouthVariants}
      transition={robotState === 'Talking' ? {
        scaleY: { duration: 0.2, repeat: Infinity },
        default: { type: "spring", stiffness: 100 }
      } : { type: "spring", stiffness: 100 }}
    />
  );
};
