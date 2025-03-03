// Core dependencies
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Form and validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Icons
import { LiaTimesSolid } from 'react-icons/lia';
import { PiEyeThin, PiEyeSlashThin } from 'react-icons/pi';

// Components
import { Input } from '~/components/ui/Input/Input';
import { Button } from '~/components/ui/Button/Button';
import { CountrySelector } from '~/components/ui/CountrySelector/CountrySelector';

// Local imports
import { SIGNUP_FORM_FIELDS } from './SignupPopup.data';
import { FormFieldTypes } from './SignupPopup.types';
import styles from './SignupPopup.module.scss';

// Store
import { AppDispatch } from '~store';
import { signupUserAction } from '~store/actions';
import { DEFAULT_SELECTED_PACKAGE } from '~constants';
import { RootStateType } from '~store/types';
import { OAuthSignup } from '~components/OAuthSignup';

const FormSchema = z.object({
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

type FormData = z.infer<typeof FormSchema>;

interface SignupPopupProps {
  onClose: () => void;
}

export const SignupPopup: React.FC<SignupPopupProps> = ({ onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const selectedPackageId = useSelector(
    (state: RootStateType) => state.register.selectedPackage,
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const handleSignupWithEmail = async (data: FormData) => {
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

  const handleGoogleSignup = () => {
    // Implement Google signup logic here
    console.log('Google signup clicked');
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

        <div className={styles.header}>
          <h2>Sign up to Clever Class</h2>
          <p>Please enter your details to continue</p>
        </div>

        <div className={styles.socialSignup}>
          <OAuthSignup />
        </div>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <form
          onSubmit={handleSubmit(handleSignupWithEmail)}
          className={styles.form}
        >
          {SIGNUP_FORM_FIELDS.map((field: FormFieldTypes, index: number) => {
            if (field.name === 'country') {
              return (
                <CountrySelector
                  key={index}
                  label={field.label}
                  placeholder={field.placeholder}
                  error={errors[field.name]?.message}
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
                error={errors[field.name]?.message}
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
            Sign up
          </Button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Log in</a>
        </p>

        <p className={styles.terms}>
          By signing up, you agree to our <a href="/terms">Terms of Service</a>{' '}
          and <a href="/privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};
