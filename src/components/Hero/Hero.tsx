import React from 'react';
import styles from './Hero.module.scss';
import { FaStar } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero} aria-label="Hero Section">
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
              learning tools.
            </p>

            <div className={styles.socialProof} aria-label="Social Proof">
              <div className={styles.avatarGroup} aria-label="Student Avatars">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className={styles.avatar}>
                    <img
                      src={`https://i.pravatar.cc/150?img=${index}`}
                      alt={`Student ${index}`}
                      loading="lazy"
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
                <span>Loved by 100k+ students</span>
              </div>
            </div>

            <button
              className={styles.cta}
              onClick={() => {}} // Add your click handler
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
