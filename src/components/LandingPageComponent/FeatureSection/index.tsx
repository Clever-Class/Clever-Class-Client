import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './FeatureSection.module.scss';
import { FeatureSectionProps } from './FeatureSection.types';
import ExtensionShowcase from '../../ExtensionShowcase';
import featureSectionSideBackground from '../../../assets/images/extension-bg-browser.png';
import {
  FaSquareRootAlt,
  FaAtom,
  FaFlask,
  FaDna,
  FaLaptopCode,
  FaGlobeAmericas,
  FaCogs,
  FaRobot,
  FaBrain,
  FaMicrochip,
  FaAtom as FaQuantum,
} from 'react-icons/fa';
import {
  GiAncientColumns,
  GiBookshelf,
  GiThink,
  GiMoneyStack,
  GiBrain,
  GiGroupedDrops,
  GiAncientRuins,
  GiPublicSpeaker,
  GiEarthAmerica,
  GiSpeaker,
  GiWorld,
} from 'react-icons/gi';
import {
  TbMathFunction,
  TbMathIntegralX,
  TbMathAvg,
  TbChartHistogram,
  TbTriangle,
  TbChartDots3,
  TbNumbers,
  TbMathSymbols,
  TbVector,
  TbDice5,
  TbMathFunction as TbDiff,
} from 'react-icons/tb';
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { RiBrainLine } from 'react-icons/ri';

const FeatureSection: React.FC<FeatureSectionProps> = ({ onGetStarted }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [aiProcessingStep, setAiProcessingStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-100px",
    amount: 0.3 
  });

  // Step-by-step solution animation - optimized interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 3500); // Slightly slower for better UX

    return () => clearInterval(interval);
  }, []);

  // AI Processing animation
  useEffect(() => {
    const aiInterval = setInterval(() => {
      setAiProcessingStep((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(aiInterval);
  }, []);

  // Optimized subject arrays - reduced complexity while maintaining visual richness
  const subjectsRow1 = [
    'Math', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Engineering'
  ];

  const subjectsRow2 = [
    'History', 'Literature', 'Philosophy', 'Economics', 'Psychology', 'Geography'
  ];

  const subjectsRow3 = [
    'Algebra', 'Calculus', 'Statistics', 'Data Science', 'Trigonometry', 'Linear Algebra'
  ];

  // Framer Motion variants for smooth animations
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

  const slideUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      className={styles.featureSection}
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <img
        src={featureSectionSideBackground}
        alt="Feature Section Side Background"
        className={styles.featureSectionSideBackground}
      />
      <div className={styles.heroBackground}>
        <div className={styles.gradientOverlay}></div>
      </div>

      <div className={styles.contentContainer}>
        <motion.div
          className={styles.topSection}
          variants={itemVariants}
        >
          <motion.button
            className={styles.chromeExtensionButton}
            onClick={() =>
              window.open('https://chrome.google.com/webstore', '_blank')
            }
            aria-label="Get Chrome Extension"
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src="/asset/chrome-logo.svg"
              alt="Chrome Logo"
              className={styles.chromeLogo}
            />
            <span>Chrome Extension</span>
          </motion.button>
        </motion.div>

        <motion.div
          className={styles.mainContent}
          variants={itemVariants}
        >
          <div className={styles.contentLeft}>
            <motion.h1 
              className={styles.heroTitle}
              variants={slideUpVariants}
            >
              The modern approach 
              <br />
              to learning is here.
            </motion.h1>

            <motion.p 
              className={styles.heroDescription}
              variants={slideUpVariants}
            >
              Say goodbye to guesswork, tough problems, and juggling tabs to find answers.
              <br />
              Transcript's AI powered homework helper makes finding answers a breeze.
            </motion.p>

            <motion.button
              className={styles.getStartedButton}
              onClick={onGetStarted}
              aria-label="Get Started"
              variants={slideUpVariants}
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              Add to Chrome for Free
            </motion.button>
          </div>

          <motion.div 
            className={styles.contentRight}
            variants={slideUpVariants}
          >
            <ExtensionShowcase className={styles.extensionShowcase} />
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.featureHighlights}
          variants={containerVariants}
        >
          <motion.div 
            className={`${styles.featureCard} ${styles.cardPrimary}`}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <HiOutlineAcademicCap />
              </div>
              <h3>Any subject, any level</h3>
            </div>
            <div className={styles.cardContent}>
              <p>Get expert help from beginner to advanced, tailored to your learning needs.</p>
              <div className={styles.scrollingSubjects}>
                {/* Row 1 - Science subjects */}
                <div className={styles.subjectRow}>
                  <motion.div 
                    className={styles.scrollingTrack}
                    animate={{ x: [0, -1000] }}
                    transition={{
                      duration: 30,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                  >
                    {/* Create enough duplicates for seamless infinite scroll */}
                    {Array(6).fill(subjectsRow1).flat().map((subject, index) => (
                       <span key={`row1-${subject}-${index}`} className={styles.subjectTag}>
                         {subject}
                       </span>
                     ))}
                  </motion.div>
                </div>

                {/* Row 2 - Liberal Arts */}
                <div className={`${styles.subjectRow} ${styles.reverse}`}>
                  <motion.div 
                    className={styles.scrollingTrack}
                    animate={{ x: [-1000, 0] }}
                    transition={{
                      duration: 35,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                  >
                    {Array(6).fill(subjectsRow2).flat().map((subject, index) => (
                      <span key={`row2-${subject}-${index}`} className={styles.subjectTag}>
                        {subject}
                      </span>
                    ))}
                  </motion.div>
                </div>

                {/* Row 3 - Math subjects */}
                <div className={styles.subjectRow}>
                  <motion.div 
                    className={styles.scrollingTrack}
                    animate={{ x: [0, -1000] }}
                    transition={{
                      duration: 32,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                  >
                    {Array(6).fill(subjectsRow3).flat().map((subject, index) => (
                      <span key={`row3-${subject}-${index}`} className={styles.subjectTag}>
                        {subject}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`${styles.featureCard} ${styles.cardSecondary}`}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <RiBrainLine />
              </div>
              <h3>Solve it your way</h3>
            </div>
            <div className={styles.cardContent}>
              <p>Take your study companion across the web. Search your questions in the way that suits you best.</p>
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
                      <span className={styles.questionLabel}>Question 3</span>
                      <span className={styles.transcriptLabel}>transcript</span>
                    </div>
                    <div className={styles.answerOptions}>
                      <div className={styles.answerOption}>A) 14</div>
                      <div className={styles.answerOption}>B) 21</div>
                      <div className={styles.answerOption}>C) 28</div>
                      <div className={styles.answerOption}>D) 35</div>
                      <div className={styles.answerOption}>E) 42</div>
                      <div className={styles.answerOption}>F) 49</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`${styles.featureCard} ${styles.cardTertiary}`}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <HiOutlineCheckCircle />
              </div>
              <h3>Step-by-step solutions</h3>
            </div>
            <div className={styles.cardContent}>
              <p>Simplify complex problems into clear, actionable steps to deepen your understanding.</p>
              <div className={styles.solutionSlider}>
                <motion.div 
                  className={styles.stepsContainer}
                  animate={{ x: `${-currentStep * 100}%` }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  {/* Step 0 - Problem */}
                  <div className={styles.step}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNumber}>Problem</span>
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.mathProblem}>
                        Find the value of x: 2x + 8 = 20
                      </div>
                    </div>
                  </div>

                  {/* Step 1 - Isolate variable */}
                  <div className={styles.step}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNumber}>Step 1</span>
                      <span className={styles.stepTitle}>Isolate the variable</span>
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.mathStep}>
                        2x + 8 - 8 = 20 - 8
                      </div>
                      <div className={styles.stepExplanation}>
                        Subtract 8 from both sides
                      </div>
                    </div>
                  </div>

                  {/* Step 2 - Simplify */}
                  <div className={styles.step}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNumber}>Step 2</span>
                      <span className={styles.stepTitle}>Simplify</span>
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.mathStep}>
                        2x = 12
                      </div>
                      <div className={styles.stepExplanation}>
                        Combine like terms
                      </div>
                    </div>
                  </div>

                  {/* Step 3 - Solve */}
                  <div className={styles.step}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNumber}>Step 3</span>
                      <span className={styles.stepTitle}>Solve for x</span>
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.mathStep}>
                        x = 6
                      </div>
                      <div className={styles.stepExplanation}>
                        Divide both sides by 2
                      </div>
                    </div>
                    <div className={styles.stepCheckmark}>✓</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`${styles.featureCard} ${styles.cardQuaternary}`}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <FaBrain />
              </div>
              <h3>Lightning Fast Results</h3>
            </div>
            <div className={styles.cardContent}>
              <p>Get instant answers to any question. Our AI processes complex problems in milliseconds, not minutes.</p>
              <div className={styles.speedDemo}>
                {/* Neural Network Background */}
                <div className={styles.neuralBackground}>
                  <div className={styles.neuralNodes}>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`node-${i}`}
                        className={styles.neuralNode}
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                        style={{
                          left: `${20 + (i % 4) * 20}%`,
                          top: `${30 + Math.floor(i / 4) * 40}%`
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className={styles.neuralConnections}>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`connection-${i}`}
                        className={styles.neuralLine}
                        animate={{
                          opacity: aiProcessingStep > 0 ? [0.1, 0.6, 0.1] : 0.1,
                          pathLength: aiProcessingStep > 0 ? [0, 1, 0] : 0
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.1
                        }}
                        style={{
                          left: `${15 + i * 12}%`,
                          top: `${25 + (i % 2) * 50}%`,
                          width: `${20 + i * 5}%`,
                          transform: `rotate(${i * 15}deg)`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.timer}>
                  <motion.div 
                    className={styles.timeDisplay}
                    animate={{
                      scale: aiProcessingStep === 0 ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className={styles.timeNumber}>
                      {aiProcessingStep === 0 ? "0.3" : aiProcessingStep === 1 ? "0.2" : aiProcessingStep === 2 ? "0.1" : "0.0"}
                    </span>
                    <span className={styles.timeUnit}>sec</span>
                  </motion.div>

                  {/* Dynamic Status Pill */}
                  <motion.div 
                    className={styles.statusPill}
                    animate={{
                      backgroundColor: 
                        aiProcessingStep === 0 ? "rgba(255, 255, 255, 0.15)" :
                        aiProcessingStep === 1 ? "rgba(255, 255, 255, 0.18)" :
                        aiProcessingStep === 2 ? "rgba(255, 255, 255, 0.22)" :
                        "rgba(255, 255, 255, 0.25)",
                      scale: [0.95, 1, 0.95]
                    }}
                    transition={{ 
                      backgroundColor: { duration: 0.3 },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <motion.div className={styles.pillIcon}>
                      {aiProcessingStep === 0 && "🔍"}
                      {aiProcessingStep === 1 && "🧠"}
                      {aiProcessingStep === 2 && "⚡"}
                      {aiProcessingStep === 3 && "✨"}
                    </motion.div>
                    <motion.span 
                      className={styles.pillText}
                      key={aiProcessingStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {aiProcessingStep === 0 && "Scanning..."}
                      {aiProcessingStep === 1 && "Analyzing..."}
                      {aiProcessingStep === 2 && "Processing..."}
                      {aiProcessingStep === 3 && "Complete!"}
                    </motion.span>
                  </motion.div>
                  
                  {/* AI Scanning Lines */}
                  <div className={styles.scanningLines}>
                    <motion.div 
                      className={styles.scanLine}
                      animate={{
                        x: [-50, 100],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div 
                      className={styles.scanLine}
                      animate={{
                        x: [-30, 120],
                        opacity: [0, 0.6, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </div>
                
                <div className={styles.speedIndicators}>
                  <div className={styles.speedBars}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={`bar-${i}`}
                        className={styles.speedBar}
                        animate={{
                          height: aiProcessingStep > i ? "100%" : "20%",
                          backgroundColor: aiProcessingStep > i ? "#10b981" : "rgba(255,255,255,0.2)"
                        }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <span className={styles.speedLabel}>AI Processing Speed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeatureSection;
