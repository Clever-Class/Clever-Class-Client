import { useState, useEffect, useCallback } from 'react';
import {
  HiMicrophone,
  HiStop,
  HiXMark,
  HiPaperAirplane,
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { voiceRecorderService } from '~/services/voiceRecorderService';
import styles from './VoiceRecorder.module.scss';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isLoading?: boolean;
}

export const VoiceRecorder = ({
  onRecordingComplete,
  isLoading,
}: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Check if voice recording is supported
  useEffect(() => {
    setIsSupported(voiceRecorderService.isSupported());
  }, []);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      setTimerInterval(interval);

      return () => {
        clearInterval(interval);
        setTimerInterval(null);
      };
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setRecordingDuration(0);
    }
  }, [isRecording]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (isLoading) return;

    try {
      await voiceRecorderService.startRecording();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Could not access microphone');
    }
  }, [isLoading]);

  // Stop recording and process the audio
  const stopRecording = useCallback(async () => {
    try {
      const audioBlob = await voiceRecorderService.stopRecording();
      setIsRecording(false);
      onRecordingComplete(audioBlob);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      toast.error('Failed to process recording');
      setIsRecording(false);
    }
  }, [onRecordingComplete]);

  // Cancel recording without processing
  const cancelRecording = useCallback(() => {
    voiceRecorderService.cancelRecording();
    setIsRecording(false);
    toast('Recording canceled', { icon: '🚫' });
  }, []);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <motion.button
        className={styles.micButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          toast.error('Voice recording is not supported in your browser')
        }
        disabled={isLoading}
        aria-label="Voice input (not supported)"
      >
        <HiMicrophone size={18} />
      </motion.button>
    );
  }

  return (
    <>
      <motion.button
        className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startRecording}
        disabled={isRecording || isLoading}
        aria-label="Start voice recording"
      >
        <HiMicrophone size={18} />
      </motion.button>

      {/* Recording overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className={styles.recordingOverlay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.recordingVisualizer}>
              <div
                className={styles.visualizerBar}
                style={{
                  height: `${Math.max(30, 30 + audioLevel * 50)}px`,
                }}
              />
            </div>

            <div className={styles.recordingInfo}>
              <div className={styles.recordingStatus}>
                <span className={styles.recordingIndicator} />
                <span>Recording</span>
              </div>
              <div className={styles.recordingTimer}>
                {formatTime(recordingDuration)}
              </div>
            </div>

            <div className={styles.recordingActions}>
              <motion.button
                className={styles.cancelButton}
                onClick={cancelRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Cancel recording"
              >
                <HiXMark size={18} />
              </motion.button>

              <motion.button
                className={styles.stopButton}
                onClick={stopRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Stop and send recording"
              >
                <HiPaperAirplane size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceRecorder;
