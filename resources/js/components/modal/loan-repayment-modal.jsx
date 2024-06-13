import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function LoanRepaymentModal({ isOpen, closeModal, inputRef, errors, isSubmitting, onSubmit, disabled }) {
    return (
        <Modal className="user_account_modal" isOpen={isOpen}>
            <FormContainer headText="Loan Repayment" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label="Amount paid"
                            name="amount"
                            type="number"
                            inputRef={inputRef}
                            readOnly={isSubmitting}
                            error={errors?.amount}
                            errorMessage={errors?.amount && errors?.amount.message}
                        />
                    </div>

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

export default LoanRepaymentModal;
