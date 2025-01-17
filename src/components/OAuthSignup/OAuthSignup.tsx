// Core dependencies
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '~/firebase/firebase-config';

// Components
import { SocialButton } from '~components/Buttons';

// Icons
import { FcGoogle } from 'react-icons/fc';

// Store
import { AppDispatch } from '~store';
import { signupWithGoogleAction } from '~store/actions';

// Styles
import styles from './OAuthSignup.module.scss';

export const OAuthSignup = () => {
  const dispatch: AppDispatch = useDispatch();
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await dispatch(signupWithGoogleAction(result.user));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.socialLoginButtons}>
      <SocialButton
        icon={FcGoogle}
        onClick={handleGoogleSignup}
        provider="Google"
        title="Continue with"
      />
    </div>
  );
};
