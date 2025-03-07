import { Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '~types';
import styles from './PersonalInfo.module.scss';

interface PersonalInfoProps {
  user: User | null;
}

export const PersonalInfo = ({ user }: PersonalInfoProps) => {
  if (!user) return null;

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Split name into first and last name
  const [firstName, ...lastNameParts] = user.name.split(' ');
  const lastName = lastNameParts.join(' ');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  };

  return (
    <div className={styles.personalInfo}>
      <div className={styles.header}>
        <h3 className={styles.title}>Personal Information</h3>
        {/* <motion.button
          className={styles.editButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit2 />
          <span>Edit</span>
        </motion.button> */}
      </div>

      <motion.div
        className={styles.grid}
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="initial"
        animate="animate"
      >
        <motion.div {...fadeInUp} className={styles.field}>
          <label>First Name</label>
          <div className={styles.value}>{firstName}</div>
        </motion.div>

        <motion.div {...fadeInUp} className={styles.field}>
          <label>Last Name</label>
          <div className={styles.value}>{lastName}</div>
        </motion.div>

        <motion.div {...fadeInUp} className={styles.field}>
          <label>Email Address</label>
          <div className={styles.value}>{user.email}</div>
        </motion.div>

        <motion.div
          {...fadeInUp}
          className={`${styles.field} ${styles.countryField}`}
        >
          <label>Country</label>
          <div className={styles.flag}>
            <img
              src={`https://flagcdn.com/24x18/${user.country.toLowerCase()}.png`}
              alt={user.country}
              width={24}
              height={18}
            />
            <span>{user.country.toUpperCase()}</span>
          </div>
        </motion.div>

        {/* <div className="personal-info__field">
          <label>Trial Credits</label>
          <div>{user.trialCredits}</div>
        </div> */}

        <motion.div {...fadeInUp} className={styles.field}>
          <label>Joined</label>
          <div className={styles.value}>{joinedDate}</div>
        </motion.div>
      </motion.div>
    </div>
  );
};
