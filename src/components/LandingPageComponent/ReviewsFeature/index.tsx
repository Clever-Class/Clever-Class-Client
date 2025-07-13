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

  // Sample review data - optimized for performance with student photos
  const reviews = [
    { 
      id: 1, 
      name: 'Barisha', 
      role: 'College Student', 
      rating: 5, 
      image: '/asset/studentpic/barisha.png',
      text: 'This extension has completely transformed how I study. The step-by-step solutions help me understand concepts instead of just getting answers.' 
    },
    { 
      id: 2, 
      name: 'Arjun Patel', 
      role: 'University Student', 
      rating: 5, 
      image: '/asset/studentpic/arjun.png',
      text: 'Perfect for homework help! Works seamlessly across all my educational sites and the AI explanations are incredibly detailed.' 
    },
    { 
      id: 3, 
      name: 'Layla Mei', 
      role: 'University Student', 
      rating: 5, 
      image: '/asset/studentpic/layla_mei.png',
      text: 'The subject coverage is amazing. From advanced calculus to literature analysis, it handles everything with accuracy.' 
    },
    { 
      id: 4, 
      name: 'Estovan', 
      role: 'Engineering Student', 
      rating: 5, 
      image: '/asset/studentpic/estovan.png',
      text: 'Finally, an AI assistant that actually understands complex engineering problems. The visual explanations are a game changer.' 
    },
    { 
      id: 5, 
      name: 'Min Jun', 
      role: 'Medical Student', 
      rating: 5, 
      image: '/asset/studentpic/min_jun.png',
      text: 'Helps me break down complex medical concepts. The reliable sources and citations give me confidence in the answers.' 
    },
    { 
      id: 6, 
      name: 'Alex Carter', 
      role: 'Computer Science Student', 
      rating: 5, 
      image: '/asset/studentpic/alex.png',
      text: 'Works great for coding problems and algorithm explanations. The step-by-step debugging help is incredibly useful.' 
    },
    {
      id: 7,
      name: 'Emma Smith',
      role: 'School Student',
      rating: 5,
      image: '/asset/studentpic/emma.png',
      text: 'This extension has completely transformed how I study. The step-by-step solutions help me understand concepts instead of just getting answers.'
    },
    {
      id: 8,
      name: 'Tony',
      role: 'College Student',
      rating: 5,
      image: '/asset/studentpic/tony.png',
      text: 'I use this extension every day for my assignments. It saves me so much time and the explanations are super clear and easy to follow.'
    },
    {
      id: 9,
      name: "Lorin Gomez",
      role: "College Student",
      rating: 5,
      image: '/asset/studentpic/lorin.png',
      text: 'A must-have for every student! The clear explanations and interactive steps make even the toughest topics easy to grasp.'
    }
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
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className={styles.avatarImage}
                      />
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
            <span className={styles.statNumber}>10,000+</span>
            <span className={styles.statLabel}>Students helped</span>
          </motion.div>
          <motion.div 
            className={styles.stat}
            variants={itemVariants}
          >
            <span className={styles.statNumber}>4.7/5</span>
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
