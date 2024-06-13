import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function LoanInterestModal({ isOpen, closeModal, startDateRef, endDateRef, errors, isSubmitting, onSubmit }) {
    return (
        <Modal className="auto_deny_modal" isOpen={isOpen}>
            <FormContainer headText="Auto Deny Requests" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label="From Date"
                            name="from_date"
                            type="date"
                            inputRef={startDateRef}
                            readOnly={isSubmitting}
                            error={errors?.from_date}
                            errorMessage={errors?.from_date && errors?.from_date.message}
                        />
                        <FormInput
                            label="To Date"
                            name="to_date"
                            type="date"
                            inputRef={endDateRef}
                            readOnly={isSubmitting}
                            error={errors?.to_date}
                            errorMessage={errors?.to_date && errors?.to_date.message}
                        />
                    </div>

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <Button text="Submit" loading={isSubmitting} disabled={errors?.from_date || errors?.to_date} />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default LoanInterestModal;
