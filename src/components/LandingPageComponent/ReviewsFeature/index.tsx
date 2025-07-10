import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './ReviewsFeature.module.scss';

const ReviewsFeature: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-50px",
    amount: 0.2 
  });

  // Sample review data - optimized for performance
  const reviews = [
    { id: 1, name: 'Sarah M.', role: 'College Student', rating: 5, text: 'This extension has completely transformed how I study. The step-by-step solutions help me understand concepts instead of just getting answers.' },
    { id: 2, name: 'Alex Chen', role: 'High School Senior', rating: 5, text: 'Perfect for homework help! Works seamlessly across all my educational sites and the AI explanations are incredibly detailed.' },
    { id: 3, name: 'Maria Rodriguez', role: 'Graduate Student', rating: 5, text: 'The subject coverage is amazing. From advanced calculus to literature analysis, it handles everything with accuracy.' },
    { id: 4, name: 'James Wilson', role: 'Engineering Student', rating: 5, text: 'Finally, an AI assistant that actually understands complex engineering problems. The visual explanations are a game changer.' },
    { id: 5, name: 'Emily Davis', role: 'Medical Student', rating: 5, text: 'Helps me break down complex medical concepts. The reliable sources and citations give me confidence in the answers.' },
    { id: 6, name: 'David Kim', role: 'Computer Science Student', rating: 5, text: 'Works great for coding problems and algorithm explanations. The step-by-step debugging help is incredibly useful.' },
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
      className={styles.reviewsSection}
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className={styles.contentContainer}>
        <motion.div 
          className={styles.sectionHeader}
          variants={itemVariants}
        >
          <motion.h2 
            className={styles.title}
            variants={itemVariants}
          >
            Loved by students worldwide
          </motion.h2>
          <motion.p 
            className={styles.description}
            variants={itemVariants}
          >
            Join thousands of students who are already excelling with our AI-powered learning companion
          </motion.p>
        </motion.div>

        <motion.div 
          className={styles.reviewsContainer}
          variants={containerVariants}
        >
          <motion.div 
            className={styles.reviewsTrack}
            animate={{ 
              x: ['0%', '-50%'] 
            }}
            transition={{
              duration: 30,
              ease: 'linear',
              repeat: Infinity
            }}
          >
            {/* Duplicate reviews for seamless scrolling - reduced from 3x to 2x for better performance */}
            {Array(2).fill(reviews).flat().map((review, index) => (
              <motion.div 
                key={`review-${review.id}-${index}`} 
                className={styles.reviewCard}
                whileHover={{ 
                  y: -4, 
                  transition: { duration: 0.2 }
                }}
              >
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <div className={styles.reviewerAvatar}>
                      {review.name.charAt(0)}
                    </div>
                    <div className={styles.reviewerDetails}>
                      <h4 className={styles.reviewerName}>{review.name}</h4>
                      <p className={styles.reviewerRole}>{review.role}</p>
                    </div>
                  </div>
                  <div className={styles.rating}>
                    {Array(review.rating).fill(0).map((_, i) => (
                      <span key={i} className={styles.star}>★</span>
                    ))}
                  </div>
                </div>
                <p className={styles.reviewText}>{review.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.stats}
          variants={itemVariants}
        >
          <motion.div 
            className={styles.stat}
            variants={itemVariants}
          >
            <span className={styles.statNumber}>50,000+</span>
            <span className={styles.statLabel}>Students helped</span>
          </motion.div>
          <motion.div 
            className={styles.stat}
            variants={itemVariants}
          >
            <span className={styles.statNumber}>4.9/5</span>
            <span className={styles.statLabel}>Average rating</span>
          </motion.div>
          <motion.div 
            className={styles.stat}
            variants={itemVariants}
          >
            <span className={styles.statNumber}>95%</span>
            <span className={styles.statLabel}>Success rate</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ReviewsFeature;
