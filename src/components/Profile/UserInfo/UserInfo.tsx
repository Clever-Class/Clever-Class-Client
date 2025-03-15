import { Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './UserInfo.scss';
import { User } from '~types';
import { Avatar, AvatarFallback, AvatarImage } from '~components/ui/avatar';
import styles from './UserInfo.module.scss';
import { useState } from 'react';
import { EditUserModal } from './EditUserModal';

interface UserInfoProps {
  user: User | null;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) return null;

  return (
    <div className={styles.userInfo}>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <Avatar className="w-full h-full">
            <AvatarImage src="/placeholder.svg" alt={user.name} />
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className={styles.details}>
          <h2 className={styles.name}>{user.name}</h2>
          <div className={styles.meta}>
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      <button
        className={styles.editButton}
        onClick={() => setIsEditModalOpen(true)}
      >
        <Edit2 />
        <span>Edit Profile</span>
      </button>

      <EditUserModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
