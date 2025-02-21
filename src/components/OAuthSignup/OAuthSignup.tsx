// Core dependencies
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

// Firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '~/firebase/firebase-config';

// Components
import { SocialButton } from '~components/Buttons';

// Icons
import { FcGoogle } from 'react-icons/fc';

// Styles
import styles from './OAuthSignup.module.scss';

import { api } from '~api';
import { useDispatch } from 'react-redux';
import { LOGIN_SUCCESS } from '~constants';

export const OAuthSignup = () => {
  const dispatch = useDispatch();
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userAccessToken = await result.user.getIdToken();

      // Call the backend to create/verify the user
      const { data } = await api.ccServer.post('/auth/verify-oauth', {
        accessToken: userAccessToken,
      });

      console.log(data, 'data o auth...');

      // Save the token
      Cookies.set('userToken', data.token);

      // Save the token to the redux store
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: data.token,
          user: data.user,
          subscription: data.subscription,
        },
      });

      // Redirect to dashboard with payment popup
      const priceId = data.priceId; // Assuming you get priceId from the response
      const countryCode = data.countryCode; // Assuming you get countryCode from the response
      const user = data.user; // Assuming you get user info from the response

      console.log('Redirecting to dashboard with the following data:', {
        countryCode: countryCode,
        priceId: priceId,
        user: user,
        token: data.token,
      });

      navigate('/dashboard?payment_popup=true', {
        state: {
          countryCode: countryCode,
          priceId: priceId,
          user: user,
          token: data.token,
        },
      });
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
