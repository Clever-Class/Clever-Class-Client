import React, { memo } from 'react';
import styles from './LandingShowcase.module.scss';
import { HiAcademicCap, HiChip, HiLightBulb } from 'react-icons/hi';
import { RiRobot2Line } from 'react-icons/ri';
import { FaYoutube, FaHeadphones, FaFileAlt } from 'react-icons/fa';
import classNames from 'classnames';

interface FeatureOption {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
}

interface LandingShowcaseProps {
  theme?: 'light' | 'dark';
  badgeIcon?: React.ReactNode;
  badgeText?: string;
  title?: string;
  highlightedWord?: string;
  description?: string;
  features?: FeatureOption[];
  buttonText?: string;
  onButtonClick?: () => void;
}

const defaultFeatures: FeatureOption[] = [
  {
    icon: <HiAcademicCap />,
    badge: 'SMART',
    title: 'Subject-Specific AI Tutoring',
    description: 'Expert guidance in any academic field'
  },
  {
    icon: <HiLightBulb />,
    badge: 'VISUAL',
    title: 'Image Problem Solving',
    description: 'Upload & get instant problem solutions'
  },
  {
    icon: <HiChip />,
    badge: 'VOICE',
    title: 'Voice Interaction',
    description: 'Natural conversations with AI tutor'
  }
];

export const LandingShowcase: React.FC<LandingShowcaseProps> = memo(({
  theme = 'light',
  badgeIcon = <RiRobot2Line />,
  badgeText = 'AI Study Companion',
  title = 'Your Personal AI Tutor for Every Subject',
  highlightedWord = 'AI Tutor',
  description = 'Meet your intelligent study partner that understands every subject. Chat, share images of problems, or have voice conversations with our AI tutor that adapts to your learning style and provides instant, expert-level assistance 24/7.',
  features = defaultFeatures,
  buttonText = 'Start Learning Now',
  onButtonClick
}) => {
  const renderTitle = () => {
    if (!highlightedWord) return title;
    
    const parts = title.split(highlightedWord);
    if (parts.length === 1) return title;
    
    return (
      <>
        {parts[0]}
        <span>{highlightedWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className={classNames(styles.landingShowcase, styles[theme])}>
      <div className={styles.gradientOverlay} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <div className={styles.badge}>
              {badgeIcon}
              {badgeText}
            </div>
            <h2 className={styles.title}>
              {renderTitle()}
            </h2>
            <p className={styles.description}>
              {description}
            </p>
          </div>
          <div className={styles.optionsDisplay}>
            {features.map((feature, index) => (
              <div key={index} className={styles.qualityOption}>
                <div className={styles.formatBadge}>
                  {feature.icon}
                  {feature.badge}
                </div>
                <div className={styles.details}>
                  <div className={styles.quality}>
                    {feature.title}
                  </div>
                  <div className={styles.size}>
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
            <button className={styles.downloadButton} onClick={onButtonClick}>
              {buttonText}
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
});

export default LandingShowcase;
