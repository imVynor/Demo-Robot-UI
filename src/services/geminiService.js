import { AI_CONFIG } from "../config/aiConfig";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export class GeminiService {
  async generateRobotResponse(audioBase64) {
    let lastError = null;

    for (const model of AI_CONFIG.MODEL_POOL) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

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

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 429 || errorData.error?.message?.toLowerCase().includes("quota") || errorData.error?.message?.toLowerCase().includes("credit")) {
            console.warn(`Model ${model} reached limit, trying next...`);
            lastError = errorData.error?.message;
            continue;
          }
          throw new Error(errorData.error?.message || "Gemini API request failed");
        }

        const data = await response.json();
        const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawResponse) {
          throw new Error("No response generated from Gemini");
        }

        const emotionMatch = rawResponse.match(/^\[(happy|confused|neutral)\]/i);
        const emotion = emotionMatch ? emotionMatch[1].toLowerCase() : "neutral";

        const transcriptMatch = rawResponse.match(/\[TRANSCRIPT:\s*(.*?)\]/i);
        const transcript = transcriptMatch ? transcriptMatch[1].trim() : "Unable to transcribe";

        let botResponse = rawResponse
          .replace(/^\[.*?\]\s*/, "")
          .replace(/\[TRANSCRIPT:.*?\]\s*/i, "")
          .trim();

        if (transcript === "Unable to transcribe" && botResponse.toLowerCase().includes("i heard you say")) {
          const match = botResponse.match(/i heard you say\s*"(.*?)"/i);
          if (match) return { text: botResponse, transcript: match[1], emotion };
        }

        return { text: botResponse, transcript, emotion };
      } catch (error) {
        console.error(`Attempt with model failed:`, error);
        lastError = error.message;
        if (error.message?.toLowerCase().includes("quota") || error.message?.toLowerCase().includes("limit")) {
          continue;
        }
        throw error;
      }
    }

    throw new Error(`Out of credits/quota for all models. Last error: ${lastError}`);
  }
}

export const geminiService = new GeminiService();
