import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { LiaTimesSolid } from 'react-icons/lia';
import { PiEyeThin, PiEyeSlashThin } from 'react-icons/pi';
import { FcGoogle } from 'react-icons/fc';

import { SocialButton } from '~components/Buttons';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { CountrySelector } from '~components/Selector';

import { SIGNUP_FORM_FIELDS } from './SignupPopup.data';
import { FormFieldTypes } from './SignupPopup.types';
import { AppDispatch } from '~store';
import { signupUserAction } from '~store/actions';

import styles from './SignupPopup.module.scss';
import { useState } from 'react';
import { firebaseApp } from '~/firebase/firebase-config';

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

  // Firebase Auth
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const { message, token, countryCode, user, success } = await dispatch(
        signupUserAction({
          ...data,
        }),
      );

      // displaying success toast message
      if (message) {
        if (success) toast.success(message);
        else toast.error(message);
      }

      // redirecting to payment page
      const priceId = searchParams.get('priceId');

      if (success) {
        navigate('/dashboard?payment_popup=true', {
          state: {
            countryCode: countryCode,
            priceId: priceId,
            user,
            token,
          },
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        console.log('User:', user);
      })
      .catch((error) => {
        console.log('Error:', error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className={styles.signupPopup}>
      <div className={styles.signupContent}>
        <LiaTimesSolid className={styles.closeButton} onClick={onClose} />
        <h2 className={styles.signupTitle}>Sign up to Clever Class</h2>
        <div className={styles.socialLoginButtons}>
          <SocialButton
            icon={FcGoogle}
            onClick={handleGoogleSignup}
            provider="Google"
          />
        </div>

        <div className={styles.divider}>OR</div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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

            <Button
              size={'lg'}
              type="submit"
              className={styles.signup_button}
              onClick={handleGoogleSignup}
            >
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
