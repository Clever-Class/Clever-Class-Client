import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { AppRoutes } from '~constants';
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-100px",
    amount: 0.3 
  });

  const icons = [HiSparkles, HiAcademicCap, HiLightBulb, HiChip, HiCube];
  
  // Reduced icon count for better performance
  const generateIcons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => {
        const Icon = icons[i % icons.length];
        return <Icon key={i} />;
      });
  };

  // Framer Motion variants
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

  const cardVariants = {
    hidden: { opacity: 0, y: 40, rotateX: 10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.3
      }
    }
  };

  return (
    <motion.section 
      className={styles.ctaSection}
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className={styles.gradientOverlay} />
      <div className={styles.patternBackground}>
        {/* Reduced from 4 rows to 3 rows with 8 icons each for better performance */}
        <motion.div 
          className={styles.row}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 25,
            ease: 'linear',
            repeat: Infinity
          }}
        >
          {generateIcons(8)}
        </motion.div>
        <motion.div 
          className={styles.row}
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity
          }}
        >
          {generateIcons(8)}
        </motion.div>
        <motion.div 
          className={styles.row}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 28,
            ease: 'linear',
            repeat: Infinity
          }}
        >
          {generateIcons(8)}
        </motion.div>
      </div>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          variants={containerVariants}
        >
          <motion.div 
            className={styles.badge}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <HiSparkles />
            <span>Start Learning Today</span>
          </motion.div>
          <motion.h2 
            className={styles.title}
            variants={itemVariants}
          >
            Ready to transform your
            <span className={styles.highlight}> learning journey</span>?
          </motion.h2>
          <motion.p 
            className={styles.description}
            variants={itemVariants}
          >
            Access powerful AI-driven tools to study smarter, achieve higher
            grades, and unlock your full academic potential with CleverClass.
          </motion.p>
          <motion.div 
            className={styles.actions}
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={AppRoutes.Pricing} className={styles.primaryButton}>
                View Pricing
                <HiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div 
          className={styles.cardPreview}
          variants={cardVariants}
        >
          <motion.div 
            className={styles.card}
            whileHover={{ 
              y: -8,
              rotateX: 2,
              transition: { duration: 0.3 }
            }}
          >
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
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTASection;
