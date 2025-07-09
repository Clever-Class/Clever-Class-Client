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

const FeatureSection: React.FC<FeatureSectionProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
          <div className={styles.featureHighlight}>
            <div className={styles.highlightIcon}>🎯</div>
            <div className={styles.highlightContent}>
              <h3>Any subject, any level</h3>
              <p>Get expert help from beginner to advanced, tailored to your learning needs.</p>
            </div>
          </div>

          <div className={styles.featureHighlight}>
            <div className={styles.highlightIcon}>🧠</div>
            <div className={styles.highlightContent}>
              <h3>Solve it your way</h3>
              <p>Take your study companion across the web. Search your questions in the way that suits you best.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
