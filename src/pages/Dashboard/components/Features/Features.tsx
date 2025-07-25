import { FiDownload, FiInfo, FiTool, FiHelpCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './Features.module.scss';
import SectionTitle from '../../../../components/common/SectionTitle/SectionTitle';

export const Features = () => {
  return (
    <section className={styles.featuresSection}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle title="Powerful Features" />
      </motion.div>

      <div className={styles.featuresGrid}>
        {/* Chrome Extension Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${styles.card} ${styles.blueCard}`}
        >
          <div className={styles.cardIconContainer}>
            <div className={styles.cardIcon}>
              <FiDownload />
            </div>
            <h3 className={styles.cardTitle}>Chrome Extension</h3>
          </div>
          <p className={styles.cardDescription}>
            Enhance your learning experience with our Chrome extension. Get
            instant access to AI-powered solutions and summaries directly in
            your browser.
          </p>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cardAction}
          >
            Add to Chrome <FiDownload />
          </a>
        </motion.div>

        {/* AI Tutor Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${styles.card} ${styles.pinkCard}`}
        >
          <div className={styles.cardIconContainer}>
            <div className={styles.cardIcon}>
              <FiInfo />
            </div>
            <h3 className={styles.cardTitle}>AI Tutor</h3>
          </div>
          <p className={styles.cardDescription}>
            Get personalized help from our AI tutor. Ask questions, solve
            problems, and receive step-by-step explanations in real-time.
          </p>
          <button className={styles.cardAction}>
            Try AI Tutor <FiInfo />
          </button>
        </motion.div>

        {/* Screenshot Tool Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${styles.card} ${styles.greenCard}`}
        >
          <div className={styles.cardIconContainer}>
            <div className={styles.cardIcon}>
              <FiTool />
            </div>
            <h3 className={styles.cardTitle}>Screenshot to Solution</h3>
          </div>
          <p className={styles.cardDescription}>
            Take a screenshot of any problem and get instant solutions with
            detailed explanations using our advanced AI technology.
          </p>
          <button className={styles.cardAction}>
            Try Screenshot Tool <FiTool />
          </button>
        </motion.div>

        {/* Help & Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`${styles.card} ${styles.yellowCard}`}
        >
          <div className={styles.cardIconContainer}>
            <div className={styles.cardIcon}>
              <FiHelpCircle />
            </div>
            <h3 className={styles.cardTitle}>Help & Support</h3>
          </div>
          <p className={styles.cardDescription}>
            Need help? Access our comprehensive guides, FAQ section, or contact
            our support team for assistance with any issues.
          </p>
          <button className={styles.cardAction}>
            Get Support <FiHelpCircle />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
