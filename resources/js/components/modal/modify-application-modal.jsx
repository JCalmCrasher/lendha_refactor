import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function ModifyApplicationModal({
    isOpen,
    closeModal,
    loanAmtRef,
    loanTermRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    return (
        <Modal className="auto_deny_modal" isOpen={isOpen}>
            <FormContainer headText="Modify Application" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label="Loan amount"
                            name="loan_amount"
                            type="number"
                            inputRef={loanAmtRef}
                            readOnly={isSubmitting}
                            error={errors?.loan_amount}
                            errorMessage={errors?.loan_amount && errors?.loan_amount.message}
                        />
                        <FormInput
                            label="Loan term (months)"
                            name="loan_term"
                            type="number"
                            inputRef={loanTermRef}
                            readOnly={isSubmitting}
                            error={errors?.loan_term}
                            errorMessage={errors?.loan_term && errors?.loan_term.message}
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

export default ModifyApplicationModal;
