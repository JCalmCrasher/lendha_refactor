import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function DenyApplicationModal({ isOpen, closeModal, textRef, errors, isSubmitting, onSubmit, disabled }) {
    return (
        <Modal className="auto_deny_modal" isOpen={isOpen}>
            <FormContainer headText="Modify Application" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <FormInput
                        label="Reason for denial"
                        name="loan_denial_reason"
                        type="text"
                        inputRef={textRef}
                        readOnly={isSubmitting}
                        error={errors?.loan_denial_reason}
                        errorMessage={errors?.loan_denial_reason && errors?.loan_denial_reason.message}
                    />

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <Button text="Submit" loading={isSubmitting} disabled={disabled} />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default DenyApplicationModal;
