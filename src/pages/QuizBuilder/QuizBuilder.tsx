import React, { useState, useEffect } from 'react';
import styles from './QuizBuilder.module.scss';
import { FileUploader } from './components/FileUploader';
import { QuizSettings } from './components/QuizSettings';
import { QuizTest } from './components/QuizTest';
import { QuizResults } from './components/QuizResults/QuizResults';
import { QuizHistory } from './components/QuizHistory/QuizHistory';
import { QuizQuestion, QuizWithQuestions, QuizState } from './types';
import { api } from '~api';
import toast from 'react-hot-toast';
import { creditsService } from '~/services';

export const QuizBuilder = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10); // in minutes
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuiz: null,
    currentSession: null,
  });

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setActiveTab('settings');
  };

  const handleStartQuiz = async (quizId?: string) => {
    try {
      setIsLoading(true);

      if (quizId) {
        // Start or resume existing quiz
        const response = await api.ccServer.post(`/quiz/${quizId}/start`);

        setQuizState({
          currentQuiz: {
            _id: response.data.quizId,
            title: response.data.title,
            topic: response.data.topic,
            numQuestions: response.data.questions.length,
            timeLimit: response.data.timeLimit,
            questions: response.data.questions,
            sessions: [],
            createdAt: '',
            updatedAt: '',
          },
          currentSession: {
            sessionIndex: response.data.sessionIndex,
            session: response.data.session,
          },
        });

        setActiveTab('test');
        return;
      }

      // Create form data for new quiz
      const formData = new FormData();
      if (file) formData.append('pdfFile', file);
      formData.append('numQuestions', numQuestions.toString());
      formData.append('timeLimit', timeLimit.toString());

      // Call API to generate questions
      const response = await api.ccServer.post('/quiz/generate', formData);

      if (response.status !== 200) throw new Error('Failed to generate quiz');

      // Refresh credits after generating quiz
      creditsService.refreshCredits();

      // Start the generated quiz
      await handleStartQuiz(response.data.quizId);
    } catch (error: any) {
      // handle different error types
      const errorMessage =
        error.response?.data.message || 'Failed to generate quiz';
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (!quizState.currentSession) return;

    // Get the current answers array
    const currentAnswers = [...quizState.currentSession.session.answers];

    // Check if an answer for this question already exists
    const existingAnswerIndex = currentAnswers.findIndex(
      (answer) => answer.questionId === questionId,
    );

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      currentAnswers[existingAnswerIndex] = { questionId, answerIndex };
    } else {
      // Add new answer
      currentAnswers.push({ questionId, answerIndex });
    }

    // Create or update the answer map for easier access
    const answerMap = { ...(quizState.currentSession.session.answerMap || {}) };
    answerMap[questionId] = answerIndex;

    setQuizState({
      ...quizState,
      currentSession: {
        ...quizState.currentSession,
        session: {
          ...quizState.currentSession.session,
          answers: currentAnswers,
          answerMap,
        },
      },
    });
  };

  const handleSubmitTest = async () => {
    try {
      if (!quizState.currentQuiz || !quizState.currentSession) return;

      setIsLoading(true);

      // Submit quiz to server
      const { _id: quizId } = quizState.currentQuiz;
      const { sessionIndex } = quizState.currentSession;

      const response = await api.ccServer.post(
        `/quiz/${quizId}/sessions/${sessionIndex}/submit`,
      );

      // Update the quiz state with the detailed results
      setQuizState({
        ...quizState,
        currentSession: {
          ...quizState.currentSession,
          session: {
            ...quizState.currentSession.session,
            score: response.data.score,
            isCompleted: true,
            detailedResults: response.data.detailedResults,
            questionResults: response.data.questionResults,
            answerMap: response.data.answerMap,
          },
        },
      });

      setActiveTab('results');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUp = () => {
    toast.error('Time is up! Your quiz will be submitted automatically.');
    handleSubmitTest();
  };

  const handleRetakeQuiz = () => {
    if (!quizState.currentQuiz) return;
    handleStartQuiz(quizState.currentQuiz._id);
  };

  const handleTimeRemainingChange = (seconds: number) => {
    if (!quizState.currentSession) return;

    setQuizState({
      ...quizState,
      currentSession: {
        ...quizState.currentSession,
        session: {
          ...quizState.currentSession.session,
          timeRemaining: seconds,
        },
      },
    });
  };

  const resetQuizBuilder = () => {
    setFile(null);
    setQuizState({
      currentQuiz: null,
      currentSession: null,
    });
    setActiveTab('history');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Your Quizzes</h2>
              <p className={styles.cardDescription}>
                View your quiz history or create a new quiz.
              </p>
            </div>
            <div className={styles.cardContent}>
              <QuizHistory onStartQuiz={handleStartQuiz} />
            </div>
            <div className={styles.cardFooter}>
              <button
                onClick={() => setActiveTab('upload')}
                className={`${styles.button} ${styles.primary}`}
              >
                Create New Quiz
              </button>
            </div>
          </div>
        );
      case 'upload':
        return (
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Upload Study Material</h2>
              <p className={styles.cardDescription}>
                Upload a PDF file containing the study material. Our AI will
                generate quiz questions based on this content.
              </p>
            </div>
            <div className={styles.cardContent}>
              <FileUploader onFileUpload={handleFileUpload} />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quiz Settings</h2>
              <p className={styles.cardDescription}>
                Configure your quiz parameters.
              </p>
            </div>
            <div className={styles.cardContent}>
              <QuizSettings
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                timeLimit={timeLimit}
                setTimeLimit={setTimeLimit}
              />
            </div>
            <div className={styles.cardFooter}>
              <button
                onClick={() => handleStartQuiz()}
                disabled={isLoading}
                className={`${styles.button} ${styles.primary}`}
              >
                {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
              </button>
            </div>
          </div>
        );
      case 'test': {
        if (!quizState.currentQuiz || !quizState.currentSession) {
          return <div>Loading quiz...</div>;
        }
        const testProps = {
          questions: quizState.currentQuiz.questions,
          answers: quizState.currentSession.session.answers,
          answerMap: quizState.currentSession.session.answerMap,
          onAnswerSelect: handleAnswerSelect,
          onSubmit: handleSubmitTest,
          timeRemaining: quizState.currentSession.session.timeRemaining,
          setTimeRemaining: handleTimeRemainingChange,
          onTimeUp: handleTimeUp,
          quizId: quizState.currentQuiz._id,
          sessionIndex: quizState.currentSession.sessionIndex,
        };
        return <QuizTest {...testProps} />;
      }
      case 'results': {
        if (!quizState.currentQuiz || !quizState.currentSession) {
          return <div>Loading results...</div>;
        }
        const resultsProps = {
          questions: quizState.currentQuiz.questions,
          userAnswers: quizState.currentSession.session.answers,
          userAnswerMap: quizState.currentSession.session.answerMap,
          score: quizState.currentSession.session.score || 0,
          onRetake: handleRetakeQuiz,
          detailedResults: quizState.currentSession.session.detailedResults,
          questionResults: quizState.currentSession.session.questionResults,
        };
        return <QuizResults {...resultsProps} />;
      }
      default:
        return null;
    }
  };

  const isTabDisabled = (tab: string) => {
    switch (tab) {
      case 'history':
        return false;
      case 'upload':
        return false;
      case 'settings':
        return !file;
      case 'test':
        return (
          !quizState.currentQuiz ||
          !quizState.currentSession ||
          quizState.currentSession.session.isCompleted
        );
      case 'results':
        return (
          !quizState.currentQuiz ||
          !quizState.currentSession ||
          !quizState.currentSession.session.isCompleted
        );
      default:
        return false;
    }
  };

  return (
    <div className={styles.quizContainer}>
      <h1 className={styles.title}>AI Quiz Builder</h1>
      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'history' ? styles.active : ''
          }`}
          onClick={() => !isTabDisabled('history') && setActiveTab('history')}
        >
          My Quizzes
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'upload' ? styles.active : ''
          }`}
          onClick={() => !isTabDisabled('upload') && setActiveTab('upload')}
        >
          Upload
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'settings' ? styles.active : ''
          } ${isTabDisabled('settings') ? styles.disabled : ''}`}
          onClick={() => !isTabDisabled('settings') && setActiveTab('settings')}
        >
          Settings
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'test' ? styles.active : ''
          } ${isTabDisabled('test') ? styles.disabled : ''}`}
          onClick={() => !isTabDisabled('test') && setActiveTab('test')}
        >
          Test
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'results' ? styles.active : ''
          } ${isTabDisabled('results') ? styles.disabled : ''}`}
          onClick={() => !isTabDisabled('results') && setActiveTab('results')}
        >
          Results
        </div>
      </div>
      <div className={styles.quizArea}>{renderContent()}</div>
    </div>
  );
};
