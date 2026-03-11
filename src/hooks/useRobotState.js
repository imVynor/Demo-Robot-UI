import { useState, useCallback } from "react";

export const useRobotState = () => {
  const [robotState, setRobotState] = useState({ mode: "Idle", emotion: "neutral" });

  const transitionTo = useCallback((nextState) => {
    setRobotState(prev => ({
      ...prev,
      ...(typeof nextState === 'string' ? { mode: nextState } : nextState)
    }));
  }, []);

  return {
    robotState,
    transitionTo,
  };
};
