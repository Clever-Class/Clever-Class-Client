// Core dependencies
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Form and validation
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Icons
import { LiaTimesSolid } from 'react-icons/lia';
import { PiEyeThin, PiEyeSlashThin } from 'react-icons/pi';
import { MdOutlineMail } from 'react-icons/md';
import { IoLockClosedOutline } from 'react-icons/io5';

// Components
import { Input } from '~/components/ui/Input/Input';
import { Button } from '~/components/ui/Button/Button';
import { CountrySelector } from '~/components/ui/CountrySelector/CountrySelector';
import { OAuthSignup } from '~components/OAuthSignup';

// Store and Types
import { AppDispatch } from '~store';
import { RootState } from '~store/types';
import { signupUserAction, loginUserAction } from '~store/actions';
import { DEFAULT_SELECTED_PACKAGE, LOGIN_SUCCESS } from '~constants';
import { api } from '~api';

// Local imports
import { AUTH_FORM_FIELDS } from './AuthPopup.data';
import { FormFieldTypes } from './AuthPopup.types';
import styles from './AuthPopup.module.scss';
import Cookies from 'js-cookie';

// Temporary placeholder - replace with actual illustrations
const EmailIcon = () => <MdOutlineMail size={60} color="#2563ff" />;
const LockIcon = () => <IoLockClosedOutline size={60} color="#2563ff" />;

const SignupSchema = z.object({
  name: z.string().min(2, {
    message: 'Name is required',
  }),
  email: z.string().email({
    message: 'Invalid email address',
  }),
  country: z.string().min(2, {
    message: 'Country is required',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

const LoginSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

const ForgotSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

const ResetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof SignupSchema>;
type LoginFormData = z.infer<typeof LoginSchema>;
type ForgotFormData = z.infer<typeof ForgotSchema>;
type ResetFormData = z.infer<typeof ResetSchema>;

interface AuthPopupProps {
  onClose: () => void;
  mode?: 'login' | 'signup' | 'forgot' | 'otp' | 'reset';
}

export const AuthPopup: React.FC<AuthPopupProps> = ({
  onClose,
  mode = 'signup',
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [authMode, setAuthMode] = useState<
    'login' | 'signup' | 'forgot' | 'otp' | 'reset'
  >(mode);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [loading, setLoading] = useState(false);

  const selectedPackageId = useSelector(
    (state: RootState) => state.register.selectedPackage,
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData | LoginFormData>({
    resolver: zodResolver(authMode === 'signup' ? SignupSchema : LoginSchema),
  });

  // Forgot password form
  const forgotForm = useForm<ForgotFormData>({
    resolver: zodResolver(ForgotSchema),
  });

  // Reset password form
  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(ResetSchema),
  });

  const handleSignupWithEmail = async (data: SignupFormData) => {
    try {
      const { message, token, user, success } = await dispatch(
        signupUserAction({
          ...data,
          selectedPackageId: selectedPackageId || DEFAULT_SELECTED_PACKAGE,
        }),
      );

      if (message) {
        if (success) toast.success(message);
        else toast.error(message);
      }

      if (success) {
        navigate('/dashboard?payment_popup=true', {
          state: { user, token },
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLoginWithEmail = async (data: LoginFormData) => {
    setLoading(true);
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

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  const formFields =
    authMode === 'login' || authMode === 'signup'
      ? AUTH_FORM_FIELDS[authMode]
      : [];

  const handleSubmitForm = (data: SignupFormData | LoginFormData) => {
    if (authMode === 'login') {
      handleLoginWithEmail(data as LoginFormData);
    } else {
      handleSignupWithEmail(data as SignupFormData);
    }
  };

  const getErrorMessage = (
    fieldName: keyof (SignupFormData | LoginFormData),
  ) => {
    if (authMode === 'login') {
      return (errors as FieldErrors<LoginFormData>)[
        fieldName as keyof LoginFormData
      ]?.message;
    }
    return (errors as FieldErrors<SignupFormData>)[
      fieldName as keyof SignupFormData
    ]?.message;
  };

  // Handle forgot password submit
  const handleForgotSubmit = async (data: ForgotFormData) => {
    setLoading(true);
    try {
      // Call backend to send OTP
      const response = await api.ccServer.post('/auth/forgot-password', {
        email: data.email,
      });

      if (response.data.success) {
        setOtpEmail(data.email);
        setAuthMode('otp');
        toast.success(response.data.message || 'OTP sent to your email');
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Failed to send OTP. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]; // Only take the first digit
    }

    // Update the OTP digits array
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Move to next input if value is entered
    if (value && index < otpInputRefs.length - 1) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 4).split('');
      setOtpDigits([...digits, ...Array(4 - digits.length).fill('')]);

      // Focus last filled input or the first empty one
      const lastIndex = Math.min(digits.length - 1, otpInputRefs.length - 1);
      otpInputRefs[lastIndex].current?.focus();
    }
  };

  // Handle OTP submit
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join('');

    if (otp.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    // Store the OTP to use in the password reset step
    console.log(`Valid OTP entered: ${otp}`);

    setLoading(true);
    try {
      // Just move to reset password screen
      // In a production app, you might want to verify the OTP here
      setAuthMode('reset');
    } catch (err: any) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!otpEmail) {
      toast.error('Email address is missing');
      return;
    }

    setOtpResendLoading(true);
    try {
      const response = await api.ccServer.post('/auth/forgot-password', {
        email: otpEmail,
      });

      if (response.data.success) {
        toast.success('OTP has been resent to your email');
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setOtpResendLoading(false);
    }
  };

  // Handle reset password submit
  const handleResetSubmit = async (data: ResetFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      // Get the full OTP
      const otp = otpDigits.join('');

      // Validate OTP format
      if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
        toast.error('Invalid OTP format');
        setLoading(false);
        return;
      }

      console.log(
        `Submitting password reset with OTP: "${otp}" and email: "${otpEmail}"`,
      );

      // Make API call
      const response = await api.ccServer.post(`/auth/reset-password/${otp}`, {
        email: otpEmail,
        password: data.password,
      });

      if (response.data.success) {
        toast.success('Password reset successful!');
        setAuthMode('login');
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      console.error('Password reset error:', err?.response?.data || err);
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <LiaTimesSolid />
        </button>

        {/* Forgot Password Step */}
        {authMode === 'forgot' && (
          <div className={styles.forgotContainer}>
            <div className={styles.illustration}>
              <EmailIcon />
            </div>
            <h2>Reset your password</h2>
            <p>
              Enter your email address and we'll send you an OTP code to reset
              your password.
            </p>
            <form
              onSubmit={forgotForm.handleSubmit(handleForgotSubmit)}
              className={styles.form}
            >
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                error={forgotForm.formState.errors.email?.message}
                {...forgotForm.register('email')}
              />
              <Button type="submit" size="lg" fullWidth isLoading={loading}>
                Send OTP
              </Button>
            </form>
            <button
              className={styles.toggleButton}
              onClick={() => setAuthMode('login')}
            >
              Back to login
            </button>
          </div>
        )}

        {/* OTP Step */}
        {authMode === 'otp' && (
          <div className={styles.otpContainer}>
            <div className={styles.illustration}>
              <EmailIcon />
            </div>
            <h2>OTP Verification</h2>
            <p>
              Enter the 4-digit code sent to <b>{otpEmail}</b>
            </p>

            <form onSubmit={handleOtpSubmit} className={styles.form}>
              <div className={styles.otpInputContainer}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpInputRefs[index]}
                    type="text"
                    maxLength={1}
                    className={styles.otpDigit}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    autoFocus={index === 0}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              <Button type="submit" size="lg" fullWidth isLoading={loading}>
                Verify & Proceed
              </Button>

              <button
                type="button"
                className={styles.resendButton}
                onClick={handleResendOtp}
                disabled={otpResendLoading}
              >
                {otpResendLoading ? 'Resending...' : 'Resend code'}
              </button>
            </form>

            <button
              className={styles.toggleButton}
              onClick={() => setAuthMode('forgot')}
            >
              Change email
            </button>
          </div>
        )}

        {/* Reset Password Step */}
        {authMode === 'reset' && (
          <div className={styles.resetContainer}>
            <div className={styles.illustration}>
              <LockIcon />
            </div>
            <h2>Set new password</h2>
            <p>Please create a secure password for your account.</p>
            <form
              onSubmit={resetForm.handleSubmit(handleResetSubmit)}
              className={styles.form}
            >
              <Input
                label="New Password"
                placeholder="Enter new password"
                type={showPassword ? 'text' : 'password'}
                error={resetForm.formState.errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? <PiEyeSlashThin /> : <PiEyeThin />}
                  </button>
                }
                {...resetForm.register('password')}
              />
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                type={showConfirmPassword ? 'text' : 'password'}
                error={resetForm.formState.errors.confirmPassword?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showConfirmPassword ? <PiEyeSlashThin /> : <PiEyeThin />}
                  </button>
                }
                {...resetForm.register('confirmPassword')}
              />
              <Button type="submit" size="lg" fullWidth isLoading={loading}>
                Reset Password
              </Button>
            </form>
          </div>
        )}

        {/* Default Auth Steps (Login/Signup) */}
        {(authMode === 'login' || authMode === 'signup') && (
          <>
            <div className={styles.header}>
              <h2>
                {authMode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p>
                {authMode === 'login'
                  ? 'Please enter your details to sign in'
                  : 'Please enter your details to continue'}
              </p>
            </div>

            <div className={styles.socialAuth}>
              <OAuthSignup />
            </div>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              className={styles.form}
            >
              {formFields.map((field: FormFieldTypes, index: number) => {
                if (field.name === 'country') {
                  return (
                    <CountrySelector
                      key={index}
                      label={field.label}
                      placeholder={field.placeholder}
                      error={getErrorMessage(
                        field.name as keyof (SignupFormData | LoginFormData),
                      )}
                      value={field.value}
                      onChange={(value) => setValue(field.name, value)}
                    />
                  );
                }

                return (
                  <Input
                    key={index}
                    label={field.label}
                    placeholder={field.placeholder}
                    type={
                      field.name === 'password'
                        ? showPassword
                          ? 'text'
                          : 'password'
                        : 'text'
                    }
                    error={getErrorMessage(
                      field.name as keyof (SignupFormData | LoginFormData),
                    )}
                    rightIcon={
                      field.name === 'password' ? (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? <PiEyeSlashThin /> : <PiEyeThin />}
                        </button>
                      ) : undefined
                    }
                    {...register(field.name)}
                  />
                );
              })}

              <Button type="submit" size="lg" fullWidth>
                {authMode === 'login' ? 'Sign in' : 'Sign up'}
              </Button>
            </form>

            {/* Forgot password link */}
            {authMode === 'login' && (
              <button
                className={styles.forgotButton}
                onClick={() => setAuthMode('forgot')}
              >
                Forgot password?
              </button>
            )}

            <p className={styles.toggleAuth}>
              {authMode === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button onClick={toggleAuthMode} className={styles.toggleButton}>
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>

            {authMode === 'signup' && (
              <p className={styles.terms}>
                By signing up, you agree to our{' '}
                <a href="/terms">Terms of Service</a> and{' '}
                <a href="/privacy">Privacy Policy</a>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
