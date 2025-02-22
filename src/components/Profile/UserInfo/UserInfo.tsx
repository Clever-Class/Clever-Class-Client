import { Edit2 } from 'lucide-react';
import './UserInfo.scss';
import { User } from '~types';
import { Avatar, AvatarFallback, AvatarImage } from '~components/ui/avatar';

interface UserInfoProps {
  user: User | null;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  if (!user) return null;

  return (
    <div className="user-info">
      <div className="user-info__content">
        <div className="user-info__avatar">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder.svg" alt={user.name} />
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
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
