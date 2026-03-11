import { useState, useCallback } from "react";
import { audioRecordingService } from "../services/audioRecordingService";
import { geminiService } from "../services/geminiService";
import { ttsService } from "../services/ttsService";

export const useVoiceInteraction = (onStateChange) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState([]);

  /**
   * Start voice interaction using MediaRecorder + Gemini Audio.
   */
  const startVoiceInteraction = useCallback(async () => {
    try {
      setError(null);
      setIsRecording(true);
      if (onStateChange) onStateChange("Listening");

      // 1. Start recording audio
      await audioRecordingService.start();

      // We'll wait for the user to click the button again to stop,
      // or we could implement a silence detector here too.
      // For now, let's stick to the button-controlled stop as seen in MicButton.
    } catch (err) {
      console.error("Voice interaction error (start):", err);
      setIsRecording(false);
      setError("Unable to access microphone.");
      if (onStateChange) onStateChange("Idle");
    }
  }, [onStateChange]);

  /**
   * Stop recording and process the interaction.
   */
  const stopVoiceInteraction = useCallback(async () => {
    try {
      setIsRecording(false);
      if (onStateChange) onStateChange("Thinking");

      // 1. Get audio data (base64)
      const audioBase64 = await audioRecordingService.stop();

      // 2. Send to Gemini for multimodal response
      const { text: robotResponse, transcript: userTranscript } =
        await geminiService.generateRobotResponse(audioBase64);

      // 3. Update conversation history
      setConversation((prev) => [
        ...prev,
        { role: "user", text: userTranscript },
        { role: "robot", text: robotResponse }
      ]);

      // 4. Send to TTS for speech synthesis
      if (onStateChange) onStateChange("Talking");
      const audioUrl = await ttsService.synthesizeSpeech(robotResponse);

      // 5. Play audio and wait for it to finish
      await ttsService.playAudio(audioUrl);

      // 6. Return to Idle
      if (onStateChange) onStateChange("Idle");
    } catch (err) {
      console.error("Voice interaction error (stop):", err);
      setError("Sorry, I couldn't process that. Please try again.");
      if (onStateChange) onStateChange("Idle");
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

