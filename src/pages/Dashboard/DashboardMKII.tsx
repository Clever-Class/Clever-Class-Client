import {
  FiDownload,
  FiHelpCircle,
  FiInfo,
  FiTool,
  FiPlay,
  FiCheckCircle,
  FiZap,
  FiBookOpen,
  FiMessageCircle,
  FiExternalLink,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './DashboardMKII.module.scss';
import AddExtensionIcon from '~assets/images/AddExtensionIcon';
import SectionTitle from '../../components/common/SectionTitle/SectionTitle';

export const DashboardMKII = () => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15 * i,
        duration: 0.6,
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
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <motion.div
              variants={textVariants}
              custom={1}
              initial="hidden"
              animate="visible"
              className={styles.badge}
            >
              <span>Welcome Back</span>
            </motion.div>

            <motion.h1
              variants={textVariants}
              custom={2}
              initial="hidden"
              animate="visible"
              className={styles.heroTitle}
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
            </motion.h1>

            <motion.p
              variants={textVariants}
              custom={4}
              initial="hidden"
              animate="visible"
              className={styles.heroDescription}
            >
              Access all your learning tools in one place. Get instant help,
              summarize content, and enhance your study experience with our
              AI-powered features.
            </motion.p>
          </div>

          <motion.div
            variants={textVariants}
            custom={5}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.chromeStoreBadge}>
              <AddExtensionIcon />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.primaryCTA}
              >
                Add to Chrome <FiDownload />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
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
              <div className={styles.videoContainer}>
                <div className={styles.videoPlaceholder}>
                  <FiPlay className={styles.playIcon} />
                  <span>How It Works</span>
                </div>
              </div>
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
                    <p>
                      Take screenshots and get step-by-step solutions instantly
                    </p>
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

        {/* Features Section */}
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
                Need help? Access our comprehensive guides, FAQ section, or
                contact our support team for assistance with any issues.
              </p>
              <button className={styles.cardAction}>
                Get Support <FiHelpCircle />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Help & Support Section */}
        <section className={styles.supportSection}>
          <motion.div
            variants={textVariants}
            custom={5}
            initial="hidden"
            animate="visible"
            className={styles.supportCard}
          >
            <h2 className={styles.supportTitle}>Need Help?</h2>
            <p className={styles.supportDescription}>
              We're here to help you get the most out of your learning
              experience.
            </p>
            <div className={styles.supportLinks}>
              <a href="/faq" className={styles.supportLink}>
                <FiBookOpen />
                <span>FAQs</span>
              </a>
              <a href="/docs" className={styles.supportLink}>
                <FiExternalLink />
                <span>Documentation</span>
              </a>
              <a href="/contact" className={styles.supportLink}>
                <FiMessageCircle />
                <span>Contact Support</span>
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default DashboardMKII;
