import { AI_CONFIG } from "../config/aiConfig";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${AI_CONFIG.GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export class GeminiService {
  /**
   * Generate robot response from audio input.
   * @param {string} audioBase64 - Base64 encoded audio data.
   * @returns {Promise<{text: string, transcript: string}>} - The robot's response and what it heard.
   */
  async generateRobotResponse(audioBase64) {
    try {
      const payload = {
        contents: [
          {
            parts: [
              { text: AI_CONFIG.SYSTEM_PROMPT },
              {
                inlineData: {
                  mimeType: "audio/webm",
                  data: audioBase64
                }
              },
              { text: "Please respond to the audio above. Also, start your response with '[TRANSCRIPT]: ' followed by what you heard the user say, then a newline, then your actual response." }
            ],
          },
        ],
      };

      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Gemini API request failed");
      }

      const data = await response.json();
      const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawResponse) {
        throw new Error("No response generated from Gemini");
      }

      // Parse transcript and actual response
      const transcriptMatch = rawResponse.match(/\[TRANSCRIPT\]:\s*(.*?)\n/i);
      const transcript = transcriptMatch ? transcriptMatch[1].trim() : "Unable to transcribe";
      const botResponse = rawResponse.replace(/\[TRANSCRIPT\]:.*?\n/i, "").trim();

      return { text: botResponse, transcript };
    } catch (error) {
      console.error("Gemini service error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();


