import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

const EmploymentModal = ({
    isOpen,
    closeModal,
    textRef,
    emailRef,
    urlRef,
    phoneNumberRef,
    dateRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) => (
    <Modal className="employment_modal" isOpen={isOpen}>
        <FormContainer headText="Edit Employment" rule close={closeModal}>
            <form className="form" onSubmit={onSubmit}>
                <div className="grid_div">
                    <FormInput
                        label="Employer name"
                        name="name"
                        type="text"
                        inputRef={textRef}
                        readOnly={isSubmitting}
                        error={errors?.name}
                        errorMessage={errors?.name && errors?.name.message}
                    />
                    <FormInput
                        label="Employer work email"
                        name="email"
                        type="email"
                        inputRef={emailRef}
                        readOnly={isSubmitting}
                        error={errors?.email}
                        errorMessage={errors?.email && errors?.email.message}
                    />
                    <FormInput
                        label="Employer website"
                        name="site"
                        type="url"
                        placeholder="e.g: https://www.thewebsite.com"
                        inputRef={urlRef}
                        readOnly={isSubmitting}
                        error={errors?.site}
                        errorMessage={errors?.site && errors?.site.message}
                    />
                    <FormInput
                        label="Employer work address"
                        name="address"
                        type="text"
                        inputRef={textRef}
                        readOnly={isSubmitting}
                        error={errors?.address}
                        errorMessage={errors?.address && errors?.address.message}
                    />
                    <FormInput
                        label="Employer phone number"
                        name="phone"
                        type="number"
                        inputRef={phoneNumberRef}
                        readOnly={isSubmitting}
                        error={errors?.phone}
                        errorMessage={errors?.phone && errors?.phone.message}
                    />
                    <FormInput
                        label="Date you started work"
                        name="resumption_date"
                        type="date"
                        inputRef={dateRef}
                        readOnly={isSubmitting}
                        error={errors?.resumption_date}
                        errorMessage={errors?.resumption_date && errors?.resumption_date.message}
                    />
                </div>

                <div className="actions">
                    <p className="btn_white_blue" onClick={closeModal}>
                        Cancel
                    </p>
                    <Button text="Submit" loading={isSubmitting} disabled={disabled} />
                </div>
            </form>
        </FormContainer>
    </Modal>
);

export default EmploymentModal;
