import React, { useEffect, useRef } from 'react';
import finalLowerCTAScreenshot from '~/assets/images/final_cta_home.png';

import styles from './FinalLowerCTA.module.scss';

interface FinalLowerCTAProps {
  onGetStarted: () => void;
}

const FinalLowerCTA: React.FC<FinalLowerCTAProps> = ({ onGetStarted }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      const imageRect = imageRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the image is visible
      const imageHeight = imageRect.height;
      const imageTop = imageRect.top;

      // Start animation when image is 80% from the bottom of viewport
      // and complete when it's 30% from the top
      const startPoint = windowHeight * 0.8;
      const endPoint = windowHeight * 0.3;

      const progress = Math.min(
        Math.max((startPoint - imageTop) / (startPoint - endPoint), 0),
        1,
      );

      // More aggressive easing curve for faster response
      const eased = 1 - Math.pow(1 - progress, 1.2);

      // Calculate tilt angle (6deg to 0deg)
      const tiltAngle = 6 * (1 - eased);
      const scale = 0.98 + 0.02 * eased;

      // Apply transforms
      imageRef.current.style.transform = `perspective(1000px) rotateX(${tiltAngle}deg) scale(${scale})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.finalLowerCTA}>
      <div className={styles.gradientOverlay} />
      <div className={styles.container}>
        <h2 className={styles.title}>Your AI-powered study hub.</h2>
        <p className={styles.description}>
          Store notes, summarize lectures, and turn your course material into
          interactive flashcards and quizzes.
        </p>
        <button
          className={styles.ctaButton}
          onClick={onGetStarted}
          aria-label="Learn More"
        >
          Learn More
        </button>
        <div className={styles.notebookWrapper}>
          <img
            ref={imageRef}
            src={finalLowerCTAScreenshot}
            alt="AI-powered study notebook interface"
            className={styles.notebookImage}
          />
        </div>
      </div>
    </section>
  );
};

export default FinalLowerCTA;
