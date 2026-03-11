import { useState, useCallback } from "react";

/**
 * Manages the robot's current expression state.
 * Possible states: "Idle", "Listening", "Thinking", "Talking", "Happy", "Confused"
 */
export const useRobotState = () => {
  const [robotState, setRobotState] = useState("Idle");

  const transitionTo = useCallback((nextState) => {
    setRobotState(nextState);
  }, []);

  return {
    robotState,
    transitionTo,
  };
};
