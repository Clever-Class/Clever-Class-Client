import { Edit2 } from 'lucide-react';
import './UserInfo.scss';

interface UserInfoProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    country: string;
    countryCode: string;
  };
}

export const UserInfo = ({ user }: UserInfoProps) => {
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
          <h2 className="user-info__name">
            {user.firstName} {user.lastName}
          </h2>
          <div className="user-info__meta">
            <span className="user-info__role">{user.role}</span>
            <span className="user-info__location">
              <img
                src={`https://flagcdn.com/24x18/${user.countryCode.toLowerCase()}.png`}
                alt={user.country}
                width={24}
                height={18}
                className="user-info__flag"
              />
              {user.country}
            </span>
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
