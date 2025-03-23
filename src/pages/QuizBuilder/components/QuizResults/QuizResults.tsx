import React from 'react';
import { CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './QuizResults.module.scss';
import { QuestionResult, QuizAnswer } from '../../types';

// Define interfaces locally
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: QuizAnswer[];
  userAnswerMap?: Record<number, number>;
  score: number;
  onRetake: () => void;
  detailedResults?: Record<number, boolean>;
  questionResults?: QuestionResult[];
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  userAnswerMap,
  score,
  onRetake,
  detailedResults,
  questionResults,
}) => {
  // Create an answer map if not provided
  const answerMap: Record<number, number> = userAnswerMap || {};
  if (!userAnswerMap && userAnswers) {
    userAnswers.forEach((answer) => {
      answerMap[answer.questionId] = answer.answerIndex;
    });
  }

  const percentage = Math.round(score * 100);
  const correctCount = Math.round(score * questions.length);
  const answeredCount = userAnswers.length;

  // Get feedback based on score
  const getFeedback = () => {
    if (percentage >= 90) return "Outstanding! You've mastered this material.";
    if (percentage >= 80)
      return 'Excellent work! You have a strong understanding.';
    if (percentage >= 70) return "Good job! You're on the right track.";
    if (percentage >= 60)
      return "Not bad! With a bit more study, you'll improve.";
    return 'Keep practicing! Review the material and try again.';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className={styles.resultsContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.summaryContainer} variants={itemVariants}>
        <motion.div
          className={styles.scoreCircle}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className={styles.scoreValue}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {percentage}%
          </motion.div>
          <svg className={styles.progressRing} width="160" height="160">
            <circle
              className={styles.progressRingCircle}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
            />
            <motion.circle
              className={styles.progressRingCircleValue}
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
              initial={{ strokeDashoffset: 440 }}
              animate={{
                strokeDashoffset: 440 - (440 * percentage) / 100,
                transition: { duration: 1.5, delay: 0.2, ease: 'easeOut' },
              }}
              strokeDasharray="440"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary-color)" />
                <stop offset="100%" stopColor="var(--primary-light)" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.div className={styles.scoreDetails} variants={itemVariants}>
          <div className={styles.scoreText}>
            You answered {answeredCount} out of {questions.length} questions and
            got {correctCount} correct.
          </div>
          <div className={styles.feedbackText}>{getFeedback()}</div>
        </motion.div>
      </motion.div>

      <motion.div className={styles.statsContainer} variants={itemVariants}>
        <div className={styles.statsHeader}>
          <BarChart2 className={styles.statsIcon} />
          <h3>Performance Breakdown</h3>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{percentage}%</div>
            <div className={styles.statLabel}>Overall Score</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{correctCount}</div>
            <div className={styles.statLabel}>Correct Answers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {answeredCount - correctCount}
            </div>
            <div className={styles.statLabel}>Incorrect Answers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{answeredCount}</div>
            <div className={styles.statLabel}>Questions Attempted</div>
          </div>
        </div>
      </motion.div>

      <motion.h2 className={styles.reviewHeader} variants={itemVariants}>
        Question Review
      </motion.h2>

      <div className={styles.questionReviewList}>
        {(questionResults || questions).map((item, qIndex) => {
          if (questionResults) {
            const result = item as QuestionResult;

            return (
              <motion.div
                key={result.questionId}
                className={`${styles.reviewCard} ${
                  result.isCorrect ? styles.correct : styles.incorrect
                }`}
                variants={itemVariants}
              >
                <div className={styles.questionHeader}>
                  {result.isCorrect ? (
                    <CheckCircle
                      className={`${styles.statusIcon} ${styles.correct}`}
                    />
                  ) : (
                    <XCircle
                      className={`${styles.statusIcon} ${styles.incorrect}`}
                    />
                  )}
                  <h3 className={styles.questionText}>
                    {qIndex + 1}. {result.question}
                  </h3>
                </div>

                <div className={styles.optionsList}>
                  {result.options.map((option, oIndex) => {
                    const isSelected = result.userAnswerIndex === oIndex;
                    const isCorrectAnswer =
                      oIndex === result.correctAnswerIndex;

                    return (
                      <div
                        key={oIndex}
                        className={`${styles.optionItem} ${
                          isSelected ? styles.selected : ''
                        } ${isCorrectAnswer ? styles.correct : ''}`}
                      >
                        <div
                          className={`${styles.optionMarker} ${
                            isSelected ? styles.selected : ''
                          } ${isCorrectAnswer ? styles.correct : ''}`}
                        >
                          {String.fromCharCode(65 + oIndex)}
                        </div>
                        <div className={styles.optionText}>{option}</div>
                      </div>
                    );
                  })}
                </div>

                {result.explanation && (
                  <div className={styles.explanationBox}>
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                )}
              </motion.div>
            );
          } else {
            const question = item as QuizQuestion;
            const userAnswer = answerMap[question.id];
            const isCorrect = detailedResults
              ? detailedResults[question.id]
              : userAnswer === question.correctAnswerIndex;

            return (
              <motion.div
                key={question.id}
                className={`${styles.reviewCard} ${
                  isCorrect ? styles.correct : styles.incorrect
                }`}
                variants={itemVariants}
              >
                <div className={styles.questionHeader}>
                  {isCorrect ? (
                    <CheckCircle
                      className={`${styles.statusIcon} ${styles.correct}`}
                    />
                  ) : (
                    <XCircle
                      className={`${styles.statusIcon} ${styles.incorrect}`}
                    />
                  )}
                  <h3 className={styles.questionText}>
                    {qIndex + 1}. {question.question}
                  </h3>
                </div>

                <div className={styles.optionsList}>
                  {question.options.map((option, oIndex) => {
                    const isSelected = userAnswer === oIndex;
                    const isCorrectAnswer =
                      oIndex === question.correctAnswerIndex;

                    return (
                      <div
                        key={oIndex}
                        className={`${styles.optionItem} ${
                          isSelected ? styles.selected : ''
                        } ${isCorrectAnswer ? styles.correct : ''}`}
                      >
                        <div
                          className={`${styles.optionMarker} ${
                            isSelected ? styles.selected : ''
                          } ${isCorrectAnswer ? styles.correct : ''}`}
                        >
                          {String.fromCharCode(65 + oIndex)}
                        </div>
                        <div className={styles.optionText}>{option}</div>
                      </div>
                    );
                  })}
                </div>

                {question.explanation && (
                  <div className={styles.explanationBox}>
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </motion.div>
            );
          }
        })}
      </div>

      <motion.div
        className={styles.retakeButtonContainer}
        variants={itemVariants}
      >
        <motion.button
          className={styles.retakeButton}
          onClick={onRetake}
          whileHover={{
            scale: 1.03,
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          Retake Quiz
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
