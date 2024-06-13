import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';
import { formatAmountNoDecimal } from '../utils/helper';

import './modal.scss';

function NewAdminInvestmentModal({
    isOpen,
    closeModal,
    investment_plans,
    onSelect,
    selected_plan,
    amountRef,
    emailRef,
    errors,
    isSubmitting,
    onSubmit,
}) {
    return (
        <Modal className="new_investment_modal" isOpen={isOpen}>
            <FormContainer headText="New Investment" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Select investment package:</label>
                        <div className="plans">
                            {investment_plans.map((plan, i) => (
                                <div
                                    key={i}
                                    className={`plan ${selected_plan && selected_plan.id === plan.id && 'selected'}`}
                                    onClick={() => onSelect(plan)}
                                >
                                    <p>
                                        {plan.interest}% - {plan.duration}months period
                                    </p>
                                    <h6>
                                        {formatAmountNoDecimal(plan.min_amount)} -{' '}
                                        {formatAmountNoDecimal(plan.max_amount)}
                                    </h6>
                                </div>
                            ))}
                        </div>
                    </div>

                    <FormInput
                        label="Amount to invest (₦)"
                        name="amount_paid"
                        type="number"
                        inputRef={amountRef}
                        readOnly={!selected_plan || isSubmitting}
                        error={errors?.amount_paid}
                        errorMessage={errors?.amount_paid && errors?.amount_paid.message}
                    />

                    <FormInput
                        label="User email"
                        name="email"
                        type="email"
                        inputRef={emailRef}
                        readOnly={!selected_plan || isSubmitting}
                        error={errors?.email}
                        errorMessage={errors?.email && errors?.email.message}
                    />

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <Button
                            text="Submit"
                            loading={isSubmitting}
                            disabled={!selected_plan || errors?.amount || errors?.email}
                        />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default NewAdminInvestmentModal;
