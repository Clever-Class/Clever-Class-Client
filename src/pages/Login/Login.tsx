import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

import { loginFormSchema } from './loginSchema';
import { FormSchemaTypes } from './login.types';
import { formFields } from './loginFields';
import { AppDispatch } from '~store';

import './login.scss';
import { loginUserAction } from '~store/actions';

export const Login = () => {
  // Create a form using the useForm hook
  const dispatch: AppDispatch = useDispatch();

  // The useForm hook is used to create a form with the following options:
  const form = useForm<FormSchemaTypes>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Submit the form
  const onSubmit = async (values: FormSchemaTypes) => {
    try {
      const successfulLoginMessage: string = await dispatch(
        loginUserAction(values),
      );
      // Display a success toast message
      toast.success(successfulLoginMessage);
    } catch (errorMessage: any) {
      // show error message
      toast.error(errorMessage);
    }
  };

  return (
    <section className="login_page-section">
      <div className="login_form-wrapper">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 login-form"
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
