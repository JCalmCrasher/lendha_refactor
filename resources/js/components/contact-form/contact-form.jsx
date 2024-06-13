import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { closeAlert } from '../../store/components/componentsSlice';
import { contactUs } from '../../store/user/userSlice';
import Alert from '../alert/alert';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';
import TextArea from '../text-area/text-area';

import './contact-form.scss';

import ConsentCheckbox from '../consent-checkbox';

const ContactForm = () => {
    const [formSubmitting, setFormSubmitting] = useState('lazy');
    const [isChecked, setIsChecked] = useState(false);

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        errors,
        formState: { isValidating, isValid },
    } = useForm();

    const submitContactForm = (data) => {
        setFormSubmitting('submitting');
        dispatch(contactUs({ ...data })).then(() => {
            setFormSubmitting('submitted');

            setTimeout(() => {
                setFormSubmitting('lazy');
            }, 2000);
        });
    };

    return (
        <>
            {formSubmitting === 'submitted' && <Alert className="secondary" textBeforeLink="Your message was sent" />}
            <FormContainer
                headText="Contact us"
                subText="If you need help with your user account, have questions, or are experiencing any difficulty, please do not hesitate to contact us."
                id="contact-us"
            >
                <form className="form contact_form" onSubmit={handleSubmit(submitContactForm)}>
                    <FormInput
                        label="Full name"
                        name="name"
                        type="text"
                        inputRef={register('name', { required: true })}
                        error={errors?.name}
                        errorMessage="This field is required"
                    />
                    <FormInput
                        label="Email address"
                        name="email"
                        type="email"
                        inputRef={register('email', { required: true })}
                        error={errors?.email}
                        errorMessage="Invalid email address"
                    />
                    <TextArea
                        label="Message"
                        name="message"
                        type="text"
                        rows={3}
                        inputRef={register('message', { required: true })}
                        error={errors?.message}
                        errorMessage="This field is required"
                    />
                    <ConsentCheckbox isChecked={isChecked} setIsChecked={() => setIsChecked(!isChecked)} />
                    <button
                        type="submit"
                        className="btn_blue"
                        disabled={formSubmitting === 'submitting' || !(isValid && isChecked)}
                    >
                        Contact us
                    </button>
                </form>
            </FormContainer>
        </>
    );
};

export default ContactForm;
