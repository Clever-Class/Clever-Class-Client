// Core dependencies
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Form and validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Icons
import { LiaTimesSolid } from 'react-icons/lia';
import { PiEyeThin, PiEyeSlashThin } from 'react-icons/pi';

// Components
import { OAuthSignup } from '~components/OAuthSignup';
import { Button } from '~/components/ui/button';
import { CountrySelector } from '~components/Selector';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

// Local imports
import { SIGNUP_FORM_FIELDS } from './SignupPopup.data';
import { FormFieldTypes } from './SignupPopup.types';
import styles from './SignupPopup.module.scss';

// Store
import { AppDispatch } from '~store';
import { signupUserAction } from '~store/actions';
import { DEFAULT_SELECTED_PACKAGE } from '~constants';
import { RootStateType } from '~store/types';

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

interface SignupPopupProps {
  onClose: () => void;
}
export const SignupPopup: React.FC<SignupPopupProps> = ({ onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const selectedPackageId = useSelector(
    (state: RootStateType) => state.register.selectedPackage,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country: '',
    },
  });

  const handleSignupWithEmail = async (data: z.infer<typeof FormSchema>) => {
    try {
      const { message, token, user, success } = await dispatch(
        signupUserAction({
          ...data,
          selectedPackageId: selectedPackageId || DEFAULT_SELECTED_PACKAGE,
        }),
      );

      // displaying success toast message
      if (message) {
        if (success) toast.success(message);
        else toast.error(message);
      }

      console.log('Redirecting to dashboard with the following data:', {
        user,
        token,
      });

      if (success) {
        navigate('/dashboard?payment_popup=true', {
          state: {
            user,
            token,
          },
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.signupPopup}>
      <div className={styles.signupContent}>
        <LiaTimesSolid className={styles.closeButton} onClick={onClose} />
        <h2 className={styles.signupTitle}>Sign up to Clever Class</h2>
        <OAuthSignup />
        <div className={styles.divider}>OR</div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignupWithEmail)}
            className="w-2/3 space-y-6 "
          >
            {SIGNUP_FORM_FIELDS.map(
              (formField: FormFieldTypes, index: number) => {
                return (
                  <FormField
                    key={index}
                    control={form.control}
                    name={formField.name as any}
                    render={({ field }) => {
                      if (formField.type === 'country')
                        return (
                          <FormItem>
                            <FormLabel>{formField.label}</FormLabel>
                            <FormControl>
                              <CountrySelector
                                name={field.name}
                                setValue={form.setValue}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      return (
                        <FormItem>
                          <FormLabel>{formField.label}</FormLabel>
                          <FormControl>
                            <div className={styles.passwordInputWrapper}>
                              <Input
                                type={
                                  formField.name === 'password'
                                    ? showPassword
                                      ? 'text'
                                      : 'password'
                                    : 'text'
                                }
                                placeholder={formField.placeholder}
                                {...field}
                              />
                              {formField.name === 'password' && (
                                <button
                                  type="button"
                                  className={styles.passwordToggle}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <PiEyeSlashThin
                                      className={styles.eyeIcon}
                                    />
                                  ) : (
                                    <PiEyeThin className={styles.eyeIcon} />
                                  )}
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                );
              },
            )}

            <Button size={'lg'} type="submit" className={styles.signup_button}>
              Sign Up
            </Button>
          </form>
        </Form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Log In</a>
        </p>

        <p className={styles.terms}>
          By signing up, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};
