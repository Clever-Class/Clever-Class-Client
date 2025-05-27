import { FiDownload, FiHelpCircle, FiInfo, FiTool } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './Dashboard.module.scss';

export const Dashboard = () => {
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
          variants={textVariants}
          custom={1}
          initial="hidden"
          animate="visible"
          className={styles.badge}
        >
          <span>Welcome Back</span>
        </motion.div>

        <motion.h2
          variants={textVariants}
          custom={2}
          initial="hidden"
          animate="visible"
          className={styles.title}
        >
          Your Learning
          <br />
          <motion.span
            className={styles.highlight}
            variants={textVariants}
            custom={3}
            initial="hidden"
            animate="visible"
          >
            Journey Starts Here.
          </motion.span>
        </motion.h2>

        <motion.p
          variants={textVariants}
          custom={4}
          initial="hidden"
          animate="visible"
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
            variants={textVariants}
            custom={5}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
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
            variants={textVariants}
            custom={6}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
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
            variants={textVariants}
            custom={7}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
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
            variants={textVariants}
            custom={8}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            className={`${styles.card} ${styles.yellowCard}`}
          >
            <div className={styles.cardIconContainer}>
              <div className={styles.cardIcon}>
                <FiHelpCircle />
              </div>
              <h3 className={styles.cardTitle}>Help & Support</h3>
            </div>
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
