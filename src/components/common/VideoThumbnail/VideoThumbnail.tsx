import React from 'react';
import { FiPlay } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './VideoThumbnail.module.scss';

export interface VideoThumbnailProps {
  title?: string;
  subtitle?: string;
  duration?: string;
  onClick?: () => void;
  className?: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  title = "How It Works",
  subtitle = "See Clever Class in action",
  duration = "2:30",
  onClick,
  className = ''
}) => {
  return (
    <motion.div
      className={`${styles.thumbnailContainer} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background with gradient and pattern */}
      <div className={styles.thumbnailBackground}>
        <div className={styles.gradientOverlay} />
        <div className={styles.patternOverlay} />
      </div>

      {/* Content */}
      <div className={styles.thumbnailContent}>
        {/* Duration badge */}
        <div className={styles.durationBadge}>
          {duration}
        </div>

        {/* Central play button */}
        <motion.div
          className={styles.playButton}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiPlay className={styles.playIcon} />
        </motion.div>

        {/* Text content */}
        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Decorative elements */}
        <div className={styles.decorativeElements}>
          <div className={styles.floatingIcon} style={{ '--delay': '0s' } as React.CSSProperties}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.floatingIcon} style={{ '--delay': '0.5s' } as React.CSSProperties}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className={styles.floatingIcon} style={{ '--delay': '1s' } as React.CSSProperties}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoThumbnail; 