/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';
import FormSelect from '../form-select/form-select';

import './modal.scss';

function LoanInterestModal({
    isOpen,
    closeModal,
    interests,
    onSelect,
    rateRef,
    textRef,
    repaymentRef,
    errors,
    isSubmitting,
    onSubmit,
}) {
    return (
        <Modal className="loan_interest_modal" isOpen={isOpen}>
            <FormContainer headText="New Loan Interest" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Current loan interests:</label>
                        <div className="plans">
                            {interests.map((item, i) => (
                                <div key={i} className="plan" onClick={() => onSelect(item)}>
                                    <h6>
                                        {item.interest}% - {item.purpose}
                                    </h6>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid_div">
                        <FormInput
                            label="Loan interest (%)"
                            name="interest"
                            type="number"
                            inputRef={rateRef}
                            readOnly={isSubmitting}
                            error={errors?.interest}
                            errorMessage={errors?.interest && errors?.interest.message}
                        />
                        <FormInput
                            label="Loan purpose"
                            name="purpose"
                            type="text"
                            inputRef={textRef}
                            readOnly={isSubmitting}
                            error={errors?.purpose}
                            errorMessage={errors?.purpose && errors?.purpose.message}
                        />
                        <FormInput
                            label="Moratorium"
                            name="moratorium"
                            type="number"
                            // inputRef={moratoriumRef}
                            error={errors?.moratorium}
                            errorMessage={errors?.moratorium && errors?.moratorium.message}
                        />
                        <FormSelect
                            // selectRef={selectRef}
                            selectRef={repaymentRef}
                            name="repayment_duration"
                            label="Repayment Duration"
                            options={[
                                { value: 'daily', name: 'Daily' },
                                { value: 'weekly', name: 'Weekly' },
                                { value: 'monthly', name: 'Monthly' },
                            ].map((item) => ({
                                value: item.id,
                                name: item.name,
                            }))}
                            error={errors?.repayment_duration}
                            errorMessage={errors?.repayment_duration && errors?.repayment_duration.message}
                        />
                    </div>

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <Button text="Submit" loading={isSubmitting} disabled={errors?.rate || errors?.purpose} />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default LoanInterestModal;
