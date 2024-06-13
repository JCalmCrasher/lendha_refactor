import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormSelect from '../form-select/form-select';

import './modal.scss';

function ModifyLoanPurposeModal({
    isOpen,
    closeModal,
    loan_purposes,
    selectRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    const purposes = loan_purposes.map((item) => ({
        value: item.id,
        name: item.purpose,
    }));

    return (
        <Modal className="auto_deny_modal" isOpen={isOpen}>
            <FormContainer headText="Modify Application" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <FormSelect
                        label="Loan purpose"
                        name="new_loan_purpose_id"
                        selectRef={selectRef}
                        readOnly={isSubmitting}
                        options={purposes}
                        error={errors?.new_loan_purpose_id}
                        errorMessage={errors?.new_loan_purpose_id && errors?.new_loan_purpose_id.message}
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

export default ModifyLoanPurposeModal;
