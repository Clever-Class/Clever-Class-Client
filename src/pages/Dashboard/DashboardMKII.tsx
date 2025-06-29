import { motion } from 'framer-motion';
import styles from './DashboardMKII.module.scss';
import { Hero, HowItWorks, Features, Support } from './components';

export const DashboardMKII = () => {
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
        <Hero />
        <HowItWorks />
        <Features />
        <Support />
      </div>
    </motion.div>
  );
};

export default DashboardMKII;
