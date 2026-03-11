const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export class SpeechRecognitionService {
  constructor() {
    this._activeRecognition = null;
    this._silenceTimer = null;
  }

  listen() {
    return new Promise((resolve, reject) => {
      if (!SpeechRecognitionAPI) {
        reject(new Error("Speech Recognition not supported in this browser."));
        return;
      }

      
      this._abortCurrent();

      let finalTranscript = "";
      let settled = false; 

      const done = (transcript) => {
        if (settled) return;
        settled = true;
        this._clearSilenceTimer();
        
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
        }, 2000); 
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
        
        resetSilenceTimer();
      };

      recognition.onerror = (event) => {
        console.error("[Speech] Error:", event.error);
        if (event.error === "no-speech") {
          
          if (finalTranscript.trim()) {
            done(finalTranscript);
          } else {
            fail(new Error("no-speech"));
          }
        } else if (event.error === "aborted") {
          
          if (finalTranscript.trim()) done(finalTranscript);
          
        } else {
          fail(new Error(event.error));
        }
      };

      recognition.onend = () => {
        console.log("[Speech] Recognition ended.");
        
        done(finalTranscript);
      };

      recognition.start();
      console.log("[Speech] Listening...");
    });
  }


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
