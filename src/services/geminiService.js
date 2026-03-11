import { AI_CONFIG } from "../config/aiConfig";
import { Bytez } from "bytez.js";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BYTEZ_API_KEY = import.meta.env.VITE_BYTEZ_API_KEY;

export class GeminiService {
  constructor() {
    this.bytez = new Bytez(BYTEZ_API_KEY);
  }

  async generateRobotResponse(audioBase64) {
    let lastError = null;

    // 1. Try Gemini Models first
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
          lastError = errorData.error?.message || "Gemini API request failed";
          console.warn(`Model ${model} failed: ${lastError}. Trying next...`);
        } else {
          const data = await response.json();
          const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (rawResponse) {
            return this._parseResponse(rawResponse);
          }
          lastError = "No response generated from Gemini";
        }
      } catch (error) {
        lastError = error.message;
        console.error(`Attempt with Gemini model ${model} failed:`, lastError);
      }
    }

    // 2. Fallback to Bytez API if Gemini fails
    console.warn("All Gemini models failed or reached quota. Falling back to Bytez API...");
    try {
      const model = this.bytez.model("google/gemini-2.5-flash-lite");
      
      const result = await model.run({
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
            ]
          }
        ]
      });

      if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return this._parseResponse(result.candidates[0].content.parts[0].text);
      } else if (typeof result === 'string') {
        return this._parseResponse(result);
      }
      
      throw new Error("Bytez API returned an empty or invalid response");
    } catch (bytezError) {
      console.error("Bytez fallback failed:", bytezError);
      throw new Error(`All AI services failed. Last Gemini error: ${lastError}. Bytez error: ${bytezError.message}`);
    }
  }

  _parseResponse(rawResponse) {
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
  }
}

export const geminiService = new GeminiService();
