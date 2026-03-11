import React from 'react';
import { motion } from 'framer-motion';

export const RobotMouth = ({ robotState }) => {
  // SVG Path definitions for different expressions
  const paths = {
    Idle: "M 15 20 Q 30 22 45 20",
    Listening: "M 15 20 Q 30 20 45 20",
    Thinking: "M 20 20 Q 30 20 40 20",
    Talking: [
      "M 15 20 Q 30 22 45 20", // Neutral
      "M 14 20 Q 30 26 46 20", // Open
      "M 15 20 Q 30 22 45 20", // Neutral
      "M 14.5 20 Q 30 24 45.5 20", // Mid-Open
      "M 15 20 Q 30 22 45 20"  // Neutral
    ],
    Happy: "M 10 15 Q 30 35 50 15",
    Confused: "M 15 25 Q 30 20 45 30"
  };

  return (
    <div className="mouth-container">
      <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d={robotState === 'Talking' ? undefined : (paths[robotState] || paths.Idle)}
          animate={robotState === 'Talking' ? { d: paths.Talking } : { d: paths[robotState] || paths.Idle }}
          transition={robotState === 'Talking' ? {
            d: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
          } : {
            type: "spring", stiffness: 100, damping: 15
          }}
          stroke="#4F9CF9"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
