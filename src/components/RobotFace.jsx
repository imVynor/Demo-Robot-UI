import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RobotEyes } from './RobotEyes';
import { RobotMouth } from './RobotMouth';
import { RobotGlow } from './RobotGlow';

export const RobotFace = ({ robotState }) => {
  const headVariants = {
    Idle: { rotate: 0, y: 0 },
    Listening: { rotate: -5, y: 0 },
    Thinking: { rotate: 0, y: -10 },
    Talking: { rotate: 0, y: [0, -5, 0] },
    Happy: { rotate: 0, scale: 1.05, y: [0, -10, 0] },
    Confused: { rotate: 10, y: 0 }
  };

  return (
    <div className="robot-container">
      <RobotGlow robotState={robotState} />
      <motion.div
        className="robot-head"
        animate={robotState}
        variants={headVariants}
        transition={robotState === 'Talking' || robotState === 'Happy' ? {
          y: { duration: 0.5, repeat: Infinity },
          default: { type: "spring", stiffness: 100 }
        } : { type: "spring", stiffness: 100 }}
      >
        <RobotEyes robotState={robotState} />
        <RobotMouth robotState={robotState} />
        
        <AnimatePresence>
          {robotState === 'Confused' && (
            <motion.div
              className="question-mark-container"
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1.2, y: -80 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <span className="question-mark">?</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
