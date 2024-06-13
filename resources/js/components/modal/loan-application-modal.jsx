import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';
import FormSelect from '../form-select/form-select';

import './modal.scss';

function LoanApplicationModal({
    isOpen,
    closeModal,
    loanType,
    loanTypeRef,
    paymentTypeRef,
    loanAmtRef,
    selectedLoanPurposeValue,
    selectedLoanTermValue,
    onChangeLoanAmt,
    onChangeFloatLoanAmt,
    loanAmtErr,
    floatLoanAmtErr,
    loanAmtVal,
    floatLoanAmtVal,
    loan_purposes,
    loan_terms,
    loanInteretIdRef,
    rateRef,
    loanDurationRef,
    floatLoanDurationRef,
    floatTermVal,
    loanInterestValue,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
    setValue,
    onBankLink,
    bankLinkLoading,
    bankLinkText,
}) {
    const purposes = loan_purposes.map((item) => ({
        value: item.id,
        name: item.purpose,
    }));

    return (
        <Modal className="loan_application_modal" isOpen={isOpen}>
            <FormContainer headText="Apply for a new Loan" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="d-flex flex-column">
                        <FormSelect
                            label="Choose Loan Type"
                            name="loan_type"
                            selectRef={loanTypeRef}
                            options={[
                                { value: 'monthly', name: 'Monthly' },
                                {
                                    value: 'float',
                                    name: 'Float (Daily or weekly)',
                                },
                            ]}
                            value={loanType}
                            error={errors?.loan_type}
                            errorMessage="This field is required"
                            groupSx={{ width: '100%' }}
                        />
                        {(loanType === 'monthly' || loanType === undefined || loanType === '') && (
                            <FormSelect
                                label="Loan Category"
                                name="loan_interest_id"
                                value={selectedLoanPurposeValue}
                                selectRef={loanInteretIdRef}
                                readOnly={isSubmitting}
                                options={purposes}
                                error={errors?.loan_interest_id}
                                errorMessage={errors?.loan_interest_id && errors?.loan_interest_id.message}
                            />
                        )}
                    </div>
                    {loanType === 'float' && (
                        <div className="grid">
                            <FormInput
                                label="Loan Amount (₦)"
                                name="loan_amount"
                                type="text"
                                value={floatLoanAmtVal}
                                onChange={onChangeFloatLoanAmt}
                                error={errors?.loan_amount}
                                errorMessage={errors?.loan_amount && errors?.loan_amount?.message}
                                inputRef={loanAmtRef}
                            />
                            <FormSelect
                                label="Payment Type"
                                name="loan_interest_id"
                                selectRef={paymentTypeRef}
                                readOnly={isSubmitting}
                                options={purposes}
                                value={selectedLoanPurposeValue}
                                error={errors?.loan_interest_id}
                                errorMessage={errors?.loan_interest_id && errors?.loan_interest_id.message}
                            />
                        </div>
                    )}
                    {loanType === 'float' && (
                        <div className="d-flex">
                            <FormInput
                                label="Loan Duration"
                                name="float_loan_term"
                                value={floatTermVal}
                                inputRef={floatLoanDurationRef}
                                error={errors?.loan_term}
                                errorMessage={errors?.loan_term && 'This field is required'}
                                options={loan_terms}
                                groupSx={{ width: '100%' }}
                                readOnly={loanType === 'float' || isSubmitting}
                            />
                        </div>
                    )}
                    {(loanType === 'monthly' || loanType === undefined || loanType === '') && (
                        <div className="grid">
                            <FormInput
                                label="Loan Amount (₦)"
                                name="loan_amount"
                                type="text"
                                value={loanAmtVal}
                                // onChange={onChangeLoanAmt}
                                readOnly={isSubmitting}
                                error={errors?.loan_amount}
                                inputRef={loanAmtRef}
                                errorMessage={errors?.loan_amount && errors?.loan_amount.message}
                            />
                            <FormSelect
                                label="Loan Duration"
                                name="loan_term"
                                value={selectedLoanTermValue}
                                selectRef={loanDurationRef}
                                readOnly={isSubmitting}
                                options={loan_terms}
                                error={errors?.loan_term}
                                errorMessage={errors?.loan_term && errors?.loan_term.message}
                            />
                        </div>
                    )}
                    <div className="d-flex">
                        <FormInput
                            label="Interest Rate (%)"
                            name="rate"
                            type="number"
                            // value={loanInterestValue}
                            // placeholder={7}
                            inputRef={rateRef}
                            readOnly
                            error={errors?.rate}
                            errorMessage={errors?.rate && errors?.rate.message}
                            groupSx={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <Button
                            onClick={onBankLink}
                            style={{
                                width: '100%',
                            }}
                            text={bankLinkText}
                            loading={bankLinkLoading}
                            type="button"
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

export default LoanApplicationModal;
