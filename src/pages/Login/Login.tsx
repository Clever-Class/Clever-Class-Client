// LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Input } from '~/components/ui/Input/Input';
import { Button } from '~/components/ui/Button/Button';
import { OAuthSignup } from '~/components/OAuthSignup';

// Icons
import { PiEyeThin, PiEyeSlashThin } from 'react-icons/pi';

// Styles
import styles from './Login.module.scss';

// API and Types
import { api } from '~api';
import { LOGIN_SUCCESS } from '~constants';
import { AppDispatch } from '~store';
import Cookies from 'js-cookie';

const FormSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

type FormData = z.infer<typeof FormSchema>;

export const LoginPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const handleLogin = async (data: FormData) => {
    try {
      const response = await api.ccServer.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { token, user, subscription } = response.data;

      // Save the token to cookies (you might want to use a cookie library like js-cookie)
      Cookies.set('userToken', token);

      // Update Redux store
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token,
          user,
          subscription,
        },
      });

      // Redirect to dashboard
      navigate('/dashboard');
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginForm}>
        <div className={styles.logo}>CLEVER CLASS</div>
        <div className={styles.header}>
          <h2>Welcome back</h2>
          <p>Log in to your account to continue</p>
        </div>

        <div className={styles.oAuthSection}>
          <OAuthSignup />
        </div>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <PiEyeSlashThin /> : <PiEyeThin />}
              </button>
            }
            {...register('password')}
          />

          <Button type="submit" size="lg" fullWidth>
            Login
          </Button>
        </form>

        <p className={styles.signupLink}>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
        <p className={styles.forgotPassword}>
          <a href="/forgot-password">Forgot password?</a>
        </p>
      </div>

      <div className={styles.promoSection}>
        <h2>450+ Million validated leads data-base</h2>
        <img
          src="https://getheroes-public.s3.eu-west-3.amazonaws.com/asset-auth/auth_img_4.webp"
          alt="Promo"
          className={styles.promoImage}
        />
      </div>
    </div>
  );
};
