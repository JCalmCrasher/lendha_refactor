/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';

import queryString from 'query-string';
import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import Alert from '../../components/alert/alert';
import Button from '../../components/button/button';
import FormContainer from '../../components/form-container/form-container';
import FormInput from '../../components/form-input/form-input';
import FormSelect from '../../components/form-select/form-select';
import NavBar from '../../components/navbar/navbar';
import SignInLeftDiv from '../../components/sign-in-left-div/sign-in-left-div';
import { checkIfObject, formatRegistrationDate, getYearFromDate } from '../../components/utils/helper';
import { closeAlert } from '../../store/components/componentsSlice';
import { getReferralChannels, registerUser } from '../../store/user/userSlice';

import '../sign-in/sign-in.scss';

import ConsentCheckbox from '../../components/consent-checkbox';

function RegisterPage() {
    const [isChecked, setIsChecked] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isValidating, isValid, errors },
        watch,
    } = useForm({
        mode: 'onChange',
    });
    const dispatch = useDispatch();
    const { isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { user, referralChannels } = useSelector((state) => state.userSlice);
    const location = useLocation();

    const isSubmitting = isLoading;
    const notification = alert;

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    const passwordInput = watch('password', '');

    useEffect(() => {
        if (isValidating && notification.show) dispatch(closeAlert());
    }, [isValidating, notification, dispatch]);

    useEffect(() => {
        dispatch(getReferralChannels());
    }, [dispatch]);

    const fallbackReferralChannels = [
        { value: '', name: 'Select referral channel' },
        { value: '1', name: 'Facebook' },
        { value: '2', name: 'Instagram' },
        { value: '3', name: 'Twitter' },
        { value: '4', name: 'Google' },
        { value: '5', name: 'LinkedIn' },
        { value: '6', name: 'Medium' },
        { value: '7', name: 'Other' },
    ];

    const submitRegisterForm = (data) => {
        const param = queryString.parse(location.search);
        const merchant = param.m ? { merchant: param.m } : null;
        const date_of_birth = {
            date_of_birth: formatRegistrationDate(data.date_of_birth),
        };
        delete data.date_of_birth;

        const registrationData = Object.assign(data, merchant, date_of_birth, {
            terms_accepted: isChecked,
        });

        dispatch(
            registerUser({
                ...registrationData,
            }),
        );
    };

    if (user) return <div>{window.location.assign('/dashboard')}</div>;

    return (
        <>
            <Helmet>
                <title>Lendha | Register</title>

                <meta property="og:url" content="https://lendha.com" />
                <meta property="og:title" content="Lendha | Register" />
            </Helmet>
            <NavBar />
            <div className="sign_in_page">
                <div className="left_div">
                    <SignInLeftDiv theme="dark" />
                </div>
                <div className="sign_in_container">
                    <FormContainer headText="Create your Lendha account">
                        <form className="form sign_in_form" onSubmit={handleSubmit(submitRegisterForm)}>
                            <FormInput
                                label="Full name"
                                name="name"
                                type="text"
                                inputRef={register('name', {
                                    required: 'Full name is required',
                                    pattern: {
                                        value: /^[a-zA-Z]{2,}/,
                                        message: 'Invalid full name',
                                    },
                                })}
                                readOnly={isSubmitting}
                                error={errors?.name}
                                errorMessage={errors?.name && errors?.name?.message}
                                autoComplete="name"
                            />
                            <FormInput
                                label="Business name"
                                name="business_name"
                                type="text"
                                inputRef={register('business_name', {
                                    required: 'Business name is required',
                                    pattern: {
                                        value: /^[a-zA-Z]{2,}/,
                                        message: 'Invalid business name',
                                    },
                                })}
                                readOnly={isSubmitting}
                                error={errors?.business_name}
                                errorMessage={errors?.business_name && errors?.business_name?.message}
                                autoComplete="organization"
                            />
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
                                errorMessage={errors?.email && errors?.email?.message}
                                autoComplete="email"
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
                                errorMessage={errors?.password && errors?.password?.message}
                                autoComplete="new-password"
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
                                errorMessage={errors?.password_confirmation && errors?.password_confirmation?.message}
                                autoComplete="new-password"
                            />
                            <FormInput
                                label="Phone number"
                                name="phone_number"
                                type="number"
                                inputRef={register('phone_number', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /[0-9]{11,}/,
                                        message: 'Invalid phone number',
                                    },
                                })}
                                readOnly={isSubmitting}
                                error={errors?.phone_number}
                                errorMessage={errors?.phone_number && errors?.phone_number?.message}
                            />
                            <FormInput
                                label="Date of birth (Same as registered with your bank)"
                                name="date_of_birth"
                                type="date"
                                inputRef={register('date_of_birth', {
                                    required: 'Date of birth is required',
                                    validate: (value) =>
                                        getYearFromDate(new Date()) - getYearFromDate(value) >= '18' ||
                                        'You are below 18years and not eligble to use our service',
                                    valueAsDate: true,
                                })}
                                readOnly={isSubmitting}
                                error={errors?.date_of_birth}
                                errorMessage={errors?.date_of_birth && errors?.date_of_birth?.message}
                            />
                            <FormSelect
                                label="How did you hear about Lendha?"
                                name="referral_channel"
                                options={
                                    referralChannels?.length > 0
                                        ? [
                                              {
                                                  value: '',
                                                  name: 'Select referral channel',
                                              },
                                              ...referralChannels,
                                          ]
                                        : fallbackReferralChannels
                                }
                                readOnly={isSubmitting}
                                error={errors?.referral_channel}
                                errorMessage={errors?.referral_channel && errors?.referral_channel?.message}
                            />
                            <ConsentCheckbox isChecked={isChecked} setIsChecked={() => setIsChecked(!isChecked)} />

                            <Button
                                w="full"
                                text="Register"
                                loading={isSubmitting}
                                disabled={!(isValid && isChecked)}
                            />

                            <p className="dont">
                                Already have an account? <Link to="/sign-in">Sign in</Link>
                            </p>
                        </form>
                    </FormContainer>
                </div>
            </div>
            {/* Other components */}
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={
                        checkIfObject(notification.message)
                            ? Object.values(JSON.parse(notification.message)).map((msg, i) => (
                                  <span key={i}>{msg[0]}</span>
                              ))
                            : notification.message
                    }
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}
        </>
    );
}

export default RegisterPage;
