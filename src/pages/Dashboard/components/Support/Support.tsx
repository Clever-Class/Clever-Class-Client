import { FiBookOpen, FiExternalLink, FiMessageCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './Support.module.scss';

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

export const Support = () => {
  return (
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
          We're here to help you get the most out of your learning experience.
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
  );
};

export default Support;
