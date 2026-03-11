/**
 * Handles recording audio from the microphone using the MediaRecorder API.
 */
export class AudioRecordingService {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
    }

    /**
     * Start recording audio.
     */
    async start() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.start();
            console.log("[Audio] Recording started...");
        } catch (error) {
            console.error("[Audio] Failed to start recording:", error);
            throw error;
        }
    }

    /**
     * Stop recording and return the audio data as a base64 string.
     * @returns {Promise<string>} Base64 encoded audio string.
     */
    async stop() {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error("No recording in progress"));
                return;
            }

            this.mediaRecorder.onstop = async () => {
                console.log("[Audio] Recording stopped.");
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

                // Clean up stream
                this.stream.getTracks().forEach(track => track.stop());

                // Convert Blob to base64
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    const base64data = reader.result.split(',')[1];
                    resolve(base64data);
                };
                reader.onerror = (e) => reject(e);
            };

            this.mediaRecorder.stop();
        });
    }
}

export const audioRecordingService = new AudioRecordingService();
