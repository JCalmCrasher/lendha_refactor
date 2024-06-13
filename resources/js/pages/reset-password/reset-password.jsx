import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Alert from '../../components/alert/alert';
import Button from '../../components/button/button';
import FormContainer from '../../components/form-container/form-container';
import FormInput from '../../components/form-input/form-input';
import NavBar from '../../components/navbar/navbar';
import SignInLeftDiv from '../../components/sign-in-left-div/sign-in-left-div';
import Spinner from '../../components/spinner/spinner';
import { successStatusCode } from '../../components/utils/helper';
import { closeAlert, setAlert } from '../../store/components/componentsSlice';
import { resetPassword } from '../../store/user/userSlice';

import '../sign-in/sign-in.scss';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';

function SignInPage() {
    const [,] = useDocumentTitle('Lendha | Reset Password');

    const query = new URLSearchParams(useLocation().search);
    const query_token = query.get('token');
    const query_email = query.get('email');

    const dispatch = useDispatch();
    const { isLoading, isFetching, alert } = useSelector((state) => state.componentsSlice);
    const { user } = useSelector((state) => state.userSlice);
    const isSubmitting = isLoading;
    const notification = alert;
    const {
        register,
        handleSubmit,
        formState: { isValidating, isValid },
        watch,
        errors,
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        if (isValidating && notification.show) dispatch(closeAlert());
    }, [isValidating, notification, dispatch]);

    const passwordInput = watch('password', '');

    const submitSignInForm = (data) => {
        if (!!query_token && !!query_email) {
            const email = { email: query_email };
            const token = { token: query_token };

            const resetData = Object.assign(data, email, token);

            dispatch(resetPassword(resetData)).then((res) => {
                if (res?.status === successStatusCode) {
                    window.location.assign('/dashboard');
                }
            });
        } else {
            dispatch(setAlert({ message: 'Invalid token or email', type: 'error', show: true }));
        }
    };

    if (user) return <div>{window.location.assign('/dashboard')}</div>;

    return (
        <>
            {isFetching && <Spinner />}

            <NavBar />

            <div className="sign_in_page">
                <div className="left_div">
                    <SignInLeftDiv theme="light" />
                </div>
                <div className="sign_in_container">
                    <FormContainer headText="Reset your Password">
                        <form className="form sign_in_form" onSubmit={handleSubmit(submitSignInForm)}>
                            <FormInput
                                label="Password"
                                name="password"
                                type="password"
                                inputRef={register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be more than 6 characters',
                                    },
                                })}
                                readOnly={isSubmitting}
                                error={errors?.password}
                                errorMessage={errors?.password && errors?.password.message}
                            />
                            <FormInput
                                label="Confirm password"
                                name="password_confirmation"
                                type="password"
                                inputRef={register('password_confirmation', {
                                    required: 'Password confirmation is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be more than 6 characters',
                                    },
                                    validate: (value) => value === passwordInput || 'The passwords do not match',
                                })}
                                readOnly={isSubmitting}
                                error={errors?.password_confirmation}
                                errorMessage={errors?.password_confirmation && errors?.password_confirmation.message}
                            />

                            <Button text="Reset" loading={isSubmitting} disabled={!isValid} w="full" />
                        </form>
                    </FormContainer>
                </div>
            </div>

            {/* Other components */}
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={notification.message}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}
        </>
    );
}

export default SignInPage;
