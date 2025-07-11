import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';
import {
  LuLightbulb,
  LuUpload,
  LuPencil,
  LuClipboardCheck,
  LuClock,
} from 'react-icons/lu';
import styles from './QuizBuilderSection.module.scss';

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

const QuizBuilderSection: React.FC = () => {
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
          <LuLightbulb size={18} style={{ marginRight: '8px' }} />
          <span>AI Quiz Builder</span>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.title}
        >
          Make Smart Quizzes
          <br />
          With Your Study Materials
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.description}
        >
          Upload your PDFs, notes, or handouts — and let Clever Class turn them
          into custom AI-powered quizzes. Test yourself, track your progress,
          and master your material faster.
        </motion.p>

        {/* Feature Cards Grid */}
        <div className={styles.grid}>
          <FeatureCard
            icon={<LuUpload size={24} />}
            title="Upload & Generate"
            description="Drop in your class notes, textbooks, or PDFs. Our AI instantly scans your material and creates tailored quizzes."
            variant="blue"
          />

          <FeatureCard
            icon={<LuPencil size={24} />}
            title="Take Live Quizzes"
            description="Test yourself in a clean, distraction-free exam mode with custom question count and time limits."
            variant="yellow"
          />

          <FeatureCard
            icon={<LuClipboardCheck size={24} />}
            title="Instant Results & Feedback"
            description="Get your score and detailed answers instantly. See what to review and sharpen your weak spots."
            variant="pink"
          />

          <FeatureCard
            icon={<LuClock size={24} />}
            title="Save & Track Progress"
            description="Every quiz is saved for review. Monitor your improvement and revisit topics when needed."
            variant="green"
          />
        </div>
      </div>
    </section>
  );
};

export default QuizBuilderSection;
