import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock } from 'lucide-react';
import styles from './QuizSettings.module.scss';

// Define props interface locally
interface QuizSettingsProps {
  numQuestions: number;
  setNumQuestions: (num: number) => void;
  timeLimit: number;
  setTimeLimit: (limit: number) => void;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({
  numQuestions,
  setNumQuestions,
  timeLimit,
  setTimeLimit,
}) => {
  const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumQuestions(parseInt(e.target.value));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeLimit(parseInt(e.target.value));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
      className={styles.settingsContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.settingGroup} variants={itemVariants}>
        <div className={styles.settingHeader}>
          <div className={styles.iconContainer}>
            <Settings size={18} />
          </div>
          <label htmlFor="num-questions" className={styles.settingLabel}>
            Number of Questions
          </label>
        </div>
        <div className={styles.selectWrapper}>
          <select
            id="num-questions"
            className={styles.select}
            value={numQuestions.toString()}
            onChange={handleQuestionChange}
          >
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="15">15 questions</option>
            <option value="20">20 questions</option>
            <option value="25">25 questions</option>
          </select>
        </div>
        <p className={styles.helperText}>
          Select how many questions you want in your quiz
        </p>
      </motion.div>

      <motion.div className={styles.settingGroup} variants={itemVariants}>
        <div className={styles.settingHeader}>
          <div className={styles.iconContainer}>
            <Clock size={18} />
          </div>
          <label htmlFor="time-limit" className={styles.settingLabel}>
            Time Limit (minutes)
          </label>
        </div>
        <div className={styles.selectWrapper}>
          <select
            id="time-limit"
            className={styles.select}
            value={timeLimit.toString()}
            onChange={handleTimeChange}
          >
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
        <p className={styles.helperText}>
          Set the time limit for completing the quiz
        </p>
      </motion.div>
    </motion.div>
  );
};
