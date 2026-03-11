import React from 'react';
import { motion } from 'framer-motion';

export const RobotGlow = ({ robotState }) => {
  const mode = typeof robotState === 'string' ? robotState : (robotState?.mode || "Idle");

  const glowVariants = {
    Idle: { scale: 1, opacity: 0.2, backgroundColor: "#4F9CF9" },
    Listening: { scale: 1.2, opacity: 0.5, backgroundColor: "#7FDBFF" },
    Thinking: { scale: 1.1, opacity: 0.3, backgroundColor: "#4F9CF9" },
    Talking: { scale: 1.3, opacity: 0.6, backgroundColor: "#4F9CF9" },
    Happy: { scale: 1.4, opacity: 0.7, backgroundColor: "#4F9CF9" },
    Confused: { scale: 1, opacity: 0.2, backgroundColor: "#4F9CF9" }
  };

  return (
    <motion.div
      className="glow"
      animate={mode}
      variants={glowVariants}
      transition={{
        scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
        default: { duration: 0.5 }
      }}
    />
  );
};
