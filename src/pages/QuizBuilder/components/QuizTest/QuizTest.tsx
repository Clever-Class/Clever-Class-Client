import React, { useEffect, useState } from 'react';
import styles from '../../QuizBuilder.module.scss';
import { QuizAnswer, QuizQuestion } from '../../types';
import { api } from '~api';
import toast from 'react-hot-toast';

interface QuizTestProps {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  answerMap?: Record<number, number>;
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
  onSubmit: () => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  onTimeUp: () => void;
  quizId?: string;
  sessionIndex?: number;
}

export const QuizTest: React.FC<QuizTestProps> = ({
  questions,
  answers,
  answerMap = {},
  onAnswerSelect,
  onSubmit,
  timeRemaining,
  setTimeRemaining,
  onTimeUp,
  quizId,
  sessionIndex,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [syncing, setSyncing] = useState(false);

  // Create an answer map if not provided
  const getAnswerMap = (): Record<number, number> => {
    if (Object.keys(answerMap).length > 0) return answerMap;

    const map: Record<number, number> = {};
    answers.forEach((answer) => {
      map[answer.questionId] = answer.answerIndex;
    });
    return map;
  };

  const currentAnswerMap = getAnswerMap();
  const currentQuestion = questions[currentQuestionIndex];

  // Sync an answer with the server
  const syncAnswer = async (questionId: number, answerIndex: number) => {
    if (!quizId || sessionIndex === undefined) return;

    try {
      setSyncing(true);
      await api.ccServer.post(
        `/quiz/${quizId}/sessions/${sessionIndex}/answer`,
        {
          questionId,
          answerIndex,
          timeRemaining,
        },
      );
    } catch (error) {
      console.error('Error syncing answer:', error);
      toast.error('Failed to save your answer');
    } finally {
      setSyncing(false);
    }
  };

  // Handle timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    // Sync time remaining with the server
    const syncTimeRemaining = async (time: number) => {
      if (!quizId || sessionIndex === undefined) return;

      try {
        await api.ccServer.post(
          `/quiz/${quizId}/sessions/${sessionIndex}/answer`,
          {
            timeRemaining: time,
          },
        );
      } catch (error) {
        console.error('Error syncing time:', error);
      }
    };

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);

      // Sync remaining time with server every 30 seconds
      if (quizId && sessionIndex !== undefined && timeRemaining % 30 === 0) {
        syncTimeRemaining(timeRemaining - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp, setTimeRemaining, quizId, sessionIndex]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return;
    onAnswerSelect(currentQuestion.id, answerIndex);
    syncAnswer(currentQuestion.id, answerIndex);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const questionProgress = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;

  // If there are no questions, display a message
  if (!questions || questions.length === 0) {
    return (
      <div className={styles.quizTestContainer}>No questions available.</div>
    );
  }

  return (
    <div className={`${styles.quizTestContainer} ${styles.fadeIn}`}>
      <div className={styles.quizHeader}>
        <div className={styles.progressInfo}>
          <div className={styles.questionProgress}>{questionProgress}</div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className={styles.timer}>
          Time remaining:{' '}
          <span className={timeRemaining < 60 ? styles.warning : ''}>
            {formatTime(timeRemaining)}
          </span>
          {syncing && (
            <span className={styles.syncingIndicator}>Saving...</span>
          )}
        </div>
      </div>

      <div className={styles.questionContainer}>
        {currentQuestion ? (
          <>
            <h3 className={styles.questionText}>{currentQuestion.question}</h3>
            <div className={styles.answerOptions}>
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.answerOption} ${
                    currentAnswerMap[currentQuestion.id] === index
                      ? styles.selected
                      : ''
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className={styles.optionIndicator}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className={styles.optionText}>{option}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>Loading question...</div>
        )}
      </div>

      <div className={styles.navigationControls}>
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={onSubmit}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={goToNextQuestion}
          >
            Next
          </button>
        )}
      </div>

      <div className={styles.questionNavigation}>
        {questions.map((question, index) => (
          <div
            key={index}
            className={`${styles.questionIndicator} ${
              index === currentQuestionIndex ? styles.currentQuestion : ''
            } ${
              currentAnswerMap[question.id] !== undefined ? styles.answered : ''
            }`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};
