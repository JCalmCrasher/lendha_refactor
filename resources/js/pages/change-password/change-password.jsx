import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Alert from '../../components/alert/alert';
import Button from '../../components/button/button';
import FormContainer from '../../components/form-container/form-container';
import FormInput from '../../components/form-input/form-input';
import NavBar from '../../components/navbar/navbar';
import SignInLeftDiv from '../../components/sign-in-left-div/sign-in-left-div';
import { closeAlert } from '../../store/components/componentsSlice';
import { forgotPassword } from '../../store/user/userSlice';

import '../sign-in/sign-in.scss';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';

function ChangePasswordPage() {
    const [,] = useDocumentTitle('Lendha | Change Password ');

    const dispatch = useDispatch();
    const { isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { user } = useSelector((state) => state.userSlice);
    const isSubmitting = isLoading;
    const notification = alert;
    const {
        register,
        handleSubmit,
        formState: { isValidating, isValid, errors },
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    useEffect(() => {
        if (isValidating && notification.show) dispatch(closeAlert());
    }, [isValidating, notification, dispatch]);

    const submitSignInForm = (data) => {
        dispatch(forgotPassword({ ...data }));
    };

    if (user) return <div>{window.location.assign('/dashboard')}</div>;

    return (
        <>
            <NavBar className="less" />

            <div className="sign_in_page">
                <div className="left_div">
                    <SignInLeftDiv theme="dark" />
                </div>
                <div className="sign_in_container">
                    <FormContainer headText="Change password">
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
                            <p className="forgot">
                                <Link to="/sign-in">Remember now?</Link>
                            </p>

                            <Button text="Continue" loading={isSubmitting} disabled={!isValid} />
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

export default ChangePasswordPage;
