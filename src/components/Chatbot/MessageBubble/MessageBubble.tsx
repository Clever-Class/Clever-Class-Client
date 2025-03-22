import { memo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiClipboard,
  HiSpeakerWave,
  HiSpeakerXMark,
  HiArrowPath,
  HiHandThumbUp,
  HiHandThumbDown,
} from 'react-icons/hi2';
import { FormattedMessage } from '~/components/FormattedMessage/FormattedMessage';
import { Message } from '../types';
import toast from 'react-hot-toast';
import styles from './MessageBubble.module.scss';

interface MessageBubbleProps extends Omit<Message, 'timestamp'> {
  isLatest?: boolean;
  isPlaying?: boolean; // External control of playing state
  onRegenerateResponse: () => void;
  onImageClick: (imageSrc: string) => void;
  onPlayStateChange?: (isPlaying: boolean) => void; // Callback when play state changes
  isLoading: boolean;
  isNew?: boolean; // Flag to indicate if this message is new (just arrived)
  isStreaming?: boolean;
}

const MessageBubble = memo(
  ({
    id,
    content,
    isUser,
    image,
    audio,
    isLatest = false,
    isPlaying: externalIsPlaying,
    onRegenerateResponse,
    onImageClick,
    onPlayStateChange,
    isLoading,
    isNew = false,
    isStreaming = false,
  }: MessageBubbleProps) => {
    const [internalIsPlaying, setInternalIsPlaying] = useState(false);
    const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const playingRef = useRef(false); // Track playing state in a ref to avoid race conditions

    // Use the external playing state if provided, otherwise use internal state
    const isPlaying =
      externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

    // Synchronize ref with state for immediate access
    useEffect(() => {
      playingRef.current = isPlaying;
    }, [isPlaying]);

    // Create audio element when component mounts with audio data
    useEffect(() => {
      if (audioRef.current && audio) {
        audioRef.current.src = `data:audio/mp3;base64,${audio}`;
        audioRef.current.loop = false; // Ensure audio doesn't loop

        // Event listeners
        const handleEnded = () => {
          playingRef.current = false;
          setInternalIsPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
        };

        const handlePlay = () => {
          if (!playingRef.current) {
            playingRef.current = true;
            setInternalIsPlaying(true);
            if (onPlayStateChange) onPlayStateChange(true);
          }
        };

        const handlePause = () => {
          playingRef.current = false;
          setInternalIsPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
        };

        // Add all event listeners
        audioRef.current.addEventListener('ended', handleEnded);
        audioRef.current.addEventListener('play', handlePlay);
        audioRef.current.addEventListener('pause', handlePause);

        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('ended', handleEnded);
            audioRef.current.removeEventListener('play', handlePlay);
            audioRef.current.removeEventListener('pause', handlePause);
          }
        };
      }
    }, [audio, onPlayStateChange]);

    // Auto-play audio when it's a new message with audio, but only once
    useEffect(() => {
      // Use a one-time flag to ensure this only happens once per component instance
      if (
        isNew &&
        audio &&
        !isUser &&
        audioRef.current &&
        !hasAutoPlayed &&
        !playingRef.current // Use ref for immediate state access
      ) {
        setHasAutoPlayed(true); // Mark as auto-played to prevent replay

        // Set a small timeout to prevent race conditions with other audio elements
        setTimeout(() => {
          if (audioRef.current) {
            // Pause any other playing audios first
            document.querySelectorAll('audio').forEach((audio) => {
              if (audio !== audioRef.current && !audio.paused) {
                audio.pause();
              }
            });

            // Play this audio once
            audioRef.current.currentTime = 0; // Start from beginning
            audioRef.current.loop = false;
            audioRef.current.play().catch((error) => {
              console.error('Error auto-playing audio:', error);
            });
          }
        }, 50);
      }
    }, [isNew, audio, isUser, hasAutoPlayed]);

    // Handle external control of playback
    useEffect(() => {
      if (audioRef.current && audio) {
        if (externalIsPlaying !== undefined) {
          const isAudioPlaying = !audioRef.current.paused;
          if (externalIsPlaying && !isAudioPlaying) {
            audioRef.current.currentTime = 0; // Start from beginning
            audioRef.current.play().catch((error) => {
              console.error(
                'Error playing audio from external control:',
                error,
              );
            });
          } else if (!externalIsPlaying && isAudioPlaying) {
            audioRef.current.pause();
          }
        }
      }
    }, [externalIsPlaying, audio]);

    const handleCopyMessage = () => {
      navigator.clipboard.writeText(content);
      toast.success('Message copied to clipboard');
    };

    const handlePlayAudio = () => {
      if (!audio || !audioRef.current) return;

      const currentlyPlaying = !audioRef.current.paused;

      // If playing, pause it
      if (currentlyPlaying) {
        audioRef.current.pause();
        // State updates will happen through the pause event listener
      }
      // If paused, play it
      else {
        // Pause any other playing audios first
        document.querySelectorAll('audio').forEach((audio) => {
          if (audio !== audioRef.current && !audio.paused) {
            audio.pause();
          }
        });

        // If it was ended, restart from beginning
        if (
          audioRef.current.ended ||
          audioRef.current.currentTime >= audioRef.current.duration - 0.1
        ) {
          audioRef.current.currentTime = 0;
        }

        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
          toast.error('Failed to play audio');
        });
        // State updates will happen through the play event listener
      }
    };

    return (
      <motion.div
        className={`${styles.message} ${
          isUser ? styles.userMessage : styles.aiMessage
        } ${isLatest && !isUser ? styles.latestAiMessage : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.1,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <div className={styles.messageContent}>
          <FormattedMessage
            content={content}
            className={isStreaming ? styles.streaming : ''}
          />
          {image && (
            <div
              className={styles.messageImage}
              onClick={() => onImageClick(image)}
            >
              <img src={image} alt="Attached" />
            </div>
          )}
        </div>

        <div className={styles.messageActions}>
          {!isUser && (
            <>
              <button aria-label="Copy message" onClick={handleCopyMessage}>
                <HiClipboard size={16} />
              </button>
              {audio && (
                <motion.button
                  aria-label={isPlaying ? 'Pause audio' : 'Read aloud'}
                  onClick={handlePlayAudio}
                  animate={{
                    scale: isPlaying ? [1, 1.05, 1] : 1,
                    boxShadow: isPlaying
                      ? [
                          '0 0 0 0 rgba(37, 99, 255, 0)',
                          '0 0 0 4px rgba(37, 99, 255, 0.3)',
                          '0 0 0 0 rgba(37, 99, 255, 0)',
                        ]
                      : '0 0 0 0 rgba(37, 99, 255, 0)',
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isPlaying ? Infinity : 0,
                    repeatType: 'loop',
                  }}
                  className={isPlaying ? styles.playing : ''}
                >
                  {isPlaying ? (
                    <HiSpeakerWave size={16} />
                  ) : (
                    <HiSpeakerWave size={16} />
                  )}
                </motion.button>
              )}
              <button
                aria-label="Regenerate response"
                onClick={onRegenerateResponse}
                disabled={isLoading}
              >
                <HiArrowPath size={16} />
              </button>
              <div className={styles.feedback}>
                <button aria-label="Like">
                  <HiHandThumbUp size={16} />
                </button>
                <button aria-label="Dislike">
                  <HiHandThumbDown size={16} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} className={styles.audioElement} />
      </motion.div>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
