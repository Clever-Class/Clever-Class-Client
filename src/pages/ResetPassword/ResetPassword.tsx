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

import { ResetPasswordFormTypes } from './ResetPassword.types';
import { resetPasswordSchema } from './resetPasswordSchema';
import { resetPasswordFields } from './resetPasswordFields';

import './resetPassword.scss';

export const ResetPassword = () => {
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
    console.log(values);
    // try {
    //   const successfulLoginMessage: string = await dispatch(
    //     loginUserAction(values),
    //   );
    //   // Display a success toast message
    //   toast.success(successfulLoginMessage);
    // } catch (errorMessage: any) {
    //   // show error message
    //   toast.error(errorMessage);
    // }
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
