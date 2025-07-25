import React, { useEffect, useState } from 'react';
import { api } from '~api';
import { Quiz } from '../../types';
import styles from '../../QuizBuilder.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import toast from 'react-hot-toast';

dayjs.extend(relativeTime);

interface QuizHistoryProps {
  onStartQuiz: (quizId: string) => void;
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ onStartQuiz }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await api.ccServer.get('/quiz/user');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load your quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const getQuizStatus = (quiz: Quiz) => {
    if (quiz.sessions.length === 0) {
      return 'Not started';
    }

    const lastSession = quiz.sessions[quiz.sessions.length - 1];

    if (lastSession.isCompleted) {
      return `Completed (${Math.round(lastSession.score! * 100)}%)`;
    }

    const timeRemainingSeconds = lastSession.timeRemaining;
    if (timeRemainingSeconds <= 0) {
      return 'Time expired';
    }

    const minutesRemaining = Math.ceil(timeRemainingSeconds / 60);
    return `In progress (${minutesRemaining} min left)`;
  };

  const getActionButton = (quiz: Quiz) => {
    if (quiz.sessions.length === 0) {
      return (
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={() => onStartQuiz(quiz._id)}
        >
          Start Quiz
        </button>
      );
    }

    const lastSession = quiz.sessions[quiz.sessions.length - 1];

    if (lastSession.isCompleted || lastSession.timeRemaining <= 0) {
      return (
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => onStartQuiz(quiz._id)}
        >
          Retake Quiz
        </button>
      );
    }

    return (
      <button
        className={`${styles.button} ${styles.success}`}
        onClick={() => onStartQuiz(quiz._id)}
      >
        Continue Quiz
      </button>
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading your quizzes...</div>;
  }

  if (quizzes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No quizzes yet</h3>
        <p>Upload a PDF to create your first quiz!</p>
      </div>
    );
  }

  return (
    <div className={styles.quizHistoryContainer}>
      <h2>Your Quizzes</h2>
      <div className={styles.quizList}>
        {quizzes.map((quiz) => (
          <div key={quiz._id} className={styles.quizCard}>
            <div className={styles.quizCardHeader}>
              <h3 className={styles.quizTitle}>{quiz.title}</h3>
              <span className={styles.quizTopic}>{quiz.topic}</span>
            </div>
            <div className={styles.quizCardDetails}>
              <div className={styles.quizInfo}>
                <div>
                  <span className={styles.infoLabel}>Questions:</span>{' '}
                  {quiz.numQuestions}
                </div>
                <div>
                  <span className={styles.infoLabel}>Time Limit:</span>{' '}
                  {quiz.timeLimit} min
                </div>
                <div>
                  <span className={styles.infoLabel}>Created:</span>{' '}
                  {dayjs(quiz.createdAt).fromNow()}
                </div>
                <div>
                  <span className={styles.infoLabel}>Status:</span>{' '}
                  {getQuizStatus(quiz)}
                </div>
                {quiz.sessions.length > 0 &&
                  quiz.sessions[quiz.sessions.length - 1].isCompleted && (
                    <div>
                      <span className={styles.infoLabel}>Best Score:</span>{' '}
                      {Math.round(
                        Math.max(
                          ...quiz.sessions
                            .filter((s) => s.isCompleted)
                            .map((s) => s.score! * 100),
                        ),
                      )}
                      %
                    </div>
                  )}
              </div>
              <div className={styles.quizActions}>{getActionButton(quiz)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
