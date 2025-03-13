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
  HiXMark,
  HiPhoto,
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
  image?: string;
}

// Image compression function
const compressImage = (
  imageDataUrl: string,
  maxWidth = 800,
  quality = 0.7,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageDataUrl;

    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to compressed data URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};

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
    onImageAttach,
  }: {
    inChat: boolean;
    message: string;
    setMessage: (value: string) => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleSendMessage: () => void;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    isLoading?: boolean;
    onImageAttach?: (imageData: string | null) => void;
  }) => {
    const animationKey = inChat ? 'chat-input' : 'welcome-input';
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Function to handle image processing
    const processImage = async (imageData: string) => {
      try {
        const loadingToast = toast.loading('Optimizing image...');
        const compressedImage = await compressImage(imageData, 800, 0.7);
        toast.dismiss(loadingToast);
        setAttachedImage(compressedImage);
        if (onImageAttach) {
          onImageAttach(compressedImage);
        }
      } catch (error) {
        toast.error('Failed to process image');
        console.error('Image processing error:', error);
      }
    };

    // Handle drag and drop events
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          processImage(imageData);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please drop an image file');
      }
    };

    // Handle paste event
    const handlePaste = async (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            if (file.size > 5 * 1024 * 1024) {
              toast.error('Image size should be less than 5MB');
              return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
              const imageData = event.target?.result as string;
              processImage(imageData);
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }

        if (!file.type.startsWith('image/')) {
          toast.error('Only image files are allowed');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          processImage(imageData);
        };
        reader.readAsDataURL(file);
      }
    };

    // Handle removing attached image
    const handleRemoveImage = () => {
      setAttachedImage(null);
      if (onImageAttach) {
        onImageAttach(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    // Handle sending message with image
    const handleSendWithImage = () => {
      handleSendMessage();
      setAttachedImage(null);
      if (onImageAttach) {
        onImageAttach(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <motion.div
        key={animationKey}
        className={`${styles.inputContainer} ${
          isDragging ? styles.dragging : ''
        }`}
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Image preview area */}
        {attachedImage && (
          <div className={styles.imagePreview}>
            <img src={attachedImage} alt="Attached" />
            <motion.button
              className={styles.removeImageBtn}
              onClick={handleRemoveImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiXMark size={16} />
            </motion.button>
          </div>
        )}

        <textarea
          ref={inputRef}
          className={styles.messageInput}
          placeholder={
            inChat
              ? 'Type your message or paste an image...'
              : 'Message Your Clever AI Tutor or paste an image...'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
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
            aria-label="Attach image"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
          >
            <HiPhoto size={18} />
          </motion.button>
          <input
            type="file"
            ref={fileInputRef}
            className={styles.fileInput}
            onChange={handleFileInputChange}
            accept="image/*"
            aria-label="Upload image"
          />
          <motion.button
            className={styles.sendButton}
            onClick={attachedImage ? handleSendWithImage : handleSendMessage}
            aria-label="Send message"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || (!message.trim() && !attachedImage)}
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
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      // Clear any attached image when loading a conversation
      setAttachedImage(null);

      const messagesData = await chatService.getConversationMessages(
        conversationId,
      );

      // Convert API messages to our local format
      const formattedMessages: Message[] = messagesData.map((msg) => ({
        id: msg._id,
        content: msg.content,
        isUser: msg.role === 'user',
        timestamp: new Date(msg.createdAt),
        image: msg.image,
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
    if ((!message.trim() && !attachedImage) || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true,
      timestamp: new Date(),
      image: attachedImage || undefined,
    };

    // Store image temporarily so we can use it in the API call
    const imageToSend = attachedImage;

    // Clear the UI state immediately
    setMessages((prev) => [...prev, newMessage]);
    const sentMessage = message.trim();
    setMessage('');
    setAttachedImage(null);
    setIsWelcomeScreen(false);
    setIsLoading(true);
    setError(null);

    try {
      // Call the chatbot API with the stored image data
      const response = await chatService.chatWithAI(
        sentMessage,
        currentConversationId || undefined,
        imageToSend,
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
  }, [message, currentConversationId, isLoading, attachedImage]);

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
      // Pass the image from the last user message if it exists
      const response = await chatService.chatWithAI(
        lastUserMessage.content,
        currentConversationId || undefined,
        lastUserMessage.image, // Include the image if present
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

  const handleImageAttach = (imageData: string | null) => {
    setAttachedImage(imageData);
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

  // Function to handle image click for enlarging
  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  // Function to close the enlarged image view
  const handleCloseImageView = () => {
    setSelectedImage(null);
  };

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
                onImageAttach={handleImageAttach}
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
                      <div className={styles.messageContent}>
                        {msg.content}
                        {msg.image && (
                          <div
                            className={styles.messageImage}
                            onClick={() => handleImageClick(msg.image!)}
                          >
                            <img src={msg.image} alt="Attached" />
                          </div>
                        )}
                      </div>
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
                  onImageAttach={handleImageAttach}
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

      {/* Image viewer modal */}
      {selectedImage && (
        <div
          className={styles.imageViewerOverlay}
          onClick={handleCloseImageView}
        >
          <div className={styles.imageViewer}>
            <img src={selectedImage} alt="Enlarged view" />
            <button
              className={styles.closeButton}
              onClick={handleCloseImageView}
              aria-label="Close image view"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
