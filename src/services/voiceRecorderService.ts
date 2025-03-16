/**
 * Service for recording audio from the user's microphone
 */
class VoiceRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * Request microphone permission and start recording
   * @returns Promise that resolves when recording starts
   */
  startRecording = async (): Promise<void> => {
    // Reset any existing recordings
    this.audioChunks = [];

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create a new MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(this.stream);

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting voice recording:', error);
      throw new Error('Could not access microphone. Please check permissions.');
    }
  };

  /**
   * Stop recording and return the audio blob
   * @returns Promise that resolves with the recorded audio as a Blob
   */
  stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording found'));
        return;
      }

      // Handle recording stop event
      this.mediaRecorder.onstop = () => {
        // Stop all tracks from the stream
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        // Create audio blob from collected chunks
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
        this.audioChunks = [];
      };

      // Handle errors
      this.mediaRecorder.onerror = (event) => {
        reject(new Error('Recording failed: ' + event.error));
      };

      // Stop the recording
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  };

  /**
   * Cancel recording without returning any data
   */
  cancelRecording = (): void => {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.audioChunks = [];
  };

  /**
   * Check if the browser supports voice recording
   * @returns boolean indicating if recording is supported
   */
  isSupported = (): boolean => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };
}

// Export a singleton instance
export const voiceRecorderService = new VoiceRecorderService();
