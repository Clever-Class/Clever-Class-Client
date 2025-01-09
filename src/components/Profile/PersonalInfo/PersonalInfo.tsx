import { Edit2 } from 'lucide-react';
import './PersonalInfo.scss';

interface PersonalInfoProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    city: string;
    joinedDate: string;
  };
}

export const PersonalInfo = ({ user }: PersonalInfoProps) => {
  const joinedDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
          <div>{user.firstName}</div>
        </div>

        <div className="personal-info__field">
          <label>Last Name</label>
          <div>{user.lastName}</div>
        </div>

        <div className="personal-info__field">
          <label>Email address</label>
          <div>{user.email}</div>
        </div>

        <div className="personal-info__field">
          <label>Role</label>
          <div>{user.role}</div>
        </div>

        <div className="personal-info__field">
          <label>City</label>
          <div>{user.city}</div>
        </div>

        <div className="personal-info__field">
          <label>Joined</label>
          <div>{joinedDate}</div>
        </div>
      </div>
    </div>
  );
};
