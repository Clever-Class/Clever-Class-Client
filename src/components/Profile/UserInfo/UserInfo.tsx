import { Edit2 } from 'lucide-react';
import './UserInfo.scss';
import { User } from '~types';

interface UserInfoProps {
  user: User | null;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  if (!user) return null;

  return (
    <div className="user-info">
      <div className="user-info__content">
        <div className="user-info__avatar">
          <img
            src="/placeholder.svg"
            alt="Profile"
            width={80}
            height={80}
            className="user-info__avatar-image"
          />
        </div>

        <div className="user-info__details">
          <h2 className="user-info__name">{user.name}</h2>
          <div className="user-info__meta">
            <span className="user-info__email">{user.email}</span>
          </div>
        </div>
      </div>

      <button className="user-info__edit">
        <Edit2 size={16} />
        <span>Edit</span>
      </button>
    </div>
  );
};
