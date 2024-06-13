import React from 'react';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '../../../components/alert/alert';
import { successStatusCode } from '../../../components/utils/helper';
import { useWindowWidth } from '../../../hooks/useWindowDimension';
import { closeAlert } from '../../../store/components/componentsSlice';
import { postAddBusinessManagementWaitingList } from '../../../store/user/userSlice';
import { styles } from '../styles/styles';

const BusinessEarlyAccessInput2 = ({
    inputId = '',
    inputName = '',
    formId = '',
    formName = '',
    placeholder = 'Enter your email address',
    btnText = 'Get early access',
}) => {
    const { isLoading, alert } = useSelector((state) => state.componentsSlice);
    const isSubmitting = isLoading;
    const notification = alert;

    const dispatch = useDispatch();

    const [windowWidth] = useWindowWidth();

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onChange',
    });

    const addToBusinessWaitingList = (data) => {
        console.log({ data });

        dispatch(postAddBusinessManagementWaitingList(data)).then((res) => {
            if (res?.status === successStatusCode) {
                reset();
            }
        });
    };

    return (
        <>
            {errors?.email && <div>{errors?.email.message}</div>}
            <form
                className="input-group early-access-input"
                onSubmit={handleSubmit(addToBusinessWaitingList)}
                id={formId}
                name={formName}
            >
                <input
                    type="email"
                    name={inputName}
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: 'Invalid email address',
                        },
                        minLength: {
                            value: 3,
                            message: 'Email must be 3 characters or more',
                        },
                    })}
                    className="form-control input-sm"
                    style={{
                        ...styles.emailInput,
                        ...{ backgroundColor: 'rgba(197, 197, 197,0.3)' },
                    }}
                    placeholder={placeholder}
                    aria-label="Email address"
                    aria-describedby="email-button"
                    id={inputId}
                />
                <div className="input-group-append">
                    {windowWidth >= 810 ? (
                        <button
                            className="btn btn-info btn-lg"
                            style={{
                                background: 'var(--color-blue)',
                            }}
                            type="submit"
                            title={btnText}
                            disabled={isSubmitting}
                        >
                            {btnText}
                        </button>
                    ) : (
                        <button
                            className="btn btn-info btn-sm"
                            style={{
                                background: 'var(--color-blue)',
                            }}
                            type="submit"
                            title={btnText}
                            disabled={isSubmitting}
                        >
                            {btnText}
                        </button>
                    )}
                </div>
            </form>

            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={notification.message || 'Succesful'}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}
        </>
    );
};

BusinessEarlyAccessInput2.propTypes = {
    placeholder: PropTypes.string,
    btnText: PropTypes.string,
    inputId: PropTypes.string,
    inputName: PropTypes.string,
    formId: PropTypes.string,
    formName: PropTypes.string,
};

export default BusinessEarlyAccessInput2;
