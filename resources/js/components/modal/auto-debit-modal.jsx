import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function AutoDebitModal({ isOpen, closeModal, inputRef, errors, isSubmitting, onSubmit, disabled }) {
    return (
        <Modal className="auto_deny_modal" isOpen={isOpen}>
            <FormContainer headText="Modify Application" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label="Debit amount"
                            name="amount"
                            type="number"
                            inputRef={inputRef}
                            readOnly={isSubmitting}
                            error={errors?.amount}
                            errorMessage={errors?.amount && errors?.amount.message}
                        />
                        {/* <FormInput
            label="Change key (lendha/bazuze)"
            name="payment_key"
            type="text"
            inputRef={inputRef}
            readOnly={isSubmitting}
            error={errors?.payment_key}
            errorMessage={errors?.payment_key && errors?.payment_key.message}
          /> */}
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

export default AutoDebitModal;
