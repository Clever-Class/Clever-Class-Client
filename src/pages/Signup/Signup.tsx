import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { signupUserAction } from '~store/actions';
import { AppDispatch } from '~store';

import './signup.scss';

export const Signup = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

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
    console.log('Clicked');

    // Custom validation for password and confirmPassword
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    clearErrors('confirmPassword');

    try {
      const accountCreationMessage: string = await dispatch(
        signupUserAction(values),
      );

      console.log(accountCreationMessage, 'accountCreationMessage');
      toast.success(accountCreationMessage);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      // Handle error
      toast.error(error.response.data.message);
    }
  };

  // const signupUser = async (userInfo: FormSchemaTypes) => {
  //   try {
  //     const { data } = await api.ccServer.post('/auth/signup', userInfo);
  //     const userToken = data.token;

  //     // saving token in cookies
  //     Cookies.set('userToken', userToken);
  //   } catch (error: any) {
  //     const { response } = error;
  //     alert(response.data.message);
  //   }
  // };

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
