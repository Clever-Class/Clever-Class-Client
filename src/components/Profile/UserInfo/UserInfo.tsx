import { Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './UserInfo.scss';
import { User } from '~types';
import { Avatar, AvatarFallback, AvatarImage } from '~components/ui/avatar';
import styles from './UserInfo.module.scss';

interface UserInfoProps {
  user: User | null;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  if (!user) return null;

  return (
    <div className={styles.userInfo}>
      <div className={styles.content}>
        <motion.div
          className={styles.avatar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar className="w-full h-full">
            <AvatarImage src="/placeholder.svg" alt={user.name} />
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.div
          className={styles.details}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className={styles.name}>{user.name}</h2>
          <div className={styles.meta}>
            <span>{user.email}</span>
          </div>
        </motion.div>
      </div>

      <motion.button
        className={styles.editButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Edit2 />
        <span>Edit Profile</span>
      </motion.button>
    </div>
  );
};
