import { memo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiExclamationTriangle } from 'react-icons/hi2';
import MessageBubble from '../MessageBubble/MessageBubble';
import { Message } from '../types';
import styles from './ChatMessages.module.scss';

interface ChatMessagesProps {
  messages: Message[];
  error: string | null;
  isLoading: boolean;
  onRegenerateResponse: () => void;
  onImageClick: (imageSrc: string) => void;
}

const ChatMessages = memo(
  ({
    messages,
    error,
    isLoading,
    onRegenerateResponse,
    onImageClick,
  }: ChatMessagesProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    };

    // Find the last AI message (non-user message)
    const aiMessages = messages.filter((m) => !m.isUser);
    const latestAiMessage =
      aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null;

    return (
      <motion.div
        className={styles.messagesContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: 0.1,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Error message if applicable */}
        {error && (
          <motion.div
            className={styles.errorMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HiExclamationTriangle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Messages displayed in chronological order */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            id={msg.id}
            content={msg.content}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
            image={msg.image}
            isLatest={!msg.isUser && latestAiMessage?.id === msg.id}
            onRegenerateResponse={onRegenerateResponse}
            onImageClick={onImageClick}
            isLoading={isLoading}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            className={`${styles.message} ${styles.aiMessage} ${styles.loadingMessage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.messageContent}>
              <span className={styles.loadingDot}></span>
              <span className={styles.loadingDot}></span>
              <span className={styles.loadingDot}></span>
            </div>
          </motion.div>
        )}

        {/* Reference for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </motion.div>
    );
  },
);

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;
