import React, { useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './QuizTest.module.scss';

// Define interface locally
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface QuizTestProps {
  questions: QuizQuestion[];
  answers: Record<number, number>;
  onAnswerSelect: (questionIndex: number, answerIndex: number) => void;
  onSubmit: () => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  onTimeUp: () => void;
}

export const QuizTest: React.FC<QuizTestProps> = ({
  questions,
  answers,
  onAnswerSelect,
  onSubmit,
  timeRemaining,
  setTimeRemaining,
  onTimeUp,
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Implement countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, setTimeRemaining, onTimeUp]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  const isLowTime = timeRemaining < 60;

  return (
    <motion.div
      className={styles.testContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className={styles.testHeader}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.testTitle}>Quiz in Progress</h2>
        <motion.div
          className={`${styles.timerContainer} ${
            isLowTime ? styles.warning : ''
          }`}
          animate={
            isLowTime
              ? {
                  scale: [1, 1.05, 1],
                  transition: { repeat: Infinity, duration: 1.5 },
                }
              : {}
          }
        >
          <Clock className={styles.timerIcon} />
          <span className={styles.timerText}>{formatTime(timeRemaining)}</span>
          {isLowTime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.timerWarning}
            >
              <AlertTriangle size={16} />
              <span>Time's running out!</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <div className={styles.questionList}>
        {questions.map((question, qIndex) => (
          <motion.div
            key={question.id}
            className={styles.questionCard}
            variants={cardVariants}
            whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
          >
            <div className={styles.questionHeader}>
              <div className={styles.questionNumber}>{qIndex + 1}</div>
              <h3 className={styles.questionText}>{question.question}</h3>
            </div>
            <div className={styles.optionsContainer}>
              <div className={styles.optionsList}>
                {question.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  return (
                    <motion.div
                      key={oIndex}
                      className={`${styles.optionItem} ${
                        isSelected ? styles.selected : ''
                      }`}
                      onClick={() => onAnswerSelect(qIndex, oIndex)}
                      whileHover={{
                        backgroundColor: 'rgba(255, 255, 255, 0.07)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={false}
                      animate={
                        isSelected
                          ? {
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              borderColor: '#3b82f6',
                              transition: { duration: 0.2 },
                            }
                          : {}
                      }
                    >
                      <div
                        className={`${styles.optionMarker} ${
                          isSelected ? styles.selected : ''
                        }`}
                      >
                        {String.fromCharCode(65 + oIndex)}
                      </div>
                      <div className={styles.optionText}>{option}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className={styles.footerContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + 0.12 * questions.length, duration: 0.5 }}
      >
        <div className={styles.progressInfo}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${
                  (Object.keys(answers).length / questions.length) * 100
                }%`,
              }}
            />
          </div>
          <p className={styles.progressText}>
            {Object.keys(answers).length} of {questions.length} questions
            answered
          </p>
        </div>
        <motion.button
          onClick={onSubmit}
          className={styles.submitButton}
          whileHover={{
            scale: 1.03,
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          Submit Quiz
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
