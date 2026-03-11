import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export const RobotEyes = ({ mode, emotion }) => {
  const [isInteractive, setIsInteractive] = useState(window.innerWidth > 768);

  
  const springConfig = { stiffness: 150, damping: 20 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleResize = () => setIsInteractive(window.innerWidth > 768);
    const handleMouseMove = (e) => {
      if (mode === 'Idle' && isInteractive) {
        
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;

        
        mouseX.set(x * 20);
        mouseY.set(y * 20);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode, isInteractive, mouseX, mouseY]);

  const eyesVariants = {
    neutral: { scale: 1, y: 0 },
    happy: { scale: 1.1, y: -5 },
    confused: { scale: 1, y: 0 }
  };

  const eyebrowVariantsLeft = {
    neutral: { y: 0, rotate: 0, opacity: 1 },
    happy: { y: -10, rotate: -15, opacity: 1 },
    confused: { y: -15, rotate: -10, opacity: 1 },
    Thinking: { y: -5, rotate: 5, opacity: 1 }
  };

  const eyebrowVariantsRight = {
    neutral: { y: 0, rotate: 0, opacity: 1 },
    happy: { y: -10, rotate: 15, opacity: 1 },
    confused: { y: 5, rotate: 10, opacity: 1 },
    Thinking: { y: -5, rotate: -5, opacity: 1 }
  };

  const modeVariants = {
    Listening: { scale: 1.15 },
    Thinking: { y: -25 },
    Talking: { scale: 1.05 }
  };

  return (
    <motion.div
      className="eyes-container"
      animate={emotion}
      variants={eyesVariants}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      {/* Left Eye Wrapper */}
      <div className="eye-wrapper">
        <motion.div
          className="eyebrow"
          animate={mode === 'Thinking' ? 'Thinking' : emotion}
          variants={eyebrowVariantsLeft}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        />
        <motion.div
          className="eye"
          animate={mode === 'Thinking' ? modeVariants.Thinking : {}}
        >
          <motion.div
            className="pupil"
            style={{ x: mouseX, y: mouseY }}
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              scaleY: {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 3,
              },
            }}
          />
          {emotion === 'happy' && (
            <motion.div
              className="sparkle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0 }}
            />
          )}
        </motion.div>
      </div>

      {/* Right Eye Wrapper */}
      <div className="eye-wrapper">
        <motion.div
          className="eyebrow"
          animate={mode === 'Thinking' ? 'Thinking' : emotion}
          variants={eyebrowVariantsRight}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        />
        <motion.div
          className="eye"
          animate={{
            ...(mode === 'Thinking' ? modeVariants.Thinking : {}),
            ...(emotion === 'confused' ? { scaleY: 0.6 } : { scaleY: 1 })
          }}
        >
          <motion.div
            className="pupil"
            style={{ x: mouseX, y: mouseY }}
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              scaleY: {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 4,
              },
            }}
          />
          {emotion === 'happy' && (
            <motion.div
              className="sparkle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0 }}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
