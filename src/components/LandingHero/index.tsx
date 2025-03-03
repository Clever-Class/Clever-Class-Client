import React from 'react';
import styles from './LandingHero.module.scss';
import { LandingHeroProps } from './LandingHero.types';
import ChromeExtensionIcon from '../../assets/icons/ChromeExtensionIcon';

const LandingHero: React.FC<LandingHeroProps> = ({ onGetStarted }) => {
  return (
    <div className={styles.landingHero}>
      <div className={styles.heroBackground}>
        <div className={styles.gradientOverlay}></div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.topSection}>
          <button
            className={styles.chromeExtensionButton}
            onClick={() =>
              window.open('https://chrome.google.com/webstore', '_blank')
            }
          >
            <ChromeExtensionIcon />
            <span>Chrome Extension</span>
          </button>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            The modern approach
            <br />
            to learning is here.
          </h1>

          <p className={styles.heroDescription}>
            Say goodbye to guesswork, tough problems, and juggling tabs to find
            answers.
            <br />
            Transcript's AI powered homework helper makes finding answers a
            breeze.
          </p>

          <button className={styles.getStartedButton} onClick={onGetStarted}>
            Get Started
          </button>
        </div>

        <div className={styles.featureCards}>
          <div className={`${styles.featureCard} ${styles.pinkCard}`}>
            <h2>Any subject, any level</h2>
            <p>
              Get expert help from beginner to advanced, tailored to your
              learning needs.
            </p>
            <div className={styles.scrollingSubjects}>
              {/* This would be a scrolling animation of subject names */}
              <span>Math</span>
              <span>Science</span>
              <span>History</span>
              <span>Literature</span>
              <span>Programming</span>
            </div>
          </div>

          <div className={`${styles.featureCard} ${styles.whiteCard}`}>
            <h2>Solve it your way</h2>
            <p>
              Take your study companion across the web. Search your questions in
              the way that suits you best.
            </p>
          </div>
        </div>

        <div className={styles.featureCards}>
          <div className={`${styles.featureCard} ${styles.blueCard}`}>
            <h2>Step-by-step solutions</h2>
            <p>
              Simplify complex problems into clear, actionable steps to deepen
              your understanding.
            </p>
          </div>

          <div className={`${styles.featureCard} ${styles.darkCard}`}>
            <h2>Results you can trust</h2>
            <p>
              AI ensures your answers are backed by trustworthy sources, so you
              can learn with absolute confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
