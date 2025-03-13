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
  HiExclamationTriangle,
  HiChatBubbleLeftRight,
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Chatbot.module.scss';
import { History } from '~/components/History/History';
import {
  chatService,
  ChatMessage as ChatMessageType,
  Conversation,
} from '~/services/chatService';
import toast from 'react-hot-toast';

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
    isLoading,
  }: {
    inChat: boolean;
    message: string;
    setMessage: (value: string) => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleSendMessage: () => void;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    isLoading?: boolean;
  }) => {
    // Only animate on first mount using a constant key
    const animationKey = inChat ? 'chat-input' : 'welcome-input';

    // Function to auto-resize textarea
    const adjustTextareaHeight = useCallback(() => {
      const textarea = inputRef.current;
      if (!textarea) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';

      // Different calculations based on if we're in chat mode or welcome screen
      if (inChat) {
        // For chat mode (single row layout): use smaller line height and fewer max rows
        const lineHeight = 18;
        const currentRows = Math.min(
          Math.max(1, Math.ceil(textarea.scrollHeight / lineHeight)),
          6,
        );
        textarea.style.height = `${currentRows * lineHeight}px`;
      } else {
        // For welcome screen (stacked layout): use taller line height and more max rows
        const lineHeight = 19;
        const currentRows = Math.min(
          Math.max(2, Math.ceil(textarea.scrollHeight / lineHeight)),
          4,
        );
        textarea.style.height = `${currentRows * lineHeight}px`;
      }
    }, [inputRef, inChat]);

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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: inChat ? 0.2 : 0.15,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={{
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          transition: { duration: 0.2 },
        }}
      >
        <textarea
          ref={inputRef}
          className={styles.messageInput}
          placeholder={
            inChat ? 'Type your message...' : 'Message Your Clever AI Tutor'
          }
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          rows={
            inChat
              ? 1
              : Math.min(Math.max(2, Math.ceil(message.split('\n').length)), 4)
          }
          disabled={isLoading}
        />
        <div
          className={`${styles.inputActions} ${inChat ? styles.inChat : ''}`}
        >
          <motion.button
            aria-label="Voice input"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiMicrophone size={18} />
          </motion.button>
          <motion.button
            aria-label="Attach file"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiPaperClip size={18} />
          </motion.button>
          <motion.button
            className={styles.sendButton}
            onClick={handleSendMessage}
            aria-label="Send message"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || !message.trim()}
          >
            {inChat ? (
              <HiPaperAirplane size={16} />
            ) : (
              <>
                <span>Send</span>
                <HiPaperAirplane size={16} />
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
    console.log('Fetching conversations on mount');
  }, []);

  // Fetch conversations from the API
  const fetchConversations = async () => {
    try {
      console.log('Attempting to fetch conversations...');
      setIsLoading(true);
      const conversationsData = await chatService.getConversations();
      console.log('Conversations fetched:', conversationsData);
      setConversations(conversationsData);
    } catch (err: any) {
      console.error('Failed to fetch conversations:', err);
      // Show error toast if the user is logged in (expected to be logged in on this page)
      if (err.message !== 'User not authenticated') {
        toast.error('Failed to fetch conversation history');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load conversation messages when a conversation is selected
  const loadConversation = async (conversationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const messagesData = await chatService.getConversationMessages(
        conversationId,
      );

      // Convert API messages to our local format
      const formattedMessages: Message[] = messagesData.map((msg) => ({
        id: msg._id,
        content: msg.content,
        isUser: msg.role === 'user',
        timestamp: new Date(msg.createdAt),
      }));

      setMessages(formattedMessages);
      setCurrentConversationId(conversationId);
      setIsWelcomeScreen(false);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation. Please try again.');
      toast.error('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const sentMessage = message.trim();
    setMessage('');
    setIsWelcomeScreen(false);
    setIsLoading(true);
    setError(null);

    try {
      // Call the chatbot API
      const response = await chatService.chatWithAI(
        sentMessage,
        currentConversationId || undefined,
      );

      // If this is a new conversation, update the current conversation ID
      if (!currentConversationId && response.conversationId) {
        setCurrentConversationId(response.conversationId);
        // Refresh the conversations list
        fetchConversations();
      }

      // Add AI response to messages
      const aiResponse: Message = {
        id: Date.now().toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to get response. Please try again.');

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content:
          'Sorry, I encountered an error while processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  }, [message, currentConversationId, isLoading]);

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

  // Regenerate response handler
  const handleRegenerateResponse = async () => {
    // Find the last user message
    const lastUserMessageIndex = [...messages]
      .reverse()
      .findIndex((msg) => msg.isUser);

    if (lastUserMessageIndex === -1) return;

    const lastUserMessage =
      messages[messages.length - 1 - lastUserMessageIndex];

    // Remove all AI messages after the last user message
    const newMessages = messages.slice(
      0,
      messages.length - lastUserMessageIndex,
    );
    setMessages(newMessages);

    // Send the last user message again
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.chatWithAI(
        lastUserMessage.content,
        currentConversationId || undefined,
      );

      const aiResponse: Message = {
        id: Date.now().toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('Failed to regenerate message:', err);
      setError('Failed to regenerate response. Please try again.');

      const errorMessage: Message = {
        id: Date.now().toString(),
        content:
          'Sorry, I encountered an error while regenerating the response. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error('Failed to regenerate AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const MessageActions = ({
    isUser,
    messageId,
  }: {
    isUser: boolean;
    messageId: string;
  }) => (
    <div className={styles.messageActions}>
      {!isUser && (
        <>
          <button
            aria-label="Copy message"
            onClick={() => {
              // Find the message and copy it to clipboard
              const message = messages.find((msg) => msg.id === messageId);
              if (message) {
                navigator.clipboard.writeText(message.content);
                toast.success('Message copied to clipboard');
              }
            }}
          >
            <HiClipboard size={16} />
          </button>
          <button aria-label="Read aloud">
            <HiSpeakerWave size={16} />
          </button>
          <button
            aria-label="Regenerate response"
            onClick={handleRegenerateResponse}
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
  );

  return (
    <div
      className={`${styles.chatContainer} ${
        !isWelcomeScreen ? styles.inChatMode : ''
      }`}
    >
      {/* History component - removed fixed positioning as it's handled in the component */}
      <History
        conversations={conversations}
        onSelectConversation={(conversationId: string) => {
          if (conversationId) {
            loadConversation(conversationId);
          } else {
            // Handle case when conversation was deleted
            setMessages([]);
            setCurrentConversationId(null);
            setIsWelcomeScreen(true);
          }
        }}
        currentConversationId={currentConversationId}
        refetchConversations={fetchConversations}
      />

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
                isLoading={isLoading}
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
              {/* Chat Title - moved outside of messages container */}
              {currentConversationId && (
                <motion.div
                  className={styles.chatTitle}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <HiChatBubbleLeftRight size={18} />
                  <span>
                    {conversations.find(
                      (conv) => conv._id === currentConversationId,
                    )?.title || 'Conversation'}
                  </span>
                </motion.div>
              )}

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
                      <MessageActions isUser={msg.isUser} messageId={msg.id} />
                    </motion.div>
                  );
                })}

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

              <div className={styles.chatInputWrapper}>
                <InputContainer
                  inChat={true}
                  message={message}
                  setMessage={setMessage}
                  handleKeyPress={handleKeyPress}
                  handleSendMessage={handleSendMessage}
                  inputRef={inputRef}
                  isLoading={isLoading}
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
