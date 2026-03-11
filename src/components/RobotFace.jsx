import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RobotEyes } from './RobotEyes';
import { RobotMouth } from './RobotMouth';
import { RobotGlow } from './RobotGlow';

export const RobotFace = ({ robotState }) => {
  const { mode, emotion } = robotState;

  const headVariants = {
    Idle: { rotate: 0, y: [0, -3, 0] },
    Listening: { rotate: 0, y: 0 },
    Thinking: { rotate: 0, y: -5 },
    Talking: { rotate: emotion === 'confused' ? 5 : 0, y: [0, -2, 0] },
    Happy: { rotate: 0, scale: 1.02, y: [0, -4, 0] },
    Confused: { rotate: 8, y: 0 }
  };

  const headTransition = {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 0.8
  };

  // Determine active animation variant
  const activeVariant = mode === 'Talking' ? 'Talking' :
    (emotion === 'happy' ? 'Happy' :
      (emotion === 'confused' ? 'Confused' : mode));

  return (
    <div className="robot-container">
      <RobotGlow robotState={mode} />
      <motion.div
        className="robot-head"
        animate={activeVariant}
        variants={headVariants}
        transition={mode === 'Talking' || emotion === 'happy' || mode === 'Idle' ? {
          y: { duration: mode === 'Idle' ? 4 : 0.8, repeat: Infinity, ease: "easeInOut" },
          default: headTransition
        } : headTransition}
      >
        <RobotEyes mode={mode} emotion={emotion} />
        <RobotMouth mode={mode} emotion={emotion} />

        <AnimatePresence>
          {emotion === 'confused' && (
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
