import { FiZap, FiCheckCircle, FiTool, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './HowItWorks.module.scss';
import SectionTitle from '../../../../components/common/SectionTitle/SectionTitle';
import VideoThumbnail from '../../../../components/common/VideoThumbnail/VideoThumbnail';

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

export const HowItWorks = () => {
  return (
    <section className={styles.howItWorksSection}>
      <SectionTitle title="How It Works" />
      <div className={styles.howItWorksContentRow}>
        <motion.div
          variants={textVariants}
          custom={7}
          initial="hidden"
          animate="visible"
          className={styles.howItWorksVideo}
        >
          <VideoThumbnail
            title="How It Works"
            subtitle="See Clever Class in action"
            duration="2:30"
            onClick={() => {
              // TODO: Add video play functionality
              console.log('Video clicked');
            }}
          />
        </motion.div>

        <motion.div
          variants={textVariants}
          custom={8}
          initial="hidden"
          animate="visible"
          className={styles.benefitsList}
        >
          <div className={styles.benefitsGrid}>
            <motion.div
              variants={textVariants}
              custom={1}
              initial="hidden"
              animate="visible"
              className={styles.benefitItem}
            >
              <div className={styles.benefitIcon}>
                <FiZap />
              </div>
              <div className={styles.benefitContent}>
                <h3>Instant Access</h3>
                <p>
                  Get AI-powered solutions directly in your browser with one
                  click
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={textVariants}
              custom={2}
              initial="hidden"
              animate="visible"
              className={styles.benefitItem}
            >
              <div className={styles.benefitIcon}>
                <FiCheckCircle />
              </div>
              <div className={styles.benefitContent}>
                <h3>Smart Summaries</h3>
                <p>
                  Automatically generate concise summaries of any webpage
                  content
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={textVariants}
              custom={3}
              initial="hidden"
              animate="visible"
              className={styles.benefitItem}
            >
              <div className={styles.benefitIcon}>
                <FiTool />
              </div>
              <div className={styles.benefitContent}>
                <h3>Problem Solving</h3>
                <p>Take screenshots and get step-by-step solutions instantly</p>
              </div>
            </motion.div>

            <motion.div
              variants={textVariants}
              custom={4}
              initial="hidden"
              animate="visible"
              className={styles.benefitItem}
            >
              <div className={styles.benefitIcon}>
                <FiInfo />
              </div>
              <div className={styles.benefitContent}>
                <h3>AI Tutor</h3>
                <p>
                  Ask questions and receive personalized explanations in
                  real-time
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
