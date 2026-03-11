/**
 * Handles browser-based speech recognition using the Web Speech API.
 *
 * A fresh SpeechRecognition instance is created on every listen() call —
 * browsers don't reliably allow reuse of a stopped instance.
 * A `settled` flag prevents the double-resolve race caused by stop() → onend.
 * The 2-second silence timer only starts after the first speech arrives.
 */

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export class SpeechRecognitionService {
  constructor() {
    this._activeRecognition = null;
    this._silenceTimer = null;
  }

  /**
   * Start listening for voice input.
   * Waits for 2 seconds of silence after the last detected speech, then resolves.
   * @returns {Promise<string>} The transcribed text.
   */
  listen() {
    return new Promise((resolve, reject) => {
      if (!SpeechRecognitionAPI) {
        reject(new Error("Speech Recognition not supported in this browser."));
        return;
      }

      // Abort any previous session cleanly before starting a new one
      this._abortCurrent();

      let finalTranscript = "";
      let settled = false; // Prevents double-resolve/reject

      const done = (transcript) => {
        if (settled) return;
        settled = true;
        this._clearSilenceTimer();
        // Stop the recognition — this will fire onend, but settled=true guards it
        try { recognition.stop(); } catch (_) { }
        this._activeRecognition = null;
        resolve(transcript.trim());
      };

      const fail = (err) => {
        if (settled) return;
        settled = true;
        this._clearSilenceTimer();
        try { recognition.stop(); } catch (_) { }
        this._activeRecognition = null;
        reject(err);
      };

      const resetSilenceTimer = () => {
        this._clearSilenceTimer();
        this._silenceTimer = setTimeout(() => {
          console.log("[Speech] Silence timeout — finalizing transcript.");
          done(finalTranscript);
        }, 2000); // 2 seconds of silence = done speaking
      };

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      this._activeRecognition = recognition;

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        console.log("[Speech] Transcript so far:", finalTranscript.trim());
        // Reset silence timer on every speech chunk (final or interim)
        resetSilenceTimer();
      };

      recognition.onerror = (event) => {
        console.error("[Speech] Error:", event.error);
        if (event.error === "no-speech") {
          // If we already have something, just finish — don't error
          if (finalTranscript.trim()) {
            done(finalTranscript);
          } else {
            fail(new Error("no-speech"));
          }
        } else if (event.error === "aborted") {
          // Intentionally aborted (e.g. stop() called) — not an error
          if (finalTranscript.trim()) done(finalTranscript);
          // else just let it settle silently
        } else {
          fail(new Error(event.error));
        }
      };

      recognition.onend = () => {
        console.log("[Speech] Recognition ended.");
        // If ended unexpectedly (e.g. browser timeout), resolve with what we have
        done(finalTranscript);
      };

      recognition.start();
      console.log("[Speech] Listening...");
    });
  }

  /**
   * Manually stop listening and resolve with whatever was captured so far.
   */
  stop() {
    this._abortCurrent();
  }

  /** @private */
  _abortCurrent() {
    this._clearSilenceTimer();
    if (this._activeRecognition) {
      try { this._activeRecognition.abort(); } catch (_) { }
      this._activeRecognition = null;
    }
  }

  /** @private */
  _clearSilenceTimer() {
    if (this._silenceTimer) {
      clearTimeout(this._silenceTimer);
      this._silenceTimer = null;
    }
  }
}

export const speechService = new SpeechRecognitionService();
