/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { Modal } from 'reactstrap';
import { v4 as key } from 'uuid';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

import { formatAmountNoDecimal } from '../utils/helper';

function InvestmentPackageModal({
    isOpen,
    closeModal,
    packages,
    nameRef,
    min_amountRef,
    max_amountRef,
    amountRef,
    durationRef,
    interestRef,
    errors,
    isSubmitting,
    onSubmit,
}) {
    return (
        <Modal className="loan_interest_modal" isOpen={isOpen}>
            <FormContainer headText="New Investment Package" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Current packages:</label>
                        <div className="plans">
                            {packages.map((item) => (
                                <div key={key()} className="plan">
                                    <p>{item.name}</p>
                                    <p>
                                        {item.interest}% - {item.duration}months period
                                    </p>
                                    <h6>
                                        {formatAmountNoDecimal(item.min_amount)} -{' '}
                                        {formatAmountNoDecimal(item.max_amount)}
                                    </h6>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid_div">
                        <FormInput
                            label="Package name"
                            name="name"
                            type="text"
                            inputRef={nameRef}
                            readOnly={isSubmitting}
                            error={errors?.name}
                            errorMessage={errors?.name && errors?.name.message}
                        />
                        <FormInput
                            label="Min. amount"
                            name="min_amount"
                            type="number"
                            inputRef={min_amountRef}
                            readOnly={isSubmitting}
                            error={errors?.min_amount}
                            errorMessage={errors?.min_amount && errors?.min_amount.message}
                        />
                        <FormInput
                            label="Max. amount"
                            name="max_amount"
                            type="number"
                            inputRef={max_amountRef}
                            readOnly={isSubmitting}
                            error={errors?.max_amount}
                            errorMessage={errors?.max_amount && errors?.max_amount.message}
                        />
                        <FormInput
                            label="Duration (months)"
                            name="duration"
                            type="number"
                            inputRef={durationRef}
                            readOnly={isSubmitting}
                            error={errors?.duration}
                            errorMessage={errors?.duration && errors?.duration.message}
                        />
                        <FormInput
                            label="Interest (%)"
                            name="interest"
                            type="number"
                            inputRef={interestRef}
                            readOnly={isSubmitting}
                            error={errors?.interest}
                            errorMessage={errors?.interest && errors?.interest.message}
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

export default InvestmentPackageModal;
