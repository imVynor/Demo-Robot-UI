import { useState, useCallback } from "react";
import { audioRecordingService } from "../services/audioRecordingService";
import { geminiService } from "../services/geminiService";
import { ttsService } from "../services/ttsService";

export const useVoiceInteraction = (onStateChange) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState([]);

  const startVoiceInteraction = useCallback(async () => {
    try {
      setError(null);
      setIsRecording(true);
      if (onStateChange) onStateChange({ mode: "Listening" });

      
      await audioRecordingService.start();

      
      
      
    } catch (err) {
      console.error("Voice interaction error (start):", err);
      setIsRecording(false);
      setError("Unable to access microphone.");
      if (onStateChange) onStateChange({ mode: "Idle" });
    }
  }, [onStateChange]);

  const stopVoiceInteraction = useCallback(async () => {
    try {
      setIsRecording(false);
      if (onStateChange) onStateChange({ mode: "Thinking" });

      
      const audioBase64 = await audioRecordingService.stop();

      
      const { text: robotResponse, transcript: userTranscript, emotion } =
        await geminiService.generateRobotResponse(audioBase64);

      
      setConversation((prev) => [
        ...prev,
        { role: "user", text: userTranscript },
        { role: "robot", text: robotResponse, emotion }
      ]);

      
      
      if (onStateChange) onStateChange({ mode: "Talking", emotion });

      const audioUrl = await ttsService.synthesizeSpeech(robotResponse);

      
      await ttsService.playAudio(audioUrl);

      
      if (onStateChange) onStateChange({ mode: "Idle", emotion: "neutral" });
    } catch (err) {
      console.error("Voice interaction error (stop):", err);
      setError("Sorry, I couldn't process that. Please try again.");
      if (onStateChange) onStateChange({ mode: "Idle" });
    }
  }, [onStateChange]);

  return {
    isRecording,
    startVoiceInteraction,
    stopVoiceInteraction,
    error,
    conversation,
  };
};

