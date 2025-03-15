import React from 'react';
import styles from './LandingShowcase.module.scss';
import { HiAcademicCap, HiChip, HiLightBulb } from 'react-icons/hi';
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
              <HiChip />
              AI-Powered Learning
            </div>
            <h2 className={styles.title}>
              Transform Your Learning with <span>AI-Enhanced</span> Education
            </h2>
            <p className={styles.description}>
              Experience the future of education with CleverClass. Our
              AI-powered platform adapts to your learning style, providing
              personalized guidance and intelligent feedback to help you master
              any subject.
            </p>
          </div>
          <div className={styles.optionsDisplay}>
            <div className={styles.qualityOption}>
              <div className={styles.formatBadge}>
                <HiAcademicCap />
                PRO
              </div>
              <div className={styles.details}>
                <div className={styles.quality}>Personalized Learning Path</div>
                <div className={styles.size}>
                  AI-tailored curriculum & progress tracking
                </div>
              </div>
            </div>
            <div className={styles.qualityOption}>
              <div className={styles.formatBadge}>
                <HiLightBulb />
                SMART
              </div>
              <div className={styles.details}>
                <div className={styles.quality}>Intelligent Tutoring</div>
                <div className={styles.size}>
                  24/7 AI assistance & instant feedback
                </div>
              </div>
            </div>
            <div className={styles.qualityOption}>
              <div className={styles.formatBadge}>
                <HiChip />
                PREMIUM
              </div>
              <div className={styles.details}>
                <div className={styles.quality}>Advanced Analytics</div>
                <div className={styles.size}>
                  Deep learning insights & performance metrics
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
