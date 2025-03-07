import { useState } from 'react';
import { History as HistoryIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './History.module.scss';

interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

export const History = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Example history items - replace with your actual history data
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      title: 'Updated profile picture',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      title: 'Changed display name',
      timestamp: '1 hour ago',
    },
    // Add more history items as needed
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: 20, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        mass: 0.9,
        delay: i * 0.1,
      },
    }),
  };

  return (
    <>
      <button
        className={`${styles.historyButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle history"
      >
        <HistoryIcon />
      </button>

      <div>
        {isOpen && (
          <div className={styles.historyPanel}>
            <div className={styles.historyList}>
              {historyItems.map((item, index) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyIcon}>
                    <Clock />
                  </div>
                  <div className={styles.historyContent}>
                    <div className={styles.historyTitle}>{item.title}</div>
                    <div className={styles.historyTime}>{item.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
