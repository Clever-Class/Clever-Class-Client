import React from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~components/ui/input';
import { Button } from '~components/ui/button';

import { ResetPasswordFormTypes } from './resetPassword.types';
import { resetPasswordSchema } from './resetPasswordSchema';
import { resetPasswordFields } from './resetPasswordFields';

import './resetPassword.scss';
import { useAuth } from '~hooks';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const { handleResetPassword, error } = useAuth();
  // The useForm hook is used to create a form with the following options:
  const form = useForm<ResetPasswordFormTypes>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Submit the form
  const onSubmit = async (values: ResetPasswordFormTypes) => {
    // The resetToken is extracted from the URL
    const resetToken = window.location.pathname.split('/').pop();

    console.log(resetToken, values.password, values.confirmPassword);
    // checking if the password and confirmPassword are the same
    if (values.password !== values.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // The handleResetPassword function is called with the resetToken and password values from the form
    const message = await handleResetPassword(
      resetToken || '',
      values.password,
    );

    console.log(message, 'message');
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  };
  return (
    <section className="resetPassword_page-section">
      <div className="resetPassword_page-wrapper">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 resetPassword-form"
          >
            {resetPasswordFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof ResetPasswordFormTypes}
                render={({ field: formField }) => (
                  <FormItem className="form-item">
                    <p className="form-label">{field.label}</p>
                    <FormControl>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...formField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="submit-button">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};
