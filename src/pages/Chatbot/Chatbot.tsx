import { useState } from 'react';
import {
  HiMicrophone,
  HiPaperClip,
  HiSquares2X2,
  HiAcademicCap,
  HiBookOpen,
  HiGlobeAlt,
  HiBeaker,
  HiPaperAirplane,
  HiClock,
} from 'react-icons/hi2';
import { motion } from 'framer-motion';
import styles from './Chatbot.module.scss';
import { History } from '~/components/History/History';

export function Chatbot() {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: Implement message sending logic
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const subjects = [
    { icon: <HiClock />, label: 'History' },
    { icon: <HiSquares2X2 />, label: 'Math Tutor' },
    { icon: <HiBeaker />, label: 'Physics Guide' },
    { icon: <HiBookOpen />, label: 'Lit Analysis' },
    { icon: <HiGlobeAlt />, label: 'History Insights' },
    { icon: <HiAcademicCap />, label: 'Science Mentor' },
  ];

  return (
    <div className={styles.chatContainer}>
      <History />
      <motion.div
        className={styles.chatArea}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.welcomeScreen}>
          <h1>What can I help with?</h1>

          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="Message Your Clever AI Tutor"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className={styles.inputActions}>
              <button aria-label="Voice input">
                <HiMicrophone size={20} />
              </button>
              <button aria-label="Attach file">
                <HiPaperClip size={20} />
              </button>
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                aria-label="Send message"
              >
                <HiPaperAirplane size={18} />
              </button>
            </div>
          </div>

          <div className={styles.subjectButtons}>
            {subjects.map((subject, index) => (
              <motion.button
                key={subject.label}
                className={styles.subjectButton}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {subject.icon}
                {subject.label}
              </motion.button>
            ))}
          </div>

          <p className={styles.disclaimer}>
            Clever AI Tutor can make mistakes. Consider checking important
            information.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
