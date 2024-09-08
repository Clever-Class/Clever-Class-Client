import React, { useState } from 'react';

import { LiaTimesSolid } from 'react-icons/lia';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PiEyeThin, PiEyeSlashThin } from 'react-icons/pi';

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

import { SIGNUP_FORM_FIELDS } from './SignupPopup.data';
import { FormFieldTypes } from './SignupPopup.types';

import styles from './SignupPopup.module.scss';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name is required',
  }),
  email: z.string().email({
    message: 'Invalid email address',
  }),

  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

export const SignupPopup = ({ onClose }: any) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data, 'data');
  };

  return (
    <div className={styles.signupPopup}>
      <div className={styles.signupContent}>
        <LiaTimesSolid className={styles.closeButton} onClick={onClose} />
        <h2 className={styles.signupTitle}>Sign up to Clever Class</h2>
        <div className={styles.socialLoginButtons}>
          <SocialButton
            logo="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
            onClick={() => console.log('object')}
            provider="Google"
          />
        </div>

        <div className={styles.divider}>OR</div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            {SIGNUP_FORM_FIELDS.map(
              (formField: FormFieldTypes, index: number) => {
                return (
                  <FormField
                    key={index}
                    control={form.control}
                    name={formField.name as any}
                    render={({ field }) => (
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
                                  <PiEyeSlashThin className={styles.eyeIcon} />
                                ) : (
                                  <PiEyeThin className={styles.eyeIcon} />
                                )}
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              },
            )}

            <Button size={'lg'} type="submit">
              Sign Up
            </Button>
          </form>
        </Form>

        <p className={styles.loginLink}>
          Already have an account? <a href="#">Log In</a>
        </p>

        <p className={styles.terms}>
          By signing up, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>. This site is protected by reCAPTCHA
          and the Google <a href="#">Privacy Policy</a> and{' '}
          <a href="#">Terms of Service</a> also apply.
        </p>
      </div>
    </div>
  );
};
