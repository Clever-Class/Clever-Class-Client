import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LuUpload,
  LuBrain,
  LuSparkles,
  LuPlay,
} from 'react-icons/lu';
import { HiOutlineDocumentText, HiOutlineCheckCircle } from 'react-icons/hi2';
import { FaBrain, FaRobot } from 'react-icons/fa';
import styles from './QuizBuilderDemo.module.scss';

interface QuizBuilderDemoProps {
  className?: string;
}

const QuizBuilderDemo: React.FC<QuizBuilderDemoProps> = ({ className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Step progression animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = (prev + 1) % 4;
        
        // Reset states when cycling back to step 0
        if (nextStep === 0) {
          setUploadProgress(0);
          setAiProcessing(false);
        }
        
        return nextStep;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Upload progress animation for step 0
  useEffect(() => {
    if (currentStep === 0) {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 2;
          return next >= 100 ? 100 : next;
        });
      }, 50);

      return () => clearInterval(progressInterval);
    }
  }, [currentStep]);

  // AI processing animation for step 1
  useEffect(() => {
    if (currentStep === 1) {
      setAiProcessing(true);
      const timer = setTimeout(() => setAiProcessing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className={`${styles.demoSection} ${className || ''}`}>
      <div className={styles.demoContainer}>
        {/* Only show the current step */}
        
        {/* Step 0: Upload Study Materials */}
        {currentStep === 0 && (
          <motion.div
            className={`${styles.demoStep} ${styles.active}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={styles.stepHeader}>
              <div className={styles.stepIcon}>
                <LuUpload size={18} />
              </div>
              <div className={styles.stepInfo}>
                <h3>Upload Materials</h3>
                <p>Drop your PDFs or notes</p>
              </div>
            </div>
            
            <div className={styles.uploadDemo}>
              <motion.div 
                className={styles.uploadZone}
                animate={{
                  borderColor: ["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.6)", "rgba(59, 130, 246, 0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <HiOutlineDocumentText size={32} />
                <span>Physics_Chapter_3.pdf</span>
              </motion.div>
              
              <motion.div 
                className={styles.progressBar}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className={styles.progressTrack}>
                  <motion.div 
                    className={styles.progressFill}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className={styles.progressText}>{uploadProgress}%</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 1: AI Processing */}
        {currentStep === 1 && (
          <motion.div
            className={`${styles.demoStep} ${styles.active}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={styles.stepHeader}>
              <div className={styles.stepIcon}>
                <FaBrain size={18} />
              </div>
              <div className={styles.stepInfo}>
                <h3>AI Analysis</h3>
                <p>Processing content</p>
              </div>
            </div>
            
            <div className={styles.aiDemo}>
              {/* Neural Network Visualization */}
              <div className={styles.neuralNetwork}>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`neural-${i}`}
                    className={styles.neuralNode}
                    animate={{
                      opacity: aiProcessing ? [0.3, 1, 0.3] : 0.3,
                      scale: aiProcessing ? [0.8, 1.2, 0.8] : 0.8,
                      backgroundColor: aiProcessing ? 
                        ["rgba(168, 85, 247, 0.3)", "rgba(168, 85, 247, 0.8)", "rgba(168, 85, 247, 0.3)"] :
                        "rgba(255, 255, 255, 0.1)"
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.1 
                    }}
                    style={{
                      left: `${20 + (i % 3) * 25}%`,
                      top: `${25 + Math.floor(i / 3) * 30}%`
                    }}
                  />
                ))}
                
                {/* Connecting Lines */}
                {aiProcessing && [...Array(4)].map((_, i) => (
                  <motion.div
                    key={`line-${i}`}
                    className={styles.neuralLine}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      pathLength: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.3 
                    }}
                    style={{
                      left: `${25 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      width: `${20 + i * 5}%`,
                      transform: `rotate(${i * 25}deg)`
                    }}
                  />
                ))}
              </div>
              
              <motion.div 
                className={styles.processingStatus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className={styles.statusIcon}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaRobot />
                </motion.div>
                <span>Analyzing...</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Physics MCQ Question 1 */}
        {currentStep === 2 && (
          <motion.div
            className={`${styles.demoStep} ${styles.active}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={styles.stepHeader}>
              <div className={styles.stepIcon}>
                <LuPlay size={18} />
              </div>
              <div className={styles.stepInfo}>
                <h3>Take Quiz</h3>
                <p>Interactive testing</p>
              </div>
            </div>
            
            <div className={styles.quizInterface}>
              <div className={styles.quizQuestion}>
                <h4>What is the SI unit of force?</h4>
              </div>
              
              <div className={styles.answerOptions}>
                {[
                  { letter: 'A', answer: 'Joule' },
                  { letter: 'B', answer: 'Newton' },
                  { letter: 'C', answer: 'Watt' },
                  { letter: 'D', answer: 'Pascal' }
                ].map((option, i) => (
                  <motion.div
                    key={option.letter}
                    className={`${styles.answerOption} ${i === 1 ? styles.correct : ''}`}
                    animate={{
                      backgroundColor: i === 1 ? 
                        ["rgba(34, 197, 94, 0.1)", "rgba(34, 197, 94, 0.3)", "rgba(34, 197, 94, 0.1)"] :
                        "rgba(255, 255, 255, 0.05)",
                      borderColor: i === 1 ? 
                        "rgba(34, 197, 94, 0.5)" : 
                        "rgba(255, 255, 255, 0.1)"
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className={styles.optionLetter}>{option.letter}</span>
                    <span className={styles.optionText}>{option.answer}</span>
                    {i === 1 && (
                      <motion.div
                        className={styles.checkmark}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 15,
                          delay: 0.5
                        }}
                      >
                        <HiOutlineCheckCircle />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Physics MCQ Question 2 */}
        {currentStep === 3 && (
          <motion.div
            className={`${styles.demoStep} ${styles.active}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={styles.stepHeader}>
              <div className={styles.stepIcon}>
                <LuPlay size={18} />
              </div>
              <div className={styles.stepInfo}>
                <h3>Take Quiz</h3>
                <p>Interactive testing</p>
              </div>
            </div>
            
            <div className={styles.quizInterface}>
              <div className={styles.quizQuestion}>
                <h4>What is the speed of light in vacuum?</h4>
              </div>
              
              <div className={styles.answerOptions}>
                {[
                  { letter: 'A', answer: '3×10⁸ m/s' },
                  { letter: 'B', answer: '2×10⁸ m/s' },
                  { letter: 'C', answer: '5×10⁸ m/s' },
                  { letter: 'D', answer: '4×10⁸ m/s' }
                ].map((option, i) => (
                  <motion.div
                    key={option.letter}
                    className={`${styles.answerOption} ${i === 0 ? styles.correct : ''}`}
                    animate={{
                      backgroundColor: i === 0 ? 
                        ["rgba(34, 197, 94, 0.1)", "rgba(34, 197, 94, 0.3)", "rgba(34, 197, 94, 0.1)"] :
                        "rgba(255, 255, 255, 0.05)",
                      borderColor: i === 0 ? 
                        "rgba(34, 197, 94, 0.5)" : 
                        "rgba(255, 255, 255, 0.1)"
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className={styles.optionLetter}>{option.letter}</span>
                    <span className={styles.optionText}>{option.answer}</span>
                    {i === 0 && (
                      <motion.div
                        className={styles.checkmark}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 15,
                          delay: 0.5
                        }}
                      >
                        <HiOutlineCheckCircle />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step Indicators */}
        <div className={styles.stepIndicators}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`indicator-${i}`}
              className={`${styles.stepIndicator} ${i <= currentStep ? styles.active : ''}`}
              animate={{
                backgroundColor: i <= currentStep ? "#3b82f6" : "rgba(255, 255, 255, 0.2)",
                scale: i === currentStep ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizBuilderDemo; 