import React from 'react';
import { motion } from 'framer-motion';

export const RobotMouth = ({ mode, emotion }) => {
  // SVG Path definitions for different expressions
  const paths = {
    neutral: "M 15 20 Q 30 22 45 20",
    happy: "M 10 15 Q 30 35 50 15",
    confused: "M 15 25 Q 30 20 45 30",
    Listening: "M 15 20 Q 30 20 45 20",
    Thinking: "M 20 20 Q 30 20 40 20",
  };

  // More realistic talking paths - a sequence of mouth shapes
  const talkingPaths = {
    neutral: [
      "M 15 20 Q 30 22 45 20", // Mid
      "M 13 20 Q 30 30 47 20", // Wide open
      "M 15 20 Q 30 20 45 20", // Flat
      "M 14 20 Q 30 25 46 20", // Open
      "M 15 20 Q 30 22 45 20", // Mid
      "M 18 20 Q 30 20 42 20", // Pucker
    ],
    happy: [
      "M 10 15 Q 30 35 50 15", // Wide smile
      "M 10 18 Q 30 42 50 18", // Big open smile
      "M 10 15 Q 30 35 50 15", // Smile
      "M 12 18 Q 30 38 48 18", // Mid open smile
      "M 10 15 Q 30 35 50 15", // Smile
    ],
    confused: [
      "M 15 25 Q 30 20 45 30", // Tilted frown
      "M 14 26 Q 30 28 46 24", // Open tilted
      "M 15 25 Q 30 20 45 30", // Tilted frown
      "M 16 24 Q 30 22 44 26", // Smaller tilted
    ]
  };

  const currentEmotion = emotion || 'neutral';
  const isTalking = mode === 'Talking';

  return (
    <div className="mouth-container">
      <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d={isTalking ? undefined : (paths[currentEmotion] || paths[mode] || paths.neutral)}
          animate={isTalking ? { d: talkingPaths[currentEmotion] || talkingPaths.neutral } : { d: paths[currentEmotion] || paths[mode] || paths.neutral }}
          transition={isTalking ? {
            d: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
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
