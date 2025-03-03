import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.scss';
import { FaStar } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleGetStarted = () => {
    // Add your get started logic here
    console.log('Get Started clicked');
  };

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Hero Section">
      <div className={styles.heroContainer}>
        <div className={styles.heroCTAContainer}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              The all-in-one
              <br aria-hidden="true" />
              solution to excel
              <br aria-hidden="true" />
              <span className={styles.highlight}>in your studies.</span>
            </h1>
            <p className={styles.description}>
              Unlock a smarter way to study with our AI-driven suite of powerful
              learning tools designed to enhance your academic journey.
            </p>

            <div className={styles.socialProof} aria-label="Social Proof">
              <div className={styles.avatarGroup} aria-label="Student Avatars">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={styles.avatar}
                    style={{ zIndex: 5 - index }}
                  >
                    <img
                      src={`https://i.pravatar.cc/150?img=${index}`}
                      alt={`Student ${index}`}
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
                <span>Loved by 100k+ students worldwide</span>
              </div>
            </div>

            <button
              className={styles.cta}
              onClick={handleGetStarted}
              aria-label="Get Started Now"
            >
              Get Started Now
              <HiArrowRight className={styles.arrow} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.label}>delivering</span>
              <h2 className={styles.value}>98%</h2>
              <span className={styles.description}>accuracy rate</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.label}>more than</span>
              <h2 className={styles.value}>50M</h2>
              <span className={styles.description}>questions solved</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.label}>achieve</span>
              <h2 className={styles.value}>5x</h2>
              <span className={styles.description}>faster learning</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVideoContainer}>
          <video
            ref={videoRef}
            src="https://cdn.transcript.study/landing/heroVideo/main.mp4"
            title="Product Demo"
            autoPlay
            loop
            muted
            playsInline
            className={styles.heroVideo}
            aria-label="Product demonstration video"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
