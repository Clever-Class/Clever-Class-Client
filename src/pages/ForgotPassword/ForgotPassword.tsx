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

import { ForgotPasswordFormTypes } from './forgotPassword.types';
import { forgotPasswordFormSchema } from './forgotPasswordSchema';
import { forgotPasswordFields } from './forgotPasswordFields';

import './forgotPassword.scss';

export const ForgotPassword = () => {
  // The useForm hook is used to create a form with the following options:
  const form = useForm<ForgotPasswordFormTypes>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  // Submit the form
  const onSubmit = async (values: ForgotPasswordFormTypes) => {
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
    <section className="forgotPassword_page-section">
      <div className="forgotPassword_form-wrapper">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 forgotPassword-form"
          >
            {forgotPasswordFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof ForgotPasswordFormTypes}
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
