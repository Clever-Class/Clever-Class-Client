import React from 'react';
import styles from './Hero.module.scss';
import { FaStar } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCTAContainer}>
        {/* Main Content */}
        <div className={styles.content}>
          <h1 className={styles.title}>
            The all-in-one
            <br />
            solution to excel
            <br />
            <span className={styles.highlight}>in your studies.</span>
          </h1>
          <p className={styles.description}>
            Unlock a smarter way to study with our AI-driven
            <br />
            suite of powerful learning tools.
          </p>
          {/* Social Proof */}
          <div className={styles.socialProof}>
            <div className={styles.avatarGroup}>
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className={styles.avatar}>
                  <img
                    src={`https://scontent.fdac24-3.fna.fbcdn.net/v/t39.30808-1/481070916_1358579388895685_7674310944707174093_n.jpg?stp=dst-jpg_s320x320_tt6&_nc_cat=1&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHyCYITh8IKjVaAlsg4rc-EzDqABEaM3qbMOoAERozepmc9_TigtLIlh0jSUl1CBBPX0NdjH-so2bMlpReDUBN8&_nc_ohc=F1JKeysraCkQ7kNvgGIg3ee&_nc_oc=AdgdjuoLR__i2klXh1zFZqFvAguKnWnHQcd-ug3aPXY-YOMVzienJcjfr7exoHUcz68&_nc_zt=24&_nc_ht=scontent.fdac24-3.fna&_nc_gid=ALSG6typz4yDWqBokn2wm_r&oh=00_AYDQsvXGoiwapbnRLvtDbc5GVcct_X8AxqqILtrsLcHT2A&oe=67CA5A64`}
                    alt={`Student ${index}`}
                  />
                </div>
              ))}
            </div>
            <div className={styles.rating}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <FaStar key={index} className={styles.star} />
                ))}
              </div>
              <span>Loved by 100k+ students</span>
            </div>
          </div>
          <button className={styles.cta}>
            Get Started Now
            <HiArrowRight className={styles.arrow} />
          </button>
        </div>

        {/* Stats */}
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
          title="Hero Video"
          autoPlay
          loop
          muted
          className={styles.heroVideo}
        />
      </div>
    </section>
  );
};

export default Hero;
