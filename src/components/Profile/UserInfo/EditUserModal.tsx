import { useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '~types';
import { Modal } from './Modal';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '~/store/actions/authActions';
import { AppDispatch, RootState } from '~/store';
import { toast } from 'react-hot-toast';
import styles from './EditUserModal.module.scss';

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const EditUserModal = ({
  user,
  isOpen,
  onClose,
}: EditUserModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState(user.name);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (file) {
        formData.append('avatar', file);
      }

      const result = await dispatch(updateProfile(formData));

      if (result.success) {
        toast.success(result.message);
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close edit profile modal"
        >
          <X />
        </button>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.header}>
            <h2>Edit Profile</h2>
            <p>Update your name and profile picture</p>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <motion.div
                className={styles.image}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className={styles.avatar}>
                  <AvatarImage
                    src={previewImage || user.avatar || '/placeholder.svg'}
                    alt={`${name}'s profile picture`}
                  />
                  <AvatarFallback>
                    {name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <label htmlFor="profile-image" className={styles.uploadButton}>
                <Camera size={18} />
                <span className="sr-only">Upload profile picture</span>
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
                aria-label="Choose profile picture"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="name">Display Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} size={16} />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
