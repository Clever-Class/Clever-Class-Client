import { FiDownload, FiPlay } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './Hero.module.scss';
import AddExtensionIcon from '~assets/images/AddExtensionIcon';

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

export const Hero = () => {
  return (
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

        <motion.div
          variants={textVariants}
          custom={2}
          initial="hidden"
          animate="visible"
          className={styles.videoContainer}
        >
          <div className={styles.videoPlaceholder}>
            <FiPlay className={styles.playIcon} />
            <span>How It Works</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={textVariants}
        custom={5}
        initial="hidden"
        animate="visible"
        className={styles.ctaContainer}
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
  );
};

export default Hero;
