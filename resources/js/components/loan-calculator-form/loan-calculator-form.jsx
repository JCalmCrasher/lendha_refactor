/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput, { FormInputWithNoRef } from '../form-input/form-input';
import FormSelect from '../form-select/form-select';
import Loader from '../loader/loader';
import { formatAmount, isEmpty, maskCurrency, stripCommas } from '../utils/helper';

import './loan-calculator-form.scss';

import { useLoanInterest } from '../../hooks/useLoanInterest';
import { useTerm } from '../../hooks/useTerm';
import { postApplyLoanInfo } from '../../store/loan/loanSlice';

function LoanCalculatorForm({ isFetching, loan_purposes }) {
    const { user } = useSelector((state) => state.userSlice);

    const dispatch = useDispatch();

    // const [loanInterest, setLoanInterest] = useState(null);
    const [loanResult, setLoanResult] = useState(null);
    const [loanAmount, setLoanAmount] = useState('');
    const [budgetType, setBudgetType] = useState({
        loanPurpose: '4',
        loanType: 'monthly',
    });
    const [floatLoanAmount, setFloatLoanAmount] = useState('');
    const {
        register,
        handleSubmit,
        formState: { isValidating, errors },
        watch,
        setValue,
    } = useForm({
        mode: 'onChange',
    });

    const all_loan_purposes =
        loan_purposes?.map((item) => ({
            id: item.id,
            interest: item.interest,
            value: item.id,
            name: item.purpose,
        })) || [];

    const loanPurpose = watch('loan_interest_id', '');
    const loanType = watch('loan_type', '');

    const { loanTerms } = useTerm(loanPurpose);

    const { minAmount, maxAmount } = useLoanInterest(loanPurpose || '1');

    useEffect(() => {
        const interest = all_loan_purposes?.find((item) => item.id == loanPurpose);

        if (isValidating || all_loan_purposes) {
            // setLoanInterest(interest?.interest);
            setValue('rate', interest?.interest);
        }
    }, [isValidating, loanPurpose, loanType]);

    const [amountErr, setAmountErr] = useState(null);
    const [floatAmountErr, setFloatAmountErr] = useState(null);

    useEffect(() => {
        if (stripCommas(loanAmount) < minAmount || stripCommas(loanAmount) > maxAmount) {
            setAmountErr(`Starting from ${formatAmount(minAmount)} - ${formatAmount(maxAmount)}`);
        }

        return () => setAmountErr(null);
    }, [loanAmount, maxAmount, minAmount]);

    useEffect(() => {
        if (stripCommas(floatLoanAmount) < minAmount || stripCommas(floatLoanAmount) > maxAmount) {
            setFloatAmountErr(`Starting from ${formatAmount(minAmount)} - ${formatAmount(maxAmount)}`);
        }

        return () => setFloatAmountErr(null);
    }, [floatLoanAmount, maxAmount, minAmount]);

    const submitLoanCalculatorForm = (data) => {
        if (isEmpty(loanAmount)) {
            return setAmountErr(`Starting from ${formatAmount(minAmount)} - ${formatAmount(maxAmount)}`);
        }

        const loanAmt = stripCommas(loanAmount);

        const { term, rate } = data;
        const payback = parseInt(loanAmt) + ((parseInt(rate || 7) * parseInt(term)) / 100) * parseInt(loanAmt);
        const installment = payback / term;

        setLoanResult({ budget: installment, payback_amount: payback });
        setBudgetType({
            loanPurpose: data.loan_interest_id,
            loanType: data.loan_type,
        });

        dispatch(postApplyLoanInfo({ loanAmt, term, rate, loanPurpose }));
    };

    const submitLoanFloatCalculatorForm = (data) => {
        if (isEmpty(floatLoanAmount)) {
            return setAmountErr(`Starting from ${formatAmount(minAmount)} - ${formatAmount(maxAmount)}`);
        }

        const loanAmt = stripCommas(floatLoanAmount);

        const { term, rate } = data;

        const payback = parseInt(loanAmt) + ((parseInt(rate) * parseInt(term)) / 100) * parseInt(loanAmt);
        let installment = 0;
        if (loanPurpose == '4') {
            installment = payback / 4;
        } else if (loanPurpose == '5') {
            installment = payback / 30;
        }

        setLoanResult({ budget: installment, payback_amount: payback });

        setBudgetType({
            loanPurpose: data.loan_interest_id,
            loanType: data.loan_type,
        });

        dispatch(
            postApplyLoanInfo({
                loanType: 'float',
                loanAmt,
                term,
                rate,
                loanPurpose,
            }),
        );
    };

    const clearLoanResult = () => {
        setLoanResult(null);
        // setLoanInterest(null);
        setValue('rate', '');
        setLoanAmount('');
        setFloatLoanAmount('');
        setBudgetType({
            loanPurpose: '4',
            loanType: 'monthly',
        });
    };

    const maskAmount = (e) => {
        setLoanAmount(maskCurrency(e.target.value));
    };

    const maskFloatAmount = (e) => {
        setFloatLoanAmount(maskCurrency(e.target.value));
    };

    return (
        <FormContainer
            headText="Loan calculator"
            subText="Note: Risk assessment may influence (the total) repayment amount."
        >
            {isFetching ? (
                <Loader color="blue" />
            ) : (
                <>
                    {!loanResult ? (
                        <form
                            className="form loan_calculator_form"
                            onSubmit={handleSubmit(
                                loanType !== 'float' ? submitLoanCalculatorForm : submitLoanFloatCalculatorForm,
                            )}
                        >
                            <div className="d-flex flex-column">
                                <FormSelect
                                    label="Choose Loan Type"
                                    name="loan_type"
                                    selectRef={register('loan_type', {
                                        required: true,
                                    })}
                                    options={[
                                        { value: 'monthly', name: 'Monthly' },
                                        {
                                            value: 'float',
                                            name: 'Float (Daily or weekly)',
                                        },
                                    ]}
                                    error={errors?.loan_type}
                                    errorMessage="This field is required"
                                    sx={{ width: '100%' }}
                                />
                                {(loanType === 'monthly' || loanType === undefined || loanType === '') && (
                                    <FormSelect
                                        label="Loan Category"
                                        name="loan_interest_id"
                                        selectRef={register('loan_interest_id', {
                                            required: true,
                                        })}
                                        options={all_loan_purposes.slice(0, 3)}
                                        error={errors?.loan_interest_id}
                                        errorMessage="This field is required"
                                    />
                                )}
                            </div>
                            {loanType === 'float' && (
                                <div className="grid">
                                    <FormInputWithNoRef
                                        label="Loan Amount (₦)"
                                        name="amount"
                                        type="text"
                                        value={floatLoanAmount}
                                        onChange={maskFloatAmount}
                                        error={floatAmountErr}
                                        errorMessage={`Starting from ${formatAmount(
                                            minAmount,
                                        )} - ${formatAmount(maxAmount)}`}
                                    />
                                    <FormSelect
                                        label="Payment Type"
                                        name="loan_interest_id"
                                        selectRef={register('loan_interest_id', { required: true })}
                                        options={all_loan_purposes.slice(3)}
                                        error={errors?.loan_interest_id}
                                        errorMessage="This field is required"
                                    />
                                </div>
                            )}
                            {loanType === 'float' && (
                                <div className="d-flex">
                                    <FormInput
                                        label="Loan Duration"
                                        name="term"
                                        inputRef={register('term', {
                                            required: true,
                                        })}
                                        error={errors?.term}
                                        errorMessage="This field is required"
                                        groupSx={{ width: '100%' }}
                                        value={1}
                                        readOnly
                                    />
                                </div>
                            )}
                            {(loanType === 'monthly' || loanType === undefined || loanType === '') && (
                                <div className="grid">
                                    <FormInputWithNoRef
                                        label="Loan Amount (₦)"
                                        name="amount"
                                        type="text"
                                        value={loanAmount}
                                        onChange={maskAmount}
                                        error={amountErr}
                                        errorMessage={`Starting from ${formatAmount(
                                            minAmount,
                                        )} - ${formatAmount(maxAmount)}`}
                                    />
                                    <FormSelect
                                        label="Loan Duration"
                                        name="term"
                                        selectRef={register('term', {
                                            required: true,
                                        })}
                                        options={loanTerms}
                                        error={errors?.term}
                                        errorMessage="This field is required"
                                    />
                                </div>
                            )}
                            <div className="d-flex">
                                <FormInput
                                    label="Interest Rate (%)"
                                    name="rate"
                                    type="number"
                                    // value={loanInterest}
                                    inputRef={register('rate', {
                                        required: true,
                                    })}
                                    // placeholder={7}
                                    error={errors?.rate}
                                    errorMessage={errors?.rate && errors?.rate.message}
                                    readOnly
                                    groupSx={{ width: '100%' }}
                                />
                            </div>
                            <div className="d-flex justify-content-center">
                                <Button text="Calculate" />
                            </div>
                        </form>
                    ) : (
                        <div className="loan_result">
                            <div className="info monthly_budget">
                                <p>
                                    {budgetType.loanPurpose == '4' && 'Your weekly budget'}
                                    {budgetType.loanPurpose == '5' && 'Your daily budget'}
                                    {budgetType.loanType == 'monthly' && 'Your monthly budget'}
                                </p>
                                <h4>{formatAmount(loanResult.budget)}</h4>
                            </div>
                            <div className="info payback_amount">
                                <p>Total payback amount</p>
                                <h4>{formatAmount(loanResult.payback_amount)}</h4>
                            </div>

                            <div className="actions">
                                <button type="submit" className="btn_white_blue" onClick={() => clearLoanResult()}>
                                    Try again
                                </button>
                                <Link to={user ? '/dashboard?loan=apply' : 'register'} className="btn_blue">
                                    Take Loan
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            )}
        </FormContainer>
    );
}

export default LoanCalculatorForm;
