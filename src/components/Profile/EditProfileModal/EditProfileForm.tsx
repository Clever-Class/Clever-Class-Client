import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import styles from './EditProfileModal.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '~/store';
import { updateProfileAction } from '~/store/actions/userActions';

interface EditProfileFormProps {
  onSuccess: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      // Create update data
      const updateData: { name?: string; avatar?: string } = {};

      // Only update name if it's different from current name
      if (fullName !== user.name) {
        updateData.name = fullName;
      }

      // If we have a new avatar, convert it to base64
      if (avatar) {
        const base64Avatar = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(avatar);
        });
        updateData.avatar = base64Avatar;
      }

      // Only make the API call if we have changes
      if (Object.keys(updateData).length > 0) {
        const response = await dispatch(updateProfileAction(updateData));
        if (response?.success) {
          toast.success(response.message || 'Profile updated successfully');
          onSuccess();
        }
      } else {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      return nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : user.name.slice(0, 2).toUpperCase();
    }
    return '';
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarWrapper}>
          <Avatar className={styles.avatar}>
            <AvatarImage src={previewUrl || user?.avatar} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <label htmlFor="avatar-upload" className={styles.uploadButton}>
            <Camera size={16} />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
            aria-label="Upload profile picture"
          />
        </div>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="Enter your first name"
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
