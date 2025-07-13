import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.scss';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Auto-show popup for showcasing with click animation
  useEffect(() => {
    const showcaseInterval = setInterval(() => {
      // First show click animation
      setButtonClicked(true);
      
      // Then show popup after click animation
      setTimeout(() => {
        setShowAnswerPopup(true);
        setButtonClicked(false);
      }, 300);
      
      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowAnswerPopup(false);
      }, 3300);
    }, 6000);

    return () => clearInterval(showcaseInterval);
  }, []);

  const handleGetStarted = () => {
    // Add your get started logic here
    console.log('Get Started clicked');
  };

  const studyIcons = [
    'math',
    'chemistry',
    'physics',
    'biology',
    'computer',
    'notes',
    'book',
    'calculator',
    'pencil',
    'flask',
    'dna',
    'atom',
    'graph',
    'microscope',
    'formula',
    'notebook',
    'laptop',
    'globe',
    'test',
    'brain',
  ];

  const renderIconRow = (start: number, count: number) => (
    <div className={styles.row}>
      {studyIcons.slice(start, start + count).map((icon, index) => (
        <img
          key={`${icon}-${index}`}
          src={`/study-icons/${icon}.svg`}
          alt={icon}
          loading="lazy"
        />
      ))}
    </div>
  );

  return (
    <div className={styles.heroSectionWrapper}>
      <section ref={heroRef} className={styles.hero} aria-label="Hero Section">
        <div className={styles.gradientOverlay} />

        <div className={styles.heroContainer}>
          <div className={styles.heroCTAContainer}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                The Secret to{' '}
                <span className={styles.highlight}>Study Smarter</span>, Not
                Harder.
              </h1>
              <p className={styles.description}>
                Clever Class is your AI-powered toolkit for acing quizzes,
                understanding lectures, and mastering your subjects. Get the
                grades you want, in less time.
              </p>

              <div className={styles.socialProof} aria-label="Social Proof">
                <div
                  className={styles.avatarGroup}
                  aria-label="Student Avatars"
                >
                  {[
                    { src: '/asset/studentpic/min_jun.png', alt: 'Min Jun' },
                    { src: '/asset/studentpic/emma.png', alt: 'Emma Smith' },
                    { src: '/asset/studentpic/layla_mei.png', alt: 'Layla Mei' },
                    { src: '/asset/studentpic/lorin.png', alt: 'Lorin Gomez' },
                    { src: '/asset/studentpic/tony.png', alt: 'Tony' },
                    { src: '/asset/studentpic/barisha.png', alt: 'Barisha' },
                  ].map((student, index) => (
                    <div
                      key={index}
                      className={styles.avatar}
                      style={{ zIndex: 5 - index }}
                    >
                      <img
                        src={student.src}
                        alt={student.alt}
                        loading="lazy"
                        width="48"
                        height="48"
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.rating} role="complementary">
                  <div className={styles.stars} aria-label="5 Star Rating">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <FaStar
                        key={index}
                        className={styles.star}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span>Loved by 10,000+ students worldwide</span>
                </div>
              </div>

              <button
                className={styles.cta}
                onClick={handleGetStarted}
                aria-label="Get Started for Free"
              >
                Get Started for Free
                <HiArrowRight className={styles.arrow} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.label}>delivering</span>
                <h2 className={styles.value}>95%</h2>
                <span className={styles.description}>accuracy rate</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.label}>more than</span>
                <h2 className={styles.value}>1M</h2>
                <span className={styles.description}>questions solved</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.label}>achieve</span>
                <h2 className={styles.value}>3x</h2>
                <span className={styles.description}>concept review</span>
              </div>
            </div>
          </div>

          <div className={styles.heroAnimationContainer}>
            <motion.div 
              className={styles.featureAnimation}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className={styles.featureImage}>
                <div className={styles.mockupWindow}>
                  <div className={styles.windowHeader}>
                    <div className={styles.windowControls}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className={styles.windowContent}>
                      <div className={styles.questionBox}>
                        <span className={styles.questionLabel}>What is the acceleration due to gravity on Earth?</span>
                        <motion.div
                          className={styles.cleverclassButton}
                          animate={buttonClicked ? { 
                            scale: [1, 0.95, 1.05, 1],
                          } : { 
                            scale: [1, 1.02, 1],
                            boxShadow: [
                              "0 4px 15px rgba(59, 130, 246, 0.3)",
                              "0 6px 20px rgba(59, 130, 246, 0.4)",
                              "0 4px 15px rgba(59, 130, 246, 0.3)"
                            ]
                          }}
                          transition={buttonClicked ? { 
                            duration: 0.3,
                            ease: "easeInOut"
                          } : { 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <span className={styles.buttonIcon}>🧠</span>
                          <span className={styles.buttonText}>CleverClass</span>
                        </motion.div>
                      </div>
                      <div className={styles.answerOptions}>
                        <div className={styles.answerOption}>A) 9.8 m/s²</div>
                        <div className={styles.answerOption}>B) 10.8 m/s²</div>
                        <div className={styles.answerOption}>C) 8.8 m/s²</div>
                        <div className={styles.answerOption}>D) 11.8 m/s²</div>
                      </div>

                      {/* Answer Popup */}
                      <AnimatePresence>
                        {showAnswerPopup && (
                          <motion.div
                            className={styles.answerPopup}
                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ 
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          >
                            <div className={styles.popupHeader}>
                              <motion.div 
                                className={styles.popupIcon}
                                initial={{ rotate: -180 }}
                                animate={{ rotate: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                              >
                                <FaCheckCircle />
                              </motion.div>
                              <h3 className={styles.popupTitle}>Correct Answer</h3>
                            </div>
                            
                            <div className={styles.popupContent}>
                              <motion.div 
                                className={styles.correctAnswer}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                              >
                                <span className={styles.answerLetter}>A)</span>
                                <span className={styles.answerValue}>9.8 m/s²</span>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
