import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function EditLoanInterestModal({ isOpen, closeModal, purpose, rateRef, errors, isSubmitting, onSubmit }) {
    return (
        <Modal className="loan_interest_modal" isOpen={isOpen}>
            <FormContainer headText={`Edit ${purpose} Interest`} rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <FormInput
                        label="Loan interest (%)"
                        name="interest"
                        type="number"
                        inputRef={rateRef}
                        readOnly={isSubmitting}
                        error={errors?.interest}
                        errorMessage={errors?.interest && errors?.interest.message}
                    />

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <Button text="Submit" loading={isSubmitting} disabled={errors?.rate} />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default EditLoanInterestModal;
