import { useState, useRef, useEffect, useCallback } from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Chatbot.module.scss';
import { History } from '~/components/History/History';
import { chatService, Conversation } from '~/services/chatService';
import toast from 'react-hot-toast';

// Import our modular components and types
import {
  InputContainer,
  SubjectSelector,
  ChatMessages,
  ImageViewer,
  Message,
} from '~/components/Chatbot';

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
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null,
  );

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
      // Clear any audio response
      setCurrentlyPlayingId(null);

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
        audio: msg.audio,
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

      // Add AI response to messages (text message won't have audio)
      const aiResponse: Message = {
        id: Date.now().toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: any) {
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
  }, [
    message,
    currentConversationId,
    isLoading,
    attachedImage,
    fetchConversations,
  ]);

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
    }, 50);
  };

  // Voice chat handler
  const handleVoiceMessage = useCallback(
    async (
      transcribedText: string,
      audioBase64: string,
      aiResponse: string,
    ) => {
      try {
        // Display user's transcribed text as message
        const userMessage: Message = {
          id: Date.now().toString(),
          content: transcribedText,
          isUser: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsWelcomeScreen(false);

        // Add loading message
        const loadingMessage: Message = {
          id: Date.now().toString() + '-loading',
          content: 'Processing your voice message...',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, loadingMessage]);

        // Generate a unique ID for the new message
        const newMessageId = Date.now().toString() + '-ai';

        // Replace loading message with the actual AI response from the API
        setMessages((prev) => {
          const newMessages = [...prev];
          const loadingIndex = newMessages.findIndex(
            (msg) =>
              !msg.isUser && msg.content === 'Processing your voice message...',
          );

          if (loadingIndex !== -1) {
            newMessages[loadingIndex] = {
              id: newMessageId,
              content: aiResponse, // Use the actual API response text
              isUser: false,
              timestamp: new Date(),
              audio: audioBase64, // Include the audio data in the message
              isNew: true, // Mark this as a new message for auto-play
            };
          }

          return newMessages;
        });

        // Set this message as currently playing
        setCurrentlyPlayingId(newMessageId);

        // Update conversation ID if needed
        if (!currentConversationId) {
          fetchConversations();
        }
      } catch (error) {
        console.error('Error handling voice message:', error);
        toast.error('Error processing voice message');
      }
    },
    [currentConversationId, fetchConversations],
  );

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
      {/* History component */}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <h1>Welcome to CleverClass AI Tutor</h1>
              <div className={styles.chatInputWrapper}>
                <InputContainer
                  inChat={false}
                  message={message}
                  setMessage={setMessage}
                  handleKeyPress={handleKeyPress}
                  handleSendMessage={handleSendMessage}
                  inputRef={inputRef}
                  isLoading={isLoading}
                  onImageAttach={handleImageAttach}
                  onVoiceMessageReceived={handleVoiceMessage}
                />
              </div>
              <SubjectSelector onSelect={handleSubjectSelect} />
              <p className={styles.disclaimer}>
                Please verify responses. AI Tutor may make mistakes.
              </p>
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

              <ChatMessages
                messages={messages}
                error={error}
                isLoading={isLoading}
                onRegenerateResponse={handleRegenerateResponse}
                onImageClick={handleImageClick}
                currentlyPlayingId={currentlyPlayingId}
                setCurrentlyPlayingId={setCurrentlyPlayingId}
              />

              <div ref={messagesEndRef} />

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
                  onVoiceMessageReceived={handleVoiceMessage}
                  currentConversationId={currentConversationId}
                />
                <p className={styles.chatDisclaimer}>
                  Please verify responses. AI Tutor may make mistakes.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image viewer */}
        {selectedImage && (
          <ImageViewer
            imageSrc={selectedImage}
            onClose={handleCloseImageView}
          />
        )}
      </motion.div>
    </div>
  );
}
