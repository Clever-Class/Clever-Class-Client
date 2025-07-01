import React from 'react';
import styles from './LandingShowcase.module.scss';
import { HiAcademicCap, HiChip, HiLightBulb } from 'react-icons/hi';
import { RiRobot2Line } from 'react-icons/ri';
import classNames from 'classnames';

interface LandingShowcaseProps {
  theme?: 'light' | 'dark';
}

export const LandingShowcase: React.FC<LandingShowcaseProps> = ({
  theme = 'light',
}) => {
  return (
    <section className={classNames(styles.landingShowcase, styles[theme])}>
      <div className={styles.gradientOverlay} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <div className={styles.badge}>
              <RiRobot2Line />
              AI Study Companion
            </div>
            <h2 className={styles.title}>
              Your Personal <span>AI Tutor</span> for Every Subject
            </h2>
            <p className={styles.description}>
              Meet your intelligent study partner that understands every
              subject. Chat, share images of problems, or have voice
              conversations with our AI tutor that adapts to your learning style
              and provides instant, expert-level assistance 24/7.
            </p>
          </div>
          <div className={styles.optionsDisplay}>
            <div className={styles.qualityOption}>
              <div className={styles.formatBadge}>
                <HiAcademicCap />
                SMART
              </div>
              <div className={styles.details}>
                <div className={styles.quality}>
                  Subject-Specific AI Tutoring
                </div>
                <div className={styles.size}>
                  Expert guidance in any academic field
                </div>
              </div>
            </div>
            <div className={styles.qualityOption}>
              <div className={styles.formatBadge}>
                <HiLightBulb />
                VISUAL
              </div>
              <div className={styles.details}>
                <div className={styles.quality}>Image Problem Solving</div>
                <div className={styles.size}>
                  Upload & get instant problem solutions
                </div>
              </div>
            </div>
            <div className={styles.qualityOption}>
              <div className={styles.formatBadge}>
                <HiChip />
                VOICE
              </div>
              <div className={styles.details}>
                <div className={styles.quality}>Voice Interaction</div>
                <div className={styles.size}>
                  Natural conversations with AI tutor
                </div>
              </div>
            </div>
            <button className={styles.downloadButton}>
              Start Learning Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingShowcase;
