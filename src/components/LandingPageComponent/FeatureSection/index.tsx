import React, { useEffect, useRef, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Step-by-step solution animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4); // 4 steps total
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Subjects with their icons for the scrolling animation
  const subjectsRow1 = [
    { name: 'Math', icon: <FaSquareRootAlt /> },
    { name: 'Physics', icon: <FaAtom /> },
    { name: 'Chemistry', icon: <FaFlask /> },
    { name: 'Biology', icon: <FaDna /> },
    { name: 'Computer Science', icon: <FaLaptopCode /> },
    { name: 'Astronomy', icon: <FaGlobeAmericas /> },
    { name: 'Engineering', icon: <FaCogs /> },
    { name: 'Robotics', icon: <FaRobot /> },
    { name: 'Artificial Intelligence', icon: <FaBrain /> },
    { name: 'Machine Learning', icon: <FaMicrochip /> },
    { name: 'Quantum Physics', icon: <FaQuantum /> },
  ];

  const subjectsRow2 = [
    { name: 'History', icon: <GiAncientColumns /> },
    { name: 'Literature', icon: <GiBookshelf /> },
    { name: 'Philosophy', icon: <GiThink /> },
    { name: 'Economics', icon: <GiMoneyStack /> },
    { name: 'Psychology', icon: <GiBrain /> },
    { name: 'Sociology', icon: <GiGroupedDrops /> },
    { name: 'Anthropology', icon: <GiAncientRuins /> },
    { name: 'Political Science', icon: <GiPublicSpeaker /> },
    { name: 'Geography', icon: <GiEarthAmerica /> },
    { name: 'Linguistics', icon: <GiSpeaker /> },
    { name: 'Cultural Studies', icon: <GiWorld /> },
  ];

  const subjectsRow3 = [
    { name: 'Algebra', icon: <TbMathFunction /> },
    { name: 'Calculus', icon: <TbMathIntegralX /> },
    { name: 'Geometry', icon: <TbMathAvg /> },
    { name: 'Statistics', icon: <TbChartHistogram /> },
    { name: 'Trigonometry', icon: <TbTriangle /> },
    { name: 'Data Science', icon: <TbChartDots3 /> },
    { name: 'Number Theory', icon: <TbNumbers /> },
    { name: 'Discrete Math', icon: <TbMathSymbols /> },
    { name: 'Linear Algebra', icon: <TbVector /> },
    { name: 'Probability', icon: <TbDice5 /> },
    { name: 'Differential Equations', icon: <TbDiff /> },
  ];

  // Create a seamless loop by duplicating the subjects with optimized count for different devices
  const createSeamlessLoop = (
    subjects: Array<{ name: string; icon: JSX.Element }>,
  ) => {
    // For mobile, use fewer duplicates to improve performance
    const duplicateCount = isMobile ? 2 : 3;
    return Array(duplicateCount).fill(subjects).flat();
  };

  // Intersection Observer with optimized threshold for different devices
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: isMobile ? '0px' : '50px',
        threshold: isMobile ? 0.1 : 0.2,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isMobile]);

  // Animation classes based on visibility and device type
  const animationClass = isVisible ? styles.visible : '';

  return (
    <div
      className={styles.featureSection}
      ref={sectionRef}
      style={{
        // Optimize paint performance
        willChange: 'transform, opacity',
        // Enable hardware acceleration
        transform: 'translateZ(0)',
      }}
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
        <div
          className={`${styles.topSection} ${animationClass}`}
          style={{ willChange: 'transform, opacity' }}
        >
          <button
            className={styles.chromeExtensionButton}
            onClick={() =>
              window.open('https://chrome.google.com/webstore', '_blank')
            }
            aria-label="Get Chrome Extension"
          >
            <img
              src="/asset/chrome-logo.svg"
              alt="Chrome Logo"
              className={styles.chromeLogo}
            />
            <span>Chrome Extension</span>
          </button>
        </div>

        <div
          className={`${styles.mainContent} ${animationClass}`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className={styles.contentLeft}>
            <h1 className={styles.heroTitle}>
              The modern approach
              <br />
              to learning is here.
            </h1>

            <p className={styles.heroDescription}>
              Say goodbye to guesswork, tough problems, and juggling tabs to find answers.
              <br />
              Transcript's AI powered homework helper makes finding answers a breeze.
            </p>

            <button
              className={styles.getStartedButton}
              onClick={onGetStarted}
              aria-label="Get Started"
            >
              Add to Chrome for Free
            </button>
          </div>

          <div className={styles.contentRight}>
            <ExtensionShowcase className={styles.extensionShowcase} />
          </div>
        </div>

                <div
          className={`${styles.featureHighlights} ${animationClass}`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className={`${styles.featureCard} ${styles.cardPrimary}`}>
            <div className={styles.cardIcon}>
              <HiOutlineAcademicCap />
            </div>
            <div className={styles.cardContent}>
              <h3>Any subject, any level</h3>
              <p>Get expert help from beginner to advanced, tailored to your learning needs.</p>
              <div className={styles.scrollingSubjects}>
                {/* Row 1 - Science subjects */}
                <div className={styles.subjectRow}>
                  <div className={styles.scrollingTrack}>
                    {Array(3).fill([
                       'Biology',
                       'Physics', 
                       'Chemistry',
                       'Astronomy',
                       'Computer Science',
                       'Engineering',
                     ]).flat().map((subject, index) => (
                       <span key={index} className={styles.subjectTag}>
                         {subject}
                       </span>
                     ))}
                  </div>
                </div>

                {/* Row 2 - Liberal Arts */}
                <div className={`${styles.subjectRow} ${styles.reverse}`}>
                  <div className={styles.scrollingTrack}>
                    {Array(3).fill([
                      'Literature',
                      'History',
                      'Philosophy',
                      'Political Science',
                      'Geography',
                      'Psychology',
                    ]).flat().map((subject, index) => (
                      <span key={index} className={styles.subjectTag}>
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Row 3 - Math subjects */}
                <div className={styles.subjectRow}>
                  <div className={styles.scrollingTrack}>
                    {Array(3).fill([
                      'Geometry',
                      'Calculus',
                      'Statistics',
                      'Algebra',
                      'Data Science',
                      'Trigonometry',
                    ]).flat().map((subject, index) => (
                      <span key={index} className={styles.subjectTag}>
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.featureCard} ${styles.cardSecondary}`}>
            <div className={styles.cardIcon}>
              <RiBrainLine />
            </div>
            <div className={styles.cardContent}>
              <h3>Solve it your way</h3>
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
          </div>

          <div className={`${styles.featureCard} ${styles.cardTertiary}`}>
            <div className={styles.cardIcon}>
              <HiOutlineCheckCircle />
            </div>
            <div className={styles.cardContent}>
              <h3>Step-by-step solutions</h3>
              <p>Simplify complex problems into clear, actionable steps to deepen your understanding.</p>
              <div className={styles.solutionSlider}>
                <div 
                  className={styles.stepsContainer}
                  style={{ transform: `translateX(-${currentStep * 100}%)` }}
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
                      <div className={styles.checkmark}>✓</div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.stepIndicators}>
                  {[0, 1, 2, 3].map((step) => (
                    <div 
                      key={step}
                      className={`${styles.indicator} ${currentStep === step ? styles.active : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.featureCard} ${styles.cardQuaternary}`}>
            <div className={styles.cardIcon}>
              <HiOutlineShieldCheck />
            </div>
            <div className={styles.cardContent}>
              <h3>Results you can trust</h3>
              <p>AI ensures your answers are backed by trustworthy sources, so you can learn with absolute confidence.</p>
              <div className={styles.sourceExamples}>
                <div className={styles.sourceQuote}>
                  <p>"Evaporation is a type of vaporization that occurs on the surface of a liquid as it changes into the gas phase."</p>
                  <div className={styles.sourceAttribution}>
                    <span className={styles.sourceIcon}>🌐</span>
                    <span className={styles.sourceName}>Khan Academy</span>
                  </div>
                </div>
                <div className={styles.sourceQuote}>
                  <p>"Evaporation occurs when molecules at the surface of a liquid gain enough energy to enter the gas phase."</p>
                  <div className={styles.sourceAttribution}>
                    <span className={styles.sourceIcon}>📚</span>
                    <span className={styles.sourceName}>Scientific Sources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
