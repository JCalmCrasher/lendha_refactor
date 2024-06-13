import React, { useEffect, useState } from 'react';

import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Alert from '../../components/alert/alert';
import Button from '../../components/button/button';
import FormContainer from '../../components/form-container/form-container';
import FormInput from '../../components/form-input/form-input';
import NavBar from '../../components/navbar/navbar';
import SignInLeftDiv from '../../components/sign-in-left-div/sign-in-left-div';
import { successStatusCode } from '../../components/utils/helper';
import { closeAlert } from '../../store/components/componentsSlice';
import { getUserDetails, loginUser, resendVerificationMail, setShowPrivacyPolicy } from '../../store/user/userSlice';

import './sign-in.scss';

function SignInPage() {
    const dispatch = useDispatch();
    const { isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { user } = useSelector((state) => state.userSlice);
    const isSubmitting = isLoading;
    const notification = alert;
    const [showVerifyEmail, setShowVerifyEmail] = useState(false);
    const [userEmail, setUserEmail] = useState(null); // Used for resending Verification email
    const {
        register,
        handleSubmit,
        formState: { isValidating, isValid },
        errors,
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    useEffect(() => {
        if (isValidating && notification.show) {
            dispatch(closeAlert());
            setShowVerifyEmail(false);
        }
    }, [isValidating, notification, dispatch]);

    const submitSignInForm = (data) => {
        setUserEmail(data.email);
        dispatch(
            loginUser({
                ...data,
            }),
        ).then((res) => {
            if (res?.status === successStatusCode) {
                dispatch(getUserDetails(res.data.access_token));
                dispatch(setShowPrivacyPolicy(true));
            }
            if (res === 'Please Verify Email') {
                setShowVerifyEmail(true);
            }
        });
    };

    const resendVerification = () => {
        setShowVerifyEmail(false);
        dispatch(resendVerificationMail(userEmail));
    };

    if (user) {
        switch (user.type) {
            case 'admin':
            case 'subadmin':
            case 'onboarding_officer':
            case 'credit_officer':
            case 'team_lead':
                return <div>{window.location.assign('/admin/dashboard')}</div>;
            case 'user':
            case 'default':
                return <div>{window.location.assign('/dashboard')}</div>;
            case 'merchant':
                return <div>{window.location.assign('/merchant/dashboard')}</div>;
            default:
                return <div>{window.location.assign('/admin/dashboard')}</div>;
        }
    }

    return (
        <>
            <Helmet>
                <title>Lendha | Sign In</title>

                <meta property="og:url" content="https://lendha.com" />
                <meta property="og:title" content="Lendha | Sign In" />
            </Helmet>
            <NavBar />

            <div className="sign_in_page">
                <div className="left_div">
                    <SignInLeftDiv theme="light" />
                </div>
                <div className="sign_in_container">
                    <FormContainer headText="Sign in to your account">
                        {showVerifyEmail && (
                            <div className="info" onClick={() => resendVerification()}>
                                Click here to resend a Verification Mail to your email
                            </div>
                        )}
                        <form className="form sign_in_form" onSubmit={handleSubmit(submitSignInForm)}>
                            <FormInput
                                label="Email address"
                                name="email"
                                type="email"
                                inputRef={register('email', {
                                    required: 'Email address is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                readOnly={isSubmitting}
                                error={errors?.email}
                                errorMessage={errors?.email && errors?.email.message}
                            />
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
                            <p className="forgot">
                                <Link to="/forgot">Forgot password?</Link>
                            </p>

                            <Button w="full" text="Sign in" loading={isSubmitting} disabled={!isValid} />
                            <p className="dont">
                                Don&apos;t have an account? <Link to="/register">Register</Link>
                            </p>
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
