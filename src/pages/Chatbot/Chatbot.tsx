import { useState, useRef, useEffect, memo, useCallback } from 'react';
import {
  HiMicrophone,
  HiPaperClip,
  HiSquares2X2,
  HiAcademicCap,
  HiBookOpen,
  HiGlobeAlt,
  HiBeaker,
  HiPaperAirplane,
  HiClock,
  HiClipboard,
  HiSpeakerWave,
  HiArrowPath,
  HiHandThumbUp,
  HiHandThumbDown,
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Chatbot.module.scss';
import { History } from '~/components/History/History';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Memoized input container to prevent re-renders and animations
const InputContainer = memo(
  ({
    inChat = false,
    message,
    setMessage,
    handleKeyPress,
    handleSendMessage,
    inputRef,
  }: {
    inChat: boolean;
    message: string;
    setMessage: (value: string) => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleSendMessage: () => void;
    inputRef: React.RefObject<HTMLTextAreaElement>;
  }) => {
    // Only animate on first mount using a constant key
    const animationKey = inChat ? 'chat-input' : 'welcome-input';

    // Function to auto-resize textarea
    const adjustTextareaHeight = useCallback(() => {
      const textarea = inputRef.current;
      if (!textarea) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';

      // Calculate rows based on line height (approximately 24px per line)
      const lineHeight = 24;
      const currentRows = Math.min(
        Math.max(2, Math.ceil(textarea.scrollHeight / lineHeight)),
        5,
      );

      // Set height based on rows needed, capped at 5 rows
      textarea.style.height = `${currentRows * lineHeight}px`;
    }, [inputRef]);

    // Adjust height when message changes
    useEffect(() => {
      adjustTextareaHeight();
    }, [message, adjustTextareaHeight]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    };

    return (
      <motion.div
        key={animationKey}
        className={styles.inputContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: inChat ? 0.3 : 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={{
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
          transition: { duration: 0.2 },
        }}
      >
        <textarea
          ref={inputRef}
          className={styles.messageInput}
          placeholder="Message Your Clever AI Tutor"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          rows={Math.min(Math.max(2, Math.ceil(message.split('\n').length)), 5)}
        />
        <div
          className={`${styles.inputActions} ${inChat ? styles.inChat : ''}`}
        >
          <motion.button
            aria-label="Voice input"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiMicrophone size={20} />
          </motion.button>
          <motion.button
            aria-label="Attach file"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiPaperClip size={20} />
          </motion.button>
          <motion.button
            className={styles.sendButton}
            onClick={handleSendMessage}
            aria-label="Send message"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {inChat ? (
              <HiPaperAirplane size={18} />
            ) : (
              <>
                <span>Send</span>
                <HiPaperAirplane size={18} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

InputContainer.displayName = 'InputContainer';

export function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    // Standard scrolling to bottom with regular column layout
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setIsWelcomeScreen(false);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help! Let me think about your question...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  }, [message]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleSubjectSelect = (subject: string) => {
    const helpText = `Help me with ${subject}`;
    setSelectedSubject(subject);
    setMessage(helpText);

    // Focus the input and place cursor at the end of the text
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Place cursor at the end of the text
        const length = helpText.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }, 50); // Reduced from 100ms to 50ms for faster response
  };

  const subjects = [
    { icon: <HiClock />, label: 'History' },
    { icon: <HiSquares2X2 />, label: 'Math Tutor' },
    { icon: <HiBeaker />, label: 'Physics Guide' },
    { icon: <HiBookOpen />, label: 'Lit Analysis' },
    { icon: <HiGlobeAlt />, label: 'History Insights' },
    { icon: <HiAcademicCap />, label: 'Science Mentor' },
  ];

  const MessageActions = ({ isUser }: { isUser: boolean }) => (
    <div className={styles.messageActions}>
      {!isUser && (
        <>
          <button aria-label="Copy message">
            <HiClipboard size={16} />
          </button>
          <button aria-label="Read aloud">
            <HiSpeakerWave size={16} />
          </button>
          <button aria-label="Regenerate response">
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
  );

  return (
    <div
      className={`${styles.chatContainer} ${
        !isWelcomeScreen ? styles.inChatMode : ''
      }`}
    >
      <History />
      <motion.div
        className={`${styles.chatArea} ${
          !isWelcomeScreen ? styles.inChatMode : ''
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isWelcomeScreen ? (
            <motion.div
              key="welcome"
              className={styles.welcomeScreen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                What can I help with?
              </motion.h1>

              <InputContainer
                inChat={false}
                message={message}
                setMessage={setMessage}
                handleKeyPress={handleKeyPress}
                handleSendMessage={handleSendMessage}
                inputRef={inputRef}
              />

              <div className={styles.subjectButtons}>
                {subjects.map((subject, index) => (
                  <motion.button
                    key={subject.label}
                    className={`${styles.subjectButton} ${
                      selectedSubject === subject.label ? styles.selected : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.05 + index * 0.03,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.15 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubjectSelect(subject.label)}
                  >
                    {subject.icon}
                    {subject.label}
                  </motion.button>
                ))}
              </div>

              <motion.p
                className={styles.disclaimer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                Consider Verifying Important Information To Avoid Errors
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              className={styles.chatScreen}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
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
                {/* Messages displayed in chronological order */}
                {messages.map((msg, index) => {
                  // Find the last AI message (non-user message)
                  const aiMessages = messages.filter((m) => !m.isUser);
                  const latestAiMessage =
                    aiMessages.length > 0
                      ? aiMessages[aiMessages.length - 1]
                      : null;
                  const isLatestAiMessage =
                    !msg.isUser &&
                    latestAiMessage &&
                    msg.id === latestAiMessage.id;

                  return (
                    <motion.div
                      key={msg.id}
                      className={`${styles.message} ${
                        msg.isUser ? styles.userMessage : styles.aiMessage
                      } ${isLatestAiMessage ? styles.latestAiMessage : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1 + index * 0.03,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <div className={styles.messageContent}>{msg.content}</div>
                      <MessageActions isUser={msg.isUser} />
                    </motion.div>
                  );
                })}
                {/* Reference for scrolling to bottom */}
                <div ref={messagesEndRef} />
              </motion.div>

              <div className={styles.chatInputWrapper}>
                <InputContainer
                  inChat={true}
                  message={message}
                  setMessage={setMessage}
                  handleKeyPress={handleKeyPress}
                  handleSendMessage={handleSendMessage}
                  inputRef={inputRef}
                />

                <motion.p
                  className={styles.chatDisclaimer}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  Consider Verifying Important Information To Avoid Errors
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
