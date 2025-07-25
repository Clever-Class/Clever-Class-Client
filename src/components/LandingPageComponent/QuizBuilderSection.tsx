import React from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '~/lib/utils';
import {
  LuLightbulb,
  LuUpload,
  LuPencil,
  LuClipboardCheck,
  LuClock,
  LuCheck,
} from 'react-icons/lu';
import styles from './QuizBuilderSection.module.scss';
import QuizBuilderDemo from './QuizBuilderDemo';

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
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };



  return (
    <motion.section 
      id="quiz-builder"
      className={styles.featureSection}
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Background gradient */}
      <div className={styles.backgroundGradient} />

      <div className={styles.content}>
        {/* Mobile App Badge */}
        <motion.div
          variants={itemVariants}
          className={styles.badge}
        >
          <LuLightbulb size={18} style={{ marginRight: '8px' }} />
          <span>AI Quiz Builder</span>
        </motion.div>

        {/* Main Content - Info Section Only */}
        <motion.div 
          className={styles.mainContent}
          variants={itemVariants}
        >
          {/* Information Section */}
          <div className={styles.infoSection}>
            {/* Main Title */}
            <motion.h2
              variants={itemVariants}
              className={styles.title}
            >
              Make Smart Quizzes
              <br />
              With Your Study Materials
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className={styles.description}
            >
              Upload your PDFs, notes, or handouts — and let Clever Class turn them
              into custom AI-powered quizzes. Test yourself, track your progress,
              and master your material faster.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className={styles.trustIndicators}
            >
              <div className={styles.trustItem}>
                <LuCheck className={styles.trustIcon} />
                <span>Works with any PDF or document</span>
              </div>
              <div className={styles.trustItem}>
                <LuCheck className={styles.trustIcon} />
                <span>AI-powered smart questions</span>
              </div>
              <div className={styles.trustItem}>
                <LuCheck className={styles.trustIcon} />
                <span>Instant quiz generation</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Positioned Demo Component */}
        <div className={styles.demoWrapper}>
          <QuizBuilderDemo />
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          className={styles.grid}
          variants={containerVariants}
        >
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
        </motion.div>
      </div>
    </motion.section>
  );
};

export default QuizBuilderSection;
