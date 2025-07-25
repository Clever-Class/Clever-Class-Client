import { Edit2 } from 'lucide-react';
import { User } from '~store/types';
import styles from './PersonalInfo.module.scss';

interface PersonalInfoProps {
  user: User | null;
}

export const PersonalInfo = ({ user }: PersonalInfoProps) => {
  if (!user) return null;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not available';

  // Split name into first and last name if name exists
  const [firstName = 'Not specified', ...lastNameParts] =
    user.name?.split(' ') || [];
  const lastName = lastNameParts.join(' ') || 'Not specified';

  return (
    <div className={styles.personalInfo}>
      <div className={styles.header}>
        <h3 className={styles.title}>Personal Information</h3>
        {/* <button className={styles.editButton}>
          <Edit2 />
          <span>Edit</span>
        </button> */}
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>First Name</label>
          <div className={styles.value}>{firstName}</div>
        </div>

        <div className={styles.field}>
          <label>Last Name</label>
          <div className={styles.value}>{lastName}</div>
        </div>

        <div className={styles.field}>
          <label>Email Address</label>
          <div className={styles.value}>{user.email}</div>
        </div>

        <div className={`${styles.field} ${styles.countryField}`}>
          <label>Country</label>
          <div className={styles.flag}>
            {user.country && (
              <>
                <img
                  src={`https://flagcdn.com/24x18/${user.country.toLowerCase()}.png`}
                  alt={`${user.country} flag`}
                />
                <span>{user.country.toUpperCase()}</span>
              </>
            )}
            {!user.country && <span>Not specified</span>}
          </div>
        </div>

        {/* <div className="personal-info__field">
          <label>Trial Credits</label>
          <div>{user.trialCredits}</div>
        </div> */}

        <div className={styles.field}>
          <label>Joined</label>
          <div className={styles.value}>{joinedDate}</div>
        </div>
      </div>
    </div>
  );
};
