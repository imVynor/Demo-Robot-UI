import React from 'react';
import { motion } from 'framer-motion';

export const RobotEyes = ({ robotState }) => {
  const eyesVariants = {
    Idle: { scale: 1, y: 0 },
    Listening: { scale: 1.15, y: 0 },
    Thinking: { scale: 1, y: -25 },
    Talking: { scale: 1.05, y: 0 },
    Happy: { scale: 1.1, y: -5 },
    Confused: { scale: 1, y: 0 }
  };

  const pupilWander = {
    x: [0, Math.random() * 10 - 5, 0],
    y: [0, Math.random() * 10 - 5, 0],
  };

  return (
    <motion.div
      className="eyes-container"
      animate={robotState}
      variants={eyesVariants}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <div className="eye">
        <motion.div
          className="pupil"
          animate={{
            ...pupilWander,
            scaleY: [1, 0.1, 1],
          }}
          transition={{
            x: { duration: 5, repeat: Infinity },
            y: { duration: 5, repeat: Infinity },
            scaleY: {
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 3,
            },
          }}
        />
        {robotState === 'Happy' && (
          <motion.div
            className="sparkle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0 }}
          />
        )}
      </div>
      <motion.div 
        className="eye"
        animate={robotState === 'Confused' ? { scaleY: 0.6 } : { scaleY: 1 }}
      >
        <motion.div
          className="pupil"
          animate={{
            ...pupilWander,
            scaleY: [1, 0.1, 1],
          }}
          transition={{
            x: { duration: 5, repeat: Infinity },
            y: { duration: 5, repeat: Infinity },
            scaleY: {
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 4,
            },
          }}
        />
        {robotState === 'Happy' && (
          <motion.div
            className="sparkle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
