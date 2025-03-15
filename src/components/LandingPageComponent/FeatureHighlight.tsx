import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';
import styles from './FeatureHighlight.module.scss';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: 'blue' | 'yellow' | 'pink' | 'green';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  variant,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(styles.featureCard, styles[variant])}
    >
      <div className={styles.cardContent}>
        <div className={styles.iconWrapper}>{icon}</div>
        <div className={styles.textContent}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDescription}>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureHighlight: React.FC = () => {
  return (
    <section className={styles.featureSection}>
      {/* Background gradient */}
      <div className={styles.backgroundGradient} />

      {/* Scrolling background */}
      <div className={styles.scrollingBackground} />

      <div className={styles.content}>
        {/* Mobile App Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.badge}
        >
          <span>Mobile App</span>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.title}
        >
          All of Transcript
          <br />
          in Your Pocket.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.description}
        >
          Wherever you go, Transcript follows—our mobile app gives you full
          access to every feature, transforming any location into your personal
          study zone.
        </motion.p>

        {/* Feature Cards Grid */}
        <div className={styles.grid}>
          <FeatureCard
            icon={
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" />
              </svg>
            }
            title="Scan and solve: Simply snap your question and get"
            description="answers instantly."
            variant="blue"
          />

          <FeatureCard
            icon={
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            }
            title="Notebook: Practice and study from your class material"
            description="anywhere."
            variant="yellow"
          />

          <FeatureCard
            icon={
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
            }
            title="AI Chat: Talk with AI for more context into all your"
            description="questions and answers."
            variant="pink"
          />

          <FeatureCard
            icon={
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 7v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-2 0l-7 4-7-4V7l7 4 7-4v10z" />
              </svg>
            }
            title="Sync: Seamlessly stream questions from your"
            description="computer to device."
            variant="green"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlight;
