import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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

    function onSubmit(values: FormSchemaTypes) {
        console.log(values);
    }

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
                                        <p className="form-label">
                                            {field.label}
                                        </p>
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
