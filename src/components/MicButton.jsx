import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MicButton = ({ isRecording, onStart, onStop, disabled }) => {
  return (
    <div className="mic-button-container">
      <motion.button
        className={`mic-button ${isRecording ? 'recording' : ''}`}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onClick={isRecording ? onStop : onStart}
        disabled={disabled}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="stop"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div className="stop-icon" />
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {isRecording && (
        <motion.div
          className="recording-pulse"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </div>
  );
};
