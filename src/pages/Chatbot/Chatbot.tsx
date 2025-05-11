import { useState, useRef, useEffect, useCallback } from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Chatbot.module.scss';
import { History } from '~/components/History/History';
import { chatService, Conversation } from '~/services/chatService';
import toast from 'react-hot-toast';
import { UpgradePopup } from '~/components/UpgradePopup';

// Import our modular components and types
import {
  InputContainer,
  SubjectSelector,
  ChatMessages,
  ImageViewer,
  Message,
} from '~/components/Chatbot';
import { api } from '~api';

export function Chatbot() {
  console.log('Chatbot component rendered');

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
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
    console.log('Fetching conversations on mount');
  }, []);

  // Fetch conversations from the API
  const fetchConversations = useCallback(async () => {
    try {
      console.log('Fetching conversations...');
      const conversationsData = await chatService.getConversations();
      setConversations(conversationsData);
    } catch (err: any) {
      if (err.message !== 'User not authenticated') {
        toast.error('Failed to fetch conversation history');
      }
    }
  }, []);

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

    let shouldUpdateConversations = false;

    try {
      // Create a temporary message for the AI's response
      const tempAiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: '',
        isUser: false,
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, tempAiMessage]);

      // Make the API call with streaming using axios
      const response = await api.ccServer.post(
        '/chatbot/chat',
        {
          message: sentMessage,
          conversationId: currentConversationId,
          image: imageToSend,
        },
        {
          responseType: 'text',
          headers: {
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
          onDownloadProgress: (progressEvent: any) => {
            const rawText = progressEvent.event.target.responseText;
            const chunks = rawText
              .split('\n\n')
              .filter((chunk: string) => chunk.trim());

            for (const chunk of chunks) {
              console.log(chunk.length, 'chunk');
              if (!chunk.startsWith('data: ')) continue;

              const data = chunk.replace('data: ', '').trim();
              if (data === '[DONE]') {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (!lastMessage.isUser) {
                    lastMessage.isStreaming = false;
                  }
                  return [...newMessages];
                });

                if (shouldUpdateConversations) {
                  fetchConversations();
                }
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (!lastMessage.isUser) {
                      // Simply set the content to the accumulated text from server
                      lastMessage.content = parsed.content;
                      lastMessage.isStreaming = true;
                    }
                    return [...newMessages];
                  });

                  if (parsed.conversationId && !currentConversationId) {
                    setCurrentConversationId(parsed.conversationId);
                    shouldUpdateConversations = true;
                  }
                }
              } catch (e) {
                if (!data.includes('[DONE]')) {
                  console.error('Error parsing SSE data:', e);
                }
              }
            }
          },
        },
      );
    } catch (err: any) {
      const errorMessage = 'Failed to get response. Please try again.';
      let displayMessage =
        'Sorry, I encountered an error while processing your request. Please try again.';

      try {
        // Safely extract error message if available
        if (err.response && err.response.data) {
          const rawData = err.response.data;
          // Check if rawData is a string that can be parsed
          if (typeof rawData === 'string') {
            try {
              const data = JSON.parse(rawData);
              if (data && data.message) {
                displayMessage = data.message;
              }
            } catch (parseError) {
              // If we can't parse the response, use the raw data if it's a string
              if (typeof rawData === 'string') {
                displayMessage = rawData;
              }
            }
          } else if (typeof rawData === 'object' && rawData.message) {
            // If rawData is already an object with a message property
            displayMessage = rawData.message;
          }
        }
      } catch (parseErr) {
        console.error('Error parsing error response:', parseErr);
      }

      // Set error state
      setError(displayMessage);

      // Check if this is a credit-related error and show upgrade popup
      const isCreditIssue = isCreditError(displayMessage);
      if (isCreditIssue) {
        setShowUpgradePopup(true);
      }

      // Remove any temporary AI message that might be streaming
      setMessages((prev) => {
        const newMessages = [...prev];
        // Check if the last message is a streaming AI message
        if (
          newMessages.length > 0 &&
          !newMessages[newMessages.length - 1].isUser &&
          newMessages[newMessages.length - 1].isStreaming
        ) {
          // Remove the streaming message
          newMessages.pop();
        }
        return [
          ...newMessages,
          {
            id: Date.now().toString(),
            content: displayMessage,
            isUser: false,
            timestamp: new Date(),
            isError: true,
          },
        ];
      });

      // Only show toast error for non-credit related errors
      if (!isCreditIssue) {
        toast.error('Failed to get AI response');
      }
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

        // Clear any currently playing audio before setting the new one
        setCurrentlyPlayingId(null);

        // Set a small delay before setting the new message as playing to allow the audio element to initialize
        setTimeout(() => {
          setCurrentlyPlayingId(newMessageId);
        }, 100);

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
    } catch (err: any) {
      console.error('Failed to regenerate message:', err);

      // Get the error message
      let errorContent =
        'Sorry, I encountered an error while regenerating the response. Please try again.';

      if (err.response?.data?.message) {
        errorContent = err.response.data.message;
      }

      setError('Failed to regenerate response. Please try again.');

      // Check if this is a credit-related error
      const isCreditIssue = isCreditError(errorContent);
      if (isCreditIssue) {
        setShowUpgradePopup(true);
      }

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: errorContent,
        isUser: false,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);

      // Only show toast for non-credit related errors
      if (!isCreditIssue) {
        toast.error('Failed to regenerate AI response');
      }
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

  // Check if the error message indicates a credit issue
  const isCreditError = (message: string): boolean => {
    // Check for the exact error message
    if (message === 'Not enough credits. Please upgrade your subscription.') {
      return true;
    }

    const creditErrorTerms = [
      'not enough credits',
      'no credits',
      'out of credits',
      'credit limit',
      'upgrade subscription',
      'please upgrade',
    ];

    const lowerMessage = message.toLowerCase();
    return creditErrorTerms.some((term) => lowerMessage.includes(term));
  };

  // After other useEffect hooks
  useEffect(() => {
    // Check if the last message is a credit error message
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser && lastMessage.isError && lastMessage.content) {
        if (isCreditError(lastMessage.content)) {
          setShowUpgradePopup(true);
        }
      }
    }
  }, [messages]);

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

              <div
                className={`${styles.chatInputWrapper} ${
                  isWelcomeScreen ? '' : styles.chatOpened
                }`}
              >
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

        {/* Upgrade Popup */}
        {showUpgradePopup && (
          <UpgradePopup onClose={() => setShowUpgradePopup(false)} />
        )}
      </motion.div>
    </div>
  );
}
