import React, { useState, useCallback } from 'react';
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
} from 'lucide-react';
import styles from './LectureSummarizer.module.scss';
import classNames from 'classnames';
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

  const getProgressIcon = useCallback(() => {
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
        return <Loader className={styles.icon} size={18} />;
    }
  }, [progressStage]);

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

    try {
      // Use the correct backend URL with port 8000
      const backendURL = 'http://localhost:8000';

      // Create a separate instance for direct connection to backend
      // This bypasses any proxy settings in the main api instance
      const response = await fetch(
        `${backendURL}/lecture-summarizer/summarize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({
            videoUrl,
            language,
          }),
        },
      );

      if (!response.ok || !response.body) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      console.log('Response headers:', response.headers);
      console.log('Response status:', response.status);

      // Process the SSE stream using the ReadableStream API
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Function to process the stream
      const processStream = async () => {
        let processing = true;

        while (processing) {
          try {
            const { done, value } = await reader.read();

            if (done) {
              console.log('Stream completed');
              processing = false;
              break;
            }

            // Decode the chunk and add to buffer
            const chunk = decoder.decode(value, { stream: true });
            console.log('Received chunk:', chunk);
            buffer += chunk;

            // Process complete SSE messages (separated by double newlines)
            const messages = buffer.split('\n\n');
            buffer = messages.pop() || ''; // Keep the last (possibly incomplete) chunk

            for (const message of messages) {
              if (message.trim().startsWith('data:')) {
                try {
                  // Extract and parse the JSON data
                  const jsonStr = message.trim().substring(5); // Remove 'data:' prefix
                  const data = JSON.parse(jsonStr);

                  console.log('SSE update received:', data);

                  // Update state based on the data
                  if (data.progress !== undefined) setProgress(data.progress);
                  if (data.message) setProgressMessage(data.message);
                  if (data.stage) setProgressStage(data.stage);

                  // Handle completion
                  if (data.stage === 'complete' && data.data?.summary) {
                    setSummary(data.data.summary);
                    reader.cancel();
                    setLoading(false);
                    processing = false;
                  }

                  // Handle errors
                  if (data.stage === 'error') {
                    setError(
                      data.message || 'An error occurred during summarization',
                    );
                    reader.cancel();
                    setLoading(false);
                    processing = false;
                  }
                } catch (parseError) {
                  console.error('Error parsing SSE data:', parseError, message);
                }
              }
            }
          } catch (readError) {
            console.error('Error reading from stream:', readError);
            processing = false;
            setError('Error processing response stream');
            setLoading(false);
          }
        }
      };

      // Start processing the stream
      processStream().catch((streamError) => {
        console.error('Stream processing error:', streamError);
        setError('Error processing response stream');
        setLoading(false);
      });
    } catch (err) {
      console.error('API request error:', err);
      setError(
        `Failed to start summarization process: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      setLoading(false);
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
          <div className={styles.progressCard}>
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
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>
              <Award size={20} /> Summary Results
            </h3>
            <div
              className={styles.summaryContent}
              dangerouslySetInnerHTML={{ __html: summary }}
            />
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
