import React from 'react';
import styles from './CTASection.module.scss';
import {
  HiArrowRight,
  HiSparkles,
  HiAcademicCap,
  HiLightBulb,
  HiChip,
  HiCube,
} from 'react-icons/hi';

export const CTASection: React.FC = () => {
  const icons = [HiSparkles, HiAcademicCap, HiLightBulb, HiChip, HiCube];
  const generateIcons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => {
        const Icon = icons[i % icons.length];
        return <Icon key={i} />;
      });
  };

  return (
    <section className={styles.ctaSection}>
      <div className={styles.gradientOverlay} />
      <div className={styles.patternBackground}>
        <div className={styles.row}>{generateIcons(10)}</div>
        <div className={styles.row}>{generateIcons(10)}</div>
        <div className={styles.row}>{generateIcons(10)}</div>
        <div className={styles.row}>{generateIcons(10)}</div>
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <HiSparkles />
            <span>Start Learning Today</span>
          </div>
          <h2 className={styles.title}>
            Ready to transform your
            <span className={styles.highlight}> learning journey</span>?
          </h2>
          <p className={styles.description}>
            Access powerful AI-driven tools to study smarter, achieve higher
            grades, and unlock your full academic potential with CleverClass.
          </p>
          <div className={styles.actions}>
            <button className={styles.primaryButton}>
              Get Started
              <HiArrowRight />
            </button>
            {/* <button className={styles.secondaryButton}>
              View Demo
              <HiArrowRight />
            </button> */}
          </div>
        </div>
        <div className={styles.cardPreview}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardBadge}>AI Study Assistant</div>
              <div className={styles.cardIcon}>
                <HiSparkles />
              </div>
            </div>
            <div className={styles.cardContent}>
              "Transform your study sessions with personalized AI guidance and
              instant answers to your questions..."
            </div>
            <div className={styles.cardFooter}>
              <div className={styles.stat}>
                <span className={styles.statValue}>24/7</span>
                <span className={styles.statLabel}>Support</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>98%</span>
                <span className={styles.statLabel}>Success Rate</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>5x</span>
                <span className={styles.statLabel}>Faster Learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
