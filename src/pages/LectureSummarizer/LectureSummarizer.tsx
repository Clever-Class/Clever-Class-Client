import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Headphones,
  ChevronDown,
  Link,
  Languages,
  Bot,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader,
  FileText,
  Award,
  ArrowRightCircle,
  Send,
} from 'lucide-react';
import styles from './LectureSummarizer.module.scss';
import classNames from 'classnames';
import { MessageBubble, InputContainer } from '~/components/Chatbot';
import { useNavigate } from 'react-router-dom';
import { chatService } from '~/services/chatService';
import Cookies from 'js-cookie';
import { api } from '~api';

export const LectureSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('en');
  const [mode, setMode] = useState<'video' | 'podcast'>('video');
  const [aiModel, setAiModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [progressStage, setProgressStage] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  // Add refs for scrolling
  const progressCardRef = useRef<HTMLDivElement>(null);
  const summaryCardRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Scroll to element helper function with alignment option
  const scrollToElement = (
    ref: React.RefObject<HTMLElement>,
    alignment: ScrollLogicalPosition = 'center',
  ) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: alignment,
      });
    }
  };

  // Effect to scroll to progress card when loading starts
  useEffect(() => {
    if (loading) {
      scrollToElement(progressCardRef, 'center');
    }
  }, [loading]);

  // Effect to scroll to summary card when summary is ready
  useEffect(() => {
    if (summary) {
      scrollToElement(summaryCardRef, 'start');
      setShowReply(true);
    }
  }, [summary]);

  const getProgressIcon = useCallback(() => {
    if (loading) {
      return <div className={styles.iosLoader} />;
    }

    switch (progressStage) {
      case 'initializing':
        return <Clock className={styles.icon} size={18} />;
      case 'extracting_video':
        return <Video className={styles.icon} size={18} />;
      case 'fetching_transcript':
        return <FileText className={styles.icon} size={18} />;
      case 'formatting_transcript':
        return <FileText className={styles.icon} size={18} />;
      case 'generating_summary':
        return <Bot className={styles.icon} size={18} />;
      case 'complete':
        return <CheckCircle className={styles.icon} size={18} />;
      case 'error':
        return <AlertCircle className={styles.icon} size={18} />;
      default:
        return <div className={styles.iosLoader} />;
    }
  }, [progressStage, loading]);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    setLoading(true);
    setProgress(0);
    setProgressStage('initializing');
    setProgressMessage('Starting summarization process...');
    setSummary(null);
    setError(null);
    setShowReply(false);

    try {
      const token = Cookies.get('userToken');

      if (!token) {
        setError('You must be logged in to use this feature');
        setLoading(false);
        return;
      }

      // For EventSource, we need to include the token in the URL as a query parameter
      // since EventSource doesn't support custom headers
      const eventSourceUrl = `${
        api.ccServer.defaults.baseURL
      }/lecture-summarizer/summarize?videoUrl=${encodeURIComponent(
        videoUrl,
      )}&language=${language}&token=${token}`;

      console.log('Connecting to EventSource...');

      // Set up event source using EventSource
      const eventSource = new EventSource(eventSourceUrl);

      // Define the event handlers
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('SSE update received:', data);

          // Update state based on the data
          if (data.progress !== undefined) setProgress(data.progress);
          if (data.message) setProgressMessage(data.message);
          if (data.stage) setProgressStage(data.stage);

          // Handle completion
          if (data.stage === 'complete' && data.data?.summary) {
            setSummary(data.data.summary);
            eventSource.close();
            setLoading(false);
          }

          // Handle errors
          if (data.stage === 'error') {
            setError(data.message || 'An error occurred during summarization');
            eventSource.close();
            setLoading(false);
          }
        } catch (parseError) {
          console.error('Error parsing SSE data:', parseError, event.data);
        }
      };

      // Handle connection error
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        setError(
          'Connection error. Please check your authentication and try again.',
        );
        eventSource.close();
        setLoading(false);
      };

      // No need for a separate POST request since we're passing everything in the EventSource URL
    } catch (err: any) {
      console.error('API request error:', err);

      // Handle auth errors specifically
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          'Authentication error: Please log in again before using this feature.',
        );
      } else {
        setError(
          `Failed to start summarization process: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }

      setLoading(false);
    }
  };

  // Function to handle sending reply and transition to chatbot
  const handleSendReply = async () => {
    if (!replyMessage.trim() || !summary || replyLoading) return;

    setReplyLoading(true);

    try {
      // Create a meaningful title from the video URL
      const videoIdPattern =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
      const videoId = videoUrl.match(videoIdPattern)?.[1];

      // Extract video title to form a more meaningful conversation title
      const titleWords = summary?.split(/\s+/).slice(0, 7).join(' ') || '';
      const conversationTitle = titleWords
        ? `${titleWords}...`
        : `YouTube Video Summary`;

      // First, create a conversation with an assistant message instead of user message
      // We'll do a two-step process:
      // 1. Start conversation with a fake "user" message (API limitation)
      // 2. Then have the AI "respond" with our context message
      const token = Cookies.get('userToken');

      if (!token) {
        throw new Error('User not authenticated');
      }

      console.log('Starting conversation with system context message');

      // Initial message to start the conversation - this is needed due to API requirements
      // We use a placeholder message that won't be visible to the user
      const initialMessage = `Summarize this YouTube video: ${videoUrl}`;

      // Use a regular POST request first to start the conversation and get the conversationId
      const response = await api.ccServer.post(
        '/chatbot/chat',
        {
          message: initialMessage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Extract conversationId from response
      let conversationId: string | undefined;

      // Parse response data to get conversationId
      if (response.data && response.data.conversationId) {
        conversationId = response.data.conversationId;
        console.log('Received conversationId:', conversationId);
      } else {
        // If for some reason we don't have a conversationId in the response,
        // try to extract it from the event data
        const eventData = response.data;
        if (
          typeof eventData === 'string' &&
          eventData.includes('conversationId')
        ) {
          try {
            const match = eventData.match(/"conversationId":"([^"]+)"/);
            if (match && match[1]) {
              conversationId = match[1];
              console.log(
                'Extracted conversationId from event data:',
                conversationId,
              );
            }
          } catch (err) {
            console.error(
              'Error extracting conversationId from response:',
              err,
            );
          }
        }
      }

      if (!conversationId) {
        throw new Error('Failed to get a valid conversation ID');
      }

      // Set a more descriptive title for the conversation
      await api.ccServer.patch(
        `/chatbot/conversations/${conversationId}`,
        { title: conversationTitle },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // First, add AI assistant context as a message from the user
      const contextMessage = `I've just watched a YouTube video at ${videoUrl}. Here's what it was about:\n\n${summary}\n\nNow I'd like to ask a follow-up question: ${replyMessage}`;

      // Now send the user's actual question with context
      await chatService.chatWithAI(contextMessage, conversationId);

      console.log('Message sent successfully, navigating to chat page');

      // Use simple navigatestate approach to avoid Cross-Origin-Opener-Policy issues
      navigate('/dashboard/ai-chatbot', {
        state: {
          selectedConversationId: conversationId,
          fromLectureSummarizer: true,
        },
        replace: true, // Use replace instead of push to avoid browser history issues
      });
    } catch (error: any) {
      console.error('Error transitioning to chat:', error);

      // Handle different types of errors
      if (
        error.message.includes('authentication') ||
        error.message.includes('log in')
      ) {
        setError(
          'Authentication error: Please log in again before using this feature.',
        );
      } else {
        setError(
          `Failed to start chat conversation: ${
            error.message || 'Please try again.'
          }`,
        );
      }
    } finally {
      setReplyLoading(false);
    }
  };

  // Handle key press for reply input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Lecture Summarizer</h1>
          <p className={styles.subtitle}>
            Extract key insights from any YouTube video or podcast in seconds
            with AI
          </p>
        </header>

        {/* Main Form Card */}
        <div className={styles.formCard}>
          <div className={styles.cardHeading}>
            <Sparkles className={styles.cardIcon} size={20} />
            <h2 className={styles.cardTitle}>Generate Summary</h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* YouTube URL Input */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="video-url">
                <Link size={16} /> YouTube URL
              </label>
              <p className={styles.caption}>
                Enter a YouTube URL to transform it into concise insights
              </p>
              <input
                id="video-url"
                type="text"
                className={styles.input}
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Mode Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Video size={16} /> Summary Mode
              </label>
              <div className={styles.modeToggle}>
                <button
                  type="button"
                  onClick={() => setMode('video')}
                  className={classNames(styles.modeButton, {
                    [styles.active]: mode === 'video',
                  })}
                >
                  <Video size={16} />
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setMode('podcast')}
                  className={classNames(styles.modeButton, {
                    [styles.active]: mode === 'podcast',
                  })}
                >
                  <Headphones size={16} />
                  Podcast
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="language-select">
                <Languages size={16} /> Language
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="language-select"
                  className={styles.select}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="hi">Hindi</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>

            {/* AI Model Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="model-select">
                <Bot size={16} /> AI Model
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="model-select"
                  className={styles.select}
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  aria-label="Select AI model"
                >
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !videoUrl}
            >
              {loading ? (
                <>
                  <span className={styles.buttonContent} style={{ opacity: 0 }}>
                    Generate Summary
                  </span>
                  <div className={styles.loadingSpinner}>
                    <div className={styles.loadingDots}>
                      <div className={styles.loadingDot}></div>
                      <div className={styles.loadingDot}></div>
                      <div className={styles.loadingDot}></div>
                    </div>
                  </div>
                </>
              ) : (
                <span className={styles.buttonContent}>
                  <Sparkles size={16} /> Generate Summary
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Progress Indicator */}
        {loading && (
          <div className={styles.progressCard} ref={progressCardRef}>
            <h3 className={styles.progressTitle}>
              {getProgressIcon()} Generating Summary...
            </h3>

            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className={styles.progressMessage}>
              {getProgressIcon()} {progressMessage}
            </p>

            {/* Stage indicators */}
            <div className={styles.stageIndicators}>
              <div
                className={classNames(styles.stageItem, {
                  [styles.active]:
                    progressStage === 'initializing' || progress >= 5,
                  [styles.completed]: progress > 10,
                })}
              >
                <Clock size={16} /> Initializing
              </div>
              <div
                className={classNames(styles.stageItem, {
                  [styles.active]:
                    progressStage === 'extracting_video' ||
                    (progress >= 10 && progress < 30),
                  [styles.completed]: progress >= 30,
                })}
              >
                <Video size={16} /> Extracting Video
              </div>
              <div
                className={classNames(styles.stageItem, {
                  [styles.active]:
                    progressStage === 'fetching_transcript' ||
                    (progress >= 30 && progress < 50),
                  [styles.completed]: progress >= 50,
                })}
              >
                <FileText size={16} /> Fetching Transcript
              </div>
              <div
                className={classNames(styles.stageItem, {
                  [styles.active]:
                    progressStage === 'formatting_transcript' ||
                    (progress >= 50 && progress < 70),
                  [styles.completed]: progress >= 70,
                })}
              >
                <FileText size={16} /> Formatting Transcript
              </div>
              <div
                className={classNames(styles.stageItem, {
                  [styles.active]:
                    progressStage === 'generating_summary' || progress >= 70,
                  [styles.completed]: progress >= 100,
                })}
              >
                <Bot size={16} /> Generating Summary
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={styles.errorCard}>
            <h3 className={styles.errorTitle}>
              <AlertCircle size={18} /> Error
            </h3>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        )}

        {/* Summary Result */}
        {summary && (
          <div className={styles.summaryCard} ref={summaryCardRef}>
            <h3 className={styles.summaryTitle}>
              <Award size={20} /> Summary Results
            </h3>
            <MessageBubble
              id="summary-result"
              content={summary}
              isUser={false}
              isLatest={true}
              onRegenerateResponse={() => {}}
              onImageClick={() => {}}
              isLoading={false}
            />

            {/* Reply section */}
            {showReply && (
              <div className={styles.replySection}>
                <h4 className={styles.replyTitle}>Ask a follow-up question</h4>
                <div className={styles.replyContainer}>
                  <textarea
                    ref={replyInputRef}
                    className={styles.replyInput}
                    placeholder="Ask a question about this lecture..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={replyLoading}
                  />
                  <button
                    className={styles.replyButton}
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim() || replyLoading}
                  >
                    {replyLoading ? (
                      <div className={styles.buttonLoader} />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Highlights */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={classNames(styles.featureIcon, styles.purple)}>
              <Video />
            </div>
            <h3 className={styles.featureTitle}>Any YouTube Video</h3>
            <p className={styles.featureDescription}>
              Works with any public YouTube video, from short clips to long
              lectures
            </p>
          </div>

          <div className={styles.featureItem}>
            <div className={classNames(styles.featureIcon, styles.blue)}>
              <Sparkles />
            </div>
            <h3 className={styles.featureTitle}>AI-Powered Insights</h3>
            <p className={styles.featureDescription}>
              Advanced AI extracts key points and insights, saving you time
            </p>
          </div>

          <div className={styles.featureItem}>
            <div className={classNames(styles.featureIcon, styles.indigo)}>
              <ArrowRightCircle />
            </div>
            <h3 className={styles.featureTitle}>Instant Results</h3>
            <p className={styles.featureDescription}>
              Get comprehensive summaries in minutes with real-time progress
              updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureSummarizer;
