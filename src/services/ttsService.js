import { AI_CONFIG } from "../config/aiConfig";

const GOOGLE_TTS_API_KEY = import.meta.env.VITE_GOOGLE_TTS_API_KEY;
const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`;

export class TTSService {

  async synthesizeSpeech(text) {
    try {
      const payload = {
        input: { text },
        voice: {
          languageCode: AI_CONFIG.TTS_LANGUAGE_CODE,
          name: AI_CONFIG.TTS_VOICE,
        },
        audioConfig: {
          audioEncoding: "MP3",
        },
      };

      const response = await fetch(GOOGLE_TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Google Cloud TTS API request failed");
      }

      const data = await response.json();
      const audioContent = data.audioContent;

      if (!audioContent) {
        throw new Error("No audio content generated from Google Cloud TTS");
      }

      return `data:audio/mp3;base64,${audioContent}`;
    } catch (error) {
      console.error("TTS service error:", error);
      throw error;
    }
  }

  async playAudio(audioUrl) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.onended = resolve;
      audio.onerror = reject;
      audio.play().catch(reject);
    });
  }
}

export const ttsService = new TTSService();
