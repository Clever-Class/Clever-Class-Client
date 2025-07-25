import { useState, useRef, useEffect, useCallback } from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import styles from './Chatbot.module.scss';
import { History } from '~/components/History/History';
import { chatService, Conversation, creditsService } from '~/services';
import toast from 'react-hot-toast';
import { UpgradePopup } from '~/components/UpgradePopup';
import Cookies from 'js-cookie';

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

  const location = useLocation();
  const locationStateRef = useRef(location.state);

  // Refs for tracking state between renders
  const shouldUpdateConversationsRef = useRef(false);
  // Track last render timestamp to prevent too frequent re-renders
  const lastRenderTimeRef = useRef(Date.now());

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
  const [hasProcessedFollowup, setHasProcessedFollowup] = useState(false);

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
      const token = Cookies.get('userToken');
      console.log('Current auth token:', token);
      const conversationsData = await chatService.getConversations();
      console.log('Fetched conversations:', conversationsData);
      setConversations(conversationsData);
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
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
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
              'Origin, Content-Type, Accept, Authorization, X-Request-With',
            'X-Requested-With': 'XMLHttpRequest',
          },
          onDownloadProgress: (progressEvent: any) => {
            if (!progressEvent.event?.target?.responseText) return;

            const rawText = progressEvent.event.target.responseText;
            const chunks = rawText
              .split('\n\n')
              .filter((chunk: string) => chunk.trim());

            for (const chunk of chunks) {
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

                // Refresh credits when the streaming is done
                creditsService.refreshCredits();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content !== undefined) {
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
                console.error('Error parsing SSE data:', e, 'Raw data:', data);
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

      // Refresh credits regardless of success or failure
      creditsService.refreshCredits();
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

        // Refresh credits after voice message processing
        creditsService.refreshCredits();
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

      // Refresh credits after regenerating response
      creditsService.refreshCredits();
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

      // Refresh credits regardless of success or failure
      creditsService.refreshCredits();
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

  // Add a new function to handle followup questions
  const handleFollowupQuestion = useCallback(
    async (followupQuestion: string) => {
      if (!followupQuestion.trim() || isLoading) return;

      console.log('Processing follow-up question:', followupQuestion);

      // Set loading state once
      setIsLoading(true);
      setError(null);

      // Reset the ref flag before we start
      shouldUpdateConversationsRef.current = false;

      try {
        // Create a temporary message for the AI's response (avoid setState if message already exists)
        const messagesSnapshot = [...messages];
        const hasAiMessage = messagesSnapshot.some(
          (msg) => !msg.isUser && msg.isStreaming,
        );

        if (!hasAiMessage) {
          // Only add a temporary message if one doesn't exist already
          const tempAiMessage: Message = {
            id: Date.now().toString() + '-ai',
            content: '',
            isUser: false,
            timestamp: new Date(),
            isStreaming: true,
          };

          // Use functional update to avoid dependency on messages state
          setMessages((prev) => [...prev, tempAiMessage]);
        }

        // Make the API call with streaming using axios
        console.log('Sending follow-up question to API');
        const response = await api.ccServer.post(
          '/chatbot/chat',
          {
            message: followupQuestion,
            conversationId: currentConversationId,
          },
          {
            responseType: 'text',
            headers: {
              Accept: 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers':
                'Origin, Content-Type, Accept, Authorization, X-Request-With',
              'X-Requested-With': 'XMLHttpRequest',
            },
            onDownloadProgress: (progressEvent: any) => {
              if (!progressEvent.event?.target?.responseText) return;

              const rawText = progressEvent.event.target.responseText;
              console.log('Received data length:', rawText.length);
              const chunks = rawText
                .split('\n\n')
                .filter((chunk: string) => chunk.trim());

              for (const chunk of chunks) {
                if (!chunk.startsWith('data: ')) continue;

                const data = chunk.replace('data: ', '').trim();
                if (data === '[DONE]') {
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMessage =
                      newMessages.length > 0
                        ? newMessages[newMessages.length - 1]
                        : null;
                    if (lastMessage && !lastMessage.isUser) {
                      lastMessage.isStreaming = false;
                    }
                    return [...newMessages];
                  });

                  if (shouldUpdateConversationsRef.current) {
                    // Use setTimeout to avoid immediate state update that might interfere with rendering
                    setTimeout(() => {
                      fetchConversations();
                    }, 100);
                  }

                  // Refresh credits when the streaming is done
                  creditsService.refreshCredits();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  console.log('Parsed chunk data:', parsed);
                  if (parsed.content !== undefined) {
                    setMessages((prev) => {
                      const newMessages = [...prev];
                      const lastMessage =
                        newMessages.length > 0
                          ? newMessages[newMessages.length - 1]
                          : null;

                      if (lastMessage && !lastMessage.isUser) {
                        // Update the existing message
                        lastMessage.content = parsed.content;
                        lastMessage.isStreaming = true;
                      } else {
                        // Create a new message if somehow we don't have one
                        newMessages.push({
                          id: Date.now().toString() + '-ai',
                          content: parsed.content,
                          isUser: false,
                          timestamp: new Date(),
                          isStreaming: true,
                        });
                      }

                      return [...newMessages];
                    });

                    if (parsed.conversationId && !currentConversationId) {
                      setCurrentConversationId(parsed.conversationId);
                      shouldUpdateConversationsRef.current = true;
                    }
                  }
                } catch (e) {
                  console.error(
                    'Error parsing SSE data:',
                    e,
                    'Raw data:',
                    data,
                  );
                }
              }
            },
          },
        );
      } catch (err: any) {
        console.error('Error in follow-up question:', err);

        // Only update error state if we're still mounted and the error is relevant
        setError(
          'Sorry, I encountered an error while processing your request. Please try again.',
        );

        // Error handling code...
      } finally {
        // Set loading state to false to allow new interactions
        setIsLoading(false);

        // Refresh credits regardless of success or failure
        creditsService.refreshCredits();
      }
    },
    [currentConversationId, isLoading, messages],
  );

  // Add a new effect to handle state passed from LectureSummarizer once on mount
  // This effect needs to be placed after the function definitions
  useEffect(() => {
    // Only run this once on mount
    const handleInitialLocationState = async () => {
      // Access the location state directly to ensure we get the fresh value
      const state = location.state as {
        selectedConversationId?: string;
        fromLectureSummarizer?: boolean;
        previousResponse?: string;
        followupQuestion?: string;
      } | null;

      if (!state) return;

      console.log('Processing location state:', state);

      // Case 2: Coming with previous response and followup question - HANDLE THIS FIRST
      if (state.previousResponse && state.followupQuestion) {
        console.log('============================================');
        console.log('HANDLING FOLLOWUP QUESTION FLOW');
        console.log('Previous response length:', state.previousResponse.length);
        console.log('Follow-up question:', state.followupQuestion);
        console.log('============================================');

        // Immediately show the conversation UI
        setIsWelcomeScreen(false);

        // Start with the AI's previous response
        const aiMessage: Message = {
          id: Date.now().toString() + '-prev',
          content: state.previousResponse,
          isUser: false,
          timestamp: new Date(Date.now() - 1000), // 1 second ago
        };

        // Add the user's followup question
        const userMessage: Message = {
          id: Date.now().toString(),
          content: state.followupQuestion,
          isUser: true,
          timestamp: new Date(),
        };

        // Set messages to include both
        setMessages([aiMessage, userMessage]);

        // Mark that we've processed the followup to prevent re-processing
        setHasProcessedFollowup(true);

        // Clear state before API call to prevent issues
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        // CRITICAL: Store the followup question in a variable to ensure it's not lost
        const followupToSend = state.followupQuestion;

        // Send the question directly and immediately rather than deferring with timeout
        try {
          console.log(
            'Directly sending followup question to API:',
            followupToSend,
          );

          // Set loading state
          setIsLoading(true);

          // Add a streaming message placeholder
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + '-ai-streaming',
              content: '',
              isUser: false,
              timestamp: new Date(),
              isStreaming: true,
            },
          ]);

          // Make the direct API call
          const response = await api.ccServer.post(
            '/chatbot/chat',
            {
              message: followupToSend,
              conversationId: currentConversationId,
            },
            {
              responseType: 'text',
              headers: {
                Accept: 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':
                  'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers':
                  'Origin, Content-Type, Accept, Authorization, X-Request-With',
                'X-Requested-With': 'XMLHttpRequest',
              },
              onDownloadProgress: (progressEvent: any) => {
                if (!progressEvent.event?.target?.responseText) return;

                const rawText = progressEvent.event.target.responseText;
                console.log('Received data length:', rawText.length);
                const chunks = rawText
                  .split('\n\n')
                  .filter((chunk: string) => chunk.trim());

                for (const chunk of chunks) {
                  if (!chunk.startsWith('data: ')) continue;

                  const data = chunk.replace('data: ', '').trim();
                  if (data === '[DONE]') {
                    setMessages((prev) => {
                      const newMessages = [...prev];
                      const lastMessage =
                        newMessages.length > 0
                          ? newMessages[newMessages.length - 1]
                          : null;
                      if (lastMessage && !lastMessage.isUser) {
                        lastMessage.isStreaming = false;
                      }
                      return [...newMessages];
                    });

                    // When done, refresh conversations
                    fetchConversations();

                    // Refresh credits when the streaming is done
                    creditsService.refreshCredits();

                    // Clear loading state
                    setIsLoading(false);
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    console.log('Parsed chunk data:', parsed);
                    if (parsed.content !== undefined) {
                      setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastMessage =
                          newMessages.length > 0
                            ? newMessages[newMessages.length - 1]
                            : null;

                        if (lastMessage && !lastMessage.isUser) {
                          // Update the existing message
                          lastMessage.content = parsed.content;
                          lastMessage.isStreaming = true;
                        } else {
                          // Create a new message if somehow we don't have one
                          newMessages.push({
                            id: Date.now().toString() + '-ai',
                            content: parsed.content,
                            isUser: false,
                            timestamp: new Date(),
                            isStreaming: true,
                          });
                        }

                        return [...newMessages];
                      });

                      if (parsed.conversationId && !currentConversationId) {
                        setCurrentConversationId(parsed.conversationId);
                      }
                    }
                  } catch (e) {
                    console.error(
                      'Error parsing SSE data:',
                      e,
                      'Raw data:',
                      data,
                    );
                  }
                }
              },
            },
          );

          console.log('API call completed');
        } catch (err) {
          console.error('Error sending followup question directly:', err);
          setIsLoading(false);
          setError(
            'Failed to get AI response. Please try sending your question again.',
          );
          toast.error('Failed to get AI response');
        }
      }
      // Case 1: Coming from lecture summarizer with existing conversation
      else if (state.selectedConversationId && state.fromLectureSummarizer) {
        console.log(
          'Detected navigation from LectureSummarizer, loading conversation:',
          state.selectedConversationId,
        );

        // Use setTimeout to ensure this runs after component is fully mounted
        setTimeout(() => {
          // TypeScript safety - additional check to ensure selectedConversationId is not undefined
          if (state.selectedConversationId) {
            loadConversation(state.selectedConversationId);
          }

          // Clear the location state reference to prevent reprocessing
          locationStateRef.current = null;

          // Clear the location state after using it to prevent issues on refresh
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }, 100);
      }
    };

    // Only run once on component mount
    handleInitialLocationState();
  }, []);

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
