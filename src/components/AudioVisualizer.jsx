import React from 'react';
import { motion } from 'framer-motion';

export const AudioVisualizer = ({ robotState }) => {
  const barVariants = {
    Talking: (i) => ({
      height: [10, 30, 10],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        delay: i * 0.1,
      },
    }),
    Listening: (i) => ({
      height: [10, 20, 10],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
    Idle: { height: 5 },
    Happy: { height: 8 },
    Confused: { height: 5 },
    Thinking: (i) => ({
      scale: [1, 1.5, 1],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1,
        repeat: Infinity,
        delay: i * 0.3,
      },
    })
  };

  if (robotState === 'Thinking') {
    return (
      <div className="visualizer-container">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="thinking-dot"
            custom={i}
            animate="Thinking"
            variants={barVariants}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="visualizer-container">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="visualizer-bar"
          custom={i}
          animate={robotState}
          variants={barVariants}
        />
      ))}
    </div>
  );
};
