import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
import { formFields } from './signupFields';
import { signupUserAction } from '~store/actions';
import { AppDispatch } from '~store';
import { FormSchemaTypes } from './signup.types';

import './signup.scss';
import { DEFAULT_SELECTED_PACKAGE } from '~constants';
import { validatePassword } from '~utils';

export const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

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
    const passwordValid = validatePassword(values, setError);
    if (!passwordValid) return;

    clearErrors('confirmPassword');

    try {
      const { message, countryCode, user, success } = await dispatch(
        signupUserAction({
          ...values,
          selectedPackageId: DEFAULT_SELECTED_PACKAGE,
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
        navigate('/payment', {
          state: {
            countryCode: countryCode,
            priceId: priceId,
            user,
          },
        });
      }
    } catch (errorMessage: any) {
      toast.error(errorMessage);
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
