import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

import { formSchema } from './signupSchema';
import { FormSchemaTypes } from './signup.types';
import { formFields } from './signupFields';
import { api } from '~api';

import './signup.scss';

export const Signup = () => {
  const form = useForm<FormSchemaTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { setError, clearErrors } = form;

  const onSubmit = async (values: FormSchemaTypes) => {
    // Custom validation for password and confirmPassword
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    clearErrors('confirmPassword');

    await signupUser(values);
  };

  const signupUser = async (userInfo: FormSchemaTypes) => {
    try {
      const { data } = await api.ccServer.post('/auth/signup', userInfo);
      const userToken = data.token;

      // saving token in cookies
      Cookies.set('userToken', userToken);
    } catch (error: any) {
      const { response } = error;
      alert(response.data.message);
    }
  };

  return (
    <section className="signup_page-section">
      <div className="signup_form-wrapper">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 signup-form"
          >
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof FormSchemaTypes}
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
