import { FiDownload, FiHelpCircle, FiInfo, FiTool } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './Dashboard.module.scss';

export const Dashboard = () => {
  return (
    <motion.div
      className={styles.dashboardContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Elements */}
      <div className={styles.backgroundGradient} />
      <div className={styles.scrollingBackground} />

      <div className={styles.content}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.badge}
        >
          <span>Welcome Back</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={styles.title}
        >
          Your Learning
          <br />
          <span className={styles.highlight}>Journey Starts Here.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={styles.description}
        >
          Access all your learning tools in one place. Get instant help,
          summarize content, and enhance your study experience with our
          AI-powered features.
        </motion.p>

        {/* Feature Cards Grid */}
        <div className={styles.grid}>
          {/* Chrome Extension Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className={`${styles.card} ${styles.blueCard}`}
          >
            <div className={styles.cardIcon}>
              <FiDownload />
            </div>
            <h3 className={styles.cardTitle}>Chrome Extension</h3>
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
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className={`${styles.card} ${styles.pinkCard}`}
          >
            <div className={styles.cardIcon}>
              <FiInfo />
            </div>
            <h3 className={styles.cardTitle}>AI Tutor</h3>
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
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className={`${styles.card} ${styles.greenCard}`}
          >
            <div className={styles.cardIcon}>
              <FiTool />
            </div>
            <h3 className={styles.cardTitle}>Screenshot to Solution</h3>
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
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className={`${styles.card} ${styles.yellowCard}`}
          >
            <div className={styles.cardIcon}>
              <FiHelpCircle />
            </div>
            <h3 className={styles.cardTitle}>Help & Support</h3>
            <p className={styles.cardDescription}>
              Need help? Access our comprehensive guides, FAQ section, or
              contact our support team for assistance with any issues.
            </p>
            <button className={styles.cardAction}>
              Get Support <FiHelpCircle />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
