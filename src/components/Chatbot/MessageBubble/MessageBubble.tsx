import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  HiClipboard,
  HiSpeakerWave,
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
  onRegenerateResponse: () => void;
  onImageClick: (imageSrc: string) => void;
  isLoading: boolean;
}

const MessageBubble = memo(
  ({
    id,
    content,
    isUser,
    image,
    isLatest = false,
    onRegenerateResponse,
    onImageClick,
    isLoading,
  }: MessageBubbleProps) => {
    const handleCopyMessage = () => {
      navigator.clipboard.writeText(content);
      toast.success('Message copied to clipboard');
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
          <FormattedMessage content={content} />
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
              <button aria-label="Read aloud">
                <HiSpeakerWave size={16} />
              </button>
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
      </motion.div>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
