import { Edit2 } from 'lucide-react';
import './PersonalInfo.scss';
import { User } from '~types';

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

  return (
    <div className="personal-info">
      <div className="personal-info__header">
        <h3 className="personal-info__title">Personal Information</h3>
        <button className="personal-info__edit">
          <Edit2 size={16} />
          <span>Edit</span>
        </button>
      </div>

      <div className="personal-info__grid">
        <div className="personal-info__field">
          <label>First Name</label>
          <div>{firstName}</div>
        </div>

        <div className="personal-info__field">
          <label>Last Name</label>
          <div>{lastName}</div>
        </div>

        <div className="personal-info__field">
          <label>Email address</label>
          <div>{user.email}</div>
        </div>

        <div className="personal-info__field country-field">
          <label>Country</label>
          <span className="country-field__flag">
            <img
              src={`https://flagcdn.com/24x18/${user.country.toLowerCase()}.png`}
              alt={user.country}
              width={24}
              height={18}
              className="user-info__flag"
            />
            <span>{user.country.toUpperCase()}</span>
          </span>
        </div>

        {/* <div className="personal-info__field">
          <label>Trial Credits</label>
          <div>{user.trialCredits}</div>
        </div> */}

        <div className="personal-info__field">
          <label>Joined</label>
          <div>{joinedDate}</div>
        </div>
      </div>
    </div>
  );
};
