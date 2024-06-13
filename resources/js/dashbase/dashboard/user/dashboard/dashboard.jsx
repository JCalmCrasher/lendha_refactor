/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-return-assign */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useMemo, useState } from 'react';

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MonoConnect from '@mono.co/connect.js';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { URL } from '../../../../api';
import Alert from '../../../../components/alert/alert';
import Button from '../../../../components/button/button';
import LoanApplicationModal from '../../../../components/modal/loan-application-modal';
import OverviewInfo from '../../../../components/overview-info/overview-info';
import Spinner from '../../../../components/spinner/spinner';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import {
    formatAmount,
    formatDateToString,
    getArrayNthElement,
    isEmpty,
    isNumber,
    paystackFee,
    statusStyling,
    sumOfObjectKeys,
} from '../../../../components/utils/helper';
import { closeAlert, setAlert } from '../../../../store/components/componentsSlice';
import { getLoanPurposes, postNewLoanApplication } from '../../../../store/loan/loanSlice';
import { getUserDashboardDetails } from '../../../../store/user/userSlice';

import './dashboard.scss';

import AvatarPlaceholder from '../../../../assets/images/avatar-placeholder.png';
import LoanMessageModal from '../../../../components/modal/loan-message-modal';
import PaymentModal from '../../../../components/modal/payment-modal';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';
import { useLoanInterest } from '../../../../hooks/useLoanInterest';
import useQuery from '../../../../hooks/useQuery';
import { useTerm } from '../../../../hooks/useTerm';

function UserDashboardPage() {
    const [,] = useDocumentTitle('Dashboard | Lendha');
    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { user, userDashboardDetails } = useSelector((state) => state.userSlice);
    const { loanPurposes, applyLoanInfo } = useSelector((state) => state.loanSlice);

    const isSubmitting = isLoading;
    const notification = alert;
    const [loanApplicationModal, setLoanApplicationModal] = useState(false);
    const [loanMessageModal, setLoanMessageModal] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [amountErr, setAmountErr] = useState(null);
    const [floatAmountErr, setFloatAmountErr] = useState(null);
    // const [loanAmount, setLoanAmount] = useState(
    //     !isEmpty(applyLoanInfo?.loanAmt) ? maskCurrency(applyLoanInfo?.loanAmt) : '',
    // );

    // const maskLoanAmount = (e) => {
    //     setLoanAmount(maskCurrency(e.target.value));
    // };
    // const maskFloatLoanAmount = (e) => {
    //     setFloatLoanAmount(maskCurrency(e.target.value));
    // };
    const {
        register,
        handleSubmit,
        formState: { isValidating, isValid, errors },
        watch,
        // getValues,
        setValue,
    } = useForm({
        mode: 'onTouched',
    });

    const watchLoanAmount = watch('loan_amount', '');
    const watchFloatTermValue = watch('float_loan_term', '');

    const successStatusCode = 200 || 201;
    const [monoCode, setMonoCode] = useState(null);

    useEffect(() => {
        dispatch(getUserDashboardDetails());
        dispatch(getLoanPurposes());
    }, []);

    const loanPurpose = watch('loan_interest_id', '');
    const loanType = watch('loan_type', '');

    const { loanTerms } = useTerm(loanPurpose);

    const { minAmount, maxAmount } = useLoanInterest(loanPurpose || '1');

    useEffect(() => {
        const interest = loanPurposes?.find((item) => item.id == loanPurpose);

        if (isValidating || loanPurposes) {
            setValue('rate', interest?.interest);
            if (loanPurpose == 4) {
                setValue('float_loan_term', 3.6);
            } else if (loanPurpose == 5) {
                setValue('float_loan_term', 3);
            }
        }
    }, [isValidating, loanPurpose, loanPurposes, loanType]);

    const submitLoanApplication = (data) => {
        const loanAmt = data.loan_amount;
        if (isEmpty(loanAmt) || amountErr) {
            return setAmountErr(`Starting from ${formatAmount(minAmount)} - ${formatAmount(maxAmount)}`);
        }

        // const loanAmt = stripCommas(loanAmount);

        const loan_amount = {
            loan_amount: parseInt(loanAmt),
        };
        delete data.rate;

        const loanData = { ...data, ...loan_amount, code: monoCode };

        dispatch(postNewLoanApplication(loanData)).then((res) => {
            if (res.status === successStatusCode) {
                setLoanApplicationModal(false);
                dispatch(getUserDashboardDetails());
            }
        });
    };

    const submitLoanFloatApplication = (data) => {
        const loanAmt = data.loan_amount;
        if (isEmpty(loanAmt) || floatAmountErr) {
            return setFloatAmountErr(`Starting from ${formatAmount(minAmount)} - ${formatAmount(maxAmount)}`);
        }

        // const loanAmt = stripCommas(floatLoanAmount);

        const loan_amount = {
            loan_amount: parseInt(loanAmt),
        };
        delete data.rate;

        const loanData = { ...data, ...loan_amount, code: monoCode };
        loanData.loan_term = loanData.float_loan_term;
        delete loanData.float_loan_term;

        dispatch(postNewLoanApplication(loanData)).then((res) => {
            if (res.status === successStatusCode) {
                setLoanApplicationModal(false);
                dispatch(getUserDashboardDetails());
            }
        });
    };

    const onPaymentSuccess = (data) => {
        const { status } = data;
        if (status === 'success') {
            setPaymentModal(false);
        }
    };

    const onPaymentClose = () => {
        console.log('closed');
    };

    const paystackConfig = {
        reference: new Date().getTime().toString(),
        email: user.email,
        amount:
            (parseInt(userDashboardDetails?.next_payment_amount) +
                paystackFee(userDashboardDetails?.next_payment_amount)) *
                100 || 0,
        paystackkey: URL.paystack_key,
        embed: false,
        text: 'Pay Online',
        class: 'btn_blue',
        callback: (reference) => onPaymentSuccess(reference),
        close: onPaymentClose,
    };

    const allLoans = userDashboardDetails?.user?.loans;
    let activeLoan = {};
    if (userDashboardDetails?.current_application?.status !== 'completed') {
        activeLoan = userDashboardDetails;
    }

    const activeApplication = activeLoan?.current_application;
    const activeLoanStatus = activeLoan?.current_application?.status;
    const activeLoanRepayments = getArrayNthElement(activeLoan?.user?.loans);
    const completedRepayments = activeLoanRepayments?.payments?.filter((item) => item.status === 'completed');
    const completedLoans = allLoans?.filter((loan) => loan.status === 'completed');
    const totalDisbursedAmount = completedLoans ? sumOfObjectKeys(completedLoans, 'approved_amount') : 0;

    const query = useQuery();

    const hasLoanApplyQuery = query.get('loan') === 'apply';

    useEffect(() => {
        if (
            hasLoanApplyQuery &&
            // loanPurposes?.length > 0 &&
            // activeLoanStatus !== "pending" &&
            // activeLoanStatus !== "approved" &&
            // Object.keys(applyLoanInfo).length > 0 &&
            activeLoan?.user?.profile_status === 'complete'
        ) {
            setLoanApplicationModal(true);
        }
    }, [activeLoan?.user?.profile_status, activeLoanStatus, applyLoanInfo, hasLoanApplyQuery, loanPurposes?.length]);

    const credit_officer = userDashboardDetails?.credit_officer;
    const [isCreditOfficerDetailsVisible, setShowCreditOfficerDetails] = useState(false);

    const [bankLinkText, setBankLinkText] = useState('Click to link your Bank Statement (Mono)');
    const [bankLinkLoading, setBankLinkLoading] = useState(false);
    const [bankLinkSuccess, setBankLinkSuccess] = useState(false);

    useEffect(() => {
        if (monoCode) {
            setBankLinkLoading(false);
            setBankLinkText('Bank Statement linked Successfully');
            setBankLinkSuccess(true);
            setValue('hasLinkedBankStatement', true);
        }

        return () => {
            setValue('hasLinkedBankStatement', false);
        };
    }, [monoCode]);
    const monoConnect = useMemo(() => {
        const monoInstance = new MonoConnect({
            onClose: () => setBankLinkLoading(false),
            // eslint-disable-next-line no-console
            onLoad: () => console.log('✅ Widget'),

            onSuccess: async (response) => {
                const { code: auth_code } = response;
                setBankLinkLoading(true);
                try {
                    // dispatch(postBankStatement({ auth_code })).then((res) => {
                    setMonoCode(auth_code);
                    // });
                } catch (error) {
                    dispatch(
                        setAlert({
                            show: true,
                            type: 'error',
                            message: error?.message || 'Something went wrong',
                        }),
                    );
                    setBankLinkLoading(false);
                }
            },
            key: import.meta.env.VITE_MONO_KEY,
        });

        monoInstance.setup();

        return monoInstance;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isFetching && <Spinner />}

            <div className="section dashbase dashboard_page">
                {activeLoan?.user?.profile_status === 'incomplete' && (
                    <div className="todo_div">
                        <Alert
                            className="secondary"
                            textBeforeLink="Your profile is incomplete. "
                            linkText="Click here"
                            linkTo="/profile"
                            textAfterLink=" to complete your profile"
                        />
                    </div>
                )}

                {activeLoanStatus === 'denied' && (
                    <div className="todo_div">
                        <Alert
                            className="error"
                            textBeforeLink={`DENIAL REASON: ${activeApplication?.loan_denial_reason}`}
                        />
                    </div>
                )}

                {activeLoan?.user?.suspended === 1 && (
                    <div className="todo_div">
                        <Alert
                            className="error"
                            textBeforeLink="Your account has been suspended. Please contact info@lendha.com for more info"
                        />
                    </div>
                )}

                <div className="overview_div">
                    <div className="active_application_div">
                        <div className="flex_div">
                            <SubSectionHeader headText="Active Loan" rule />
                            {activeLoanStatus && (
                                <Status type={`${statusStyling(activeLoanStatus)}`} text={activeLoanStatus} />
                            )}
                            {activeLoanStatus === 'approved' && (
                                <Button
                                    text="Repay loan"
                                    onClick={() => {
                                        dispatch(closeAlert());
                                        setPaymentModal(true);
                                    }}
                                />
                            )}
                            {activeLoan?.user?.profile_status === 'incomplete' ? null : (
                                <>
                                    {activeLoanStatus !== 'pending' && activeLoanStatus !== 'approved' && (
                                        <Button
                                            text="New loan"
                                            onClick={() => {
                                                dispatch(closeAlert());
                                                setLoanApplicationModal(true);
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                        <div className="info_div">
                            <OverviewInfo
                                headText={`#${activeApplication?.application_id || '-'}`}
                                subTextSpan="Application ID"
                            />
                            <OverviewInfo
                                headText={formatAmount(activeApplication?.amount || 0)}
                                subTextSpan={`${activeApplication?.status === 'pending' ? 'Applied' : activeApplication?.status === 'denied' ? 'Denied' : activeApplication?.status === 'approved' ? 'Approved' : activeApplication?.status === 'completed' ? 'Completed' : ''} amount`}
                            />
                            <OverviewInfo
                                headText={formatAmount(activeLoan?.total_interest || 0)}
                                subTextSpan="Payback amount"
                            />
                            {/* Peter needs to add duration key to current_application object */}
                            <OverviewInfo
                                headText={activeApplication?.payback_cycle ?? 'N/A'}
                                subTextSpan="Payback cycle"
                            />
                            {/* {activeLoanStatus === 'approved' && (
                                <OverviewInfo
                                    headText={completedRepayments?.length}
                                    headTextSpan={`/${
                                        activeLoanRepayments?.payments?.length || 'N/A'
                                    } - Repayment score`}
                                    currentProgress={completedRepayments?.length}
                                    totalProgress={activeLoanRepayments?.payments?.length}
                                    subText={formatAmount(activeLoan?.total_loan_paid)}
                                    subTextSpan=" - Amount paid back"
                                />
                            )} */}
                        </div>
                    </div>

                    <div className="completed_loans_div">
                        <div className="flex_div">
                            <SubSectionHeader headText="Completed Loans" rule />
                        </div>
                        <div className="info_div">
                            <OverviewInfo
                                headText={completedLoans?.length || '-'}
                                subTextSpan="Total number of completed loans"
                            />
                            <OverviewInfo
                                headText={formatAmount(totalDisbursedAmount)}
                                subTextSpan="Total amount of loans disbursed"
                            />
                        </div>
                        {completedLoans && (
                            <div className="completed_div">
                                {completedLoans.map((item, i) => (
                                    <div key={i} className="info">
                                        <OverviewInfo
                                            headText={`#${item.application_id}`}
                                            subTextSpan="Application ID"
                                        />
                                        <OverviewInfo
                                            headText={formatAmount(item.approved_amount)}
                                            subTextSpan="Approved amount"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Credit Officer */}
                <div
                    style={{
                        borderRadius: '5px',
                        marginTop: '60px',
                        padding: '20px 20px 10px 20px',
                        backgroundColor: '#f4f7ff',
                    }}
                >
                    <SubSectionHeader
                        headText="Credit Officer"
                        rule
                        action={
                            <div
                                className="d-flex"
                                style={{ gap: '16px', cursor: 'pointer' }}
                                onClick={() => setShowCreditOfficerDetails(!isCreditOfficerDetailsVisible)}
                            >
                                <span>
                                    <FontAwesomeIcon icon={isCreditOfficerDetailsVisible ? faAngleUp : faAngleDown} />
                                </span>
                                <span
                                    style={{
                                        color: '1A1A1A',
                                        fontWeight: '600',
                                    }}
                                >
                                    {isCreditOfficerDetailsVisible ? 'Hide' : 'Show'}
                                </span>
                            </div>
                        }
                    />
                    {isCreditOfficerDetailsVisible && (
                        <div className="d-flex" style={{ marginTop: '8px' }}>
                            <div className="credit-officer">
                                <div className="bg-white p-3">
                                    <div className="d-flex align-items-center" style={{ gap: '16px' }}>
                                        <img
                                            src={credit_officer?.image}
                                            onError={(e) => (e.target.src = AvatarPlaceholder)}
                                            alt="credit officer"
                                            style={{
                                                borderRadius: '100%',
                                                width: '35px',
                                                height: '35px',
                                            }}
                                        />
                                        <span
                                            style={{
                                                color: '#1A1F4C',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {credit_officer?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <p className="mt-3">Full Name</p>
                                </div>
                                <div className="bg-white p-3">
                                    <div className="d-flex align-items-center" style={{ gap: '16px' }}>
                                        <svg
                                            width="20"
                                            height="18"
                                            viewBox="0 0 20 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM18 4.238L10.072 11.338L2 4.216V16H18V4.238ZM2.511 2L10.061 8.662L17.502 2H2.511Z"
                                                fill="#5F5F5F"
                                            />
                                        </svg>

                                        <span
                                            style={{
                                                color: '#1A1F4C',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {credit_officer?.email || 'N/A'}
                                        </span>
                                    </div>
                                    <p className="mt-3">Email address</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="loan_repayments_div">
                    <SubSectionHeader headText="Active Loan Repayments" rule />

                    <Table
                        headers={[
                            'S/N',
                            'Due Date',
                            'Status',
                            'Expected Payment',
                            'Amount Paid',
                            'To Balance',
                            'Last Updated',
                        ]}
                        noTableData={!activeLoanRepayments?.payments}
                    >
                        {activeLoanRepayments?.payments?.map((pay, i) => (
                            <tr key={i}>
                                <td>{i + 1}.</td>
                                <td>{formatDateToString(pay.due_date)}</td>
                                <td>
                                    <Status type={statusStyling(pay.status)} text={pay.status} />
                                </td>
                                <td>{formatAmount(pay.intended_payment)}</td>
                                <td>{formatAmount(pay.user_payment)}</td>
                                <td>{formatAmount(pay.intended_payment - pay.user_payment)}</td>
                                <td>{formatDateToString(pay.updated_at)}</td>
                            </tr>
                        ))}
                    </Table>
                </div>
            </div>

            {/* Other components */}
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={notification.message}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert(null))}
                />
            )}

            {loanApplicationModal && (
                <LoanApplicationModal
                    isOpen={loanApplicationModal}
                    closeModal={() => setLoanApplicationModal(false)}
                    loan_purposes={loanType !== 'float' ? loanPurposes?.slice(0, 3) : loanPurposes?.slice(3)}
                    loan_terms={loanTerms}
                    loanTypeRef={register('loan_type', {
                        required: 'This field is required',
                    })}
                    loanType={isEmpty(loanType) ? applyLoanInfo?.loanType : loanType}
                    paymentTypeRef={register('loan_interest_id', {
                        required: 'This field is required',
                    })}
                    loanAmtRef={register('loan_amount', {
                        required: 'This field is required',
                        validate: (value) => {
                            if (isEmpty(value)) {
                                return 'This field is required';
                            }
                            if (!isNumber(value)) {
                                return 'Invalid amount';
                            }
                            if (parseInt(value) < minAmount || parseInt(value) > maxAmount) {
                                return `Starting from ${formatAmount(minAmount)} - ${formatAmount(maxAmount)}`;
                            }
                        },
                    })}
                    selectedLoanPurposeValue={applyLoanInfo?.loanPurpose || loanPurpose || '1'}
                    selectedLoanTermValue={applyLoanInfo?.term || 1}
                    floatTermVal={watchFloatTermValue}
                    // loanInterestValue={loanInterest}
                    loanAmtErr={amountErr}
                    floatLoanAmtErr={floatAmountErr}
                    loanAmtVal={watchLoanAmount}
                    floatLoanAmtVal={watchLoanAmount}
                    // onChangeLoanAmt={maskLoanAmount}
                    // onChangeFloatLoanAmt={maskFloatLoanAmount}
                    rateRef={register('rate', {
                        required: true,
                    })}
                    loanInteretIdRef={register('loan_interest_id', {
                        required: 'This field is required',
                    })}
                    loanDurationRef={register('loan_term', {
                        required: 'This field is required',
                    })}
                    floatLoanDurationRef={register('float_loan_term', {
                        required: loanType !== 'monthly' ? 'This field is required' : false,
                    })}
                    setValue={setValue}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(loanType !== 'float' ? submitLoanApplication : submitLoanFloatApplication)}
                    disabled={!isValid || !monoCode}
                    onBankLink={() => {
                        if (!bankLinkSuccess) {
                            monoConnect.open();
                            setBankLinkLoading(true);
                        }
                    }}
                    bankLinkLoading={bankLinkLoading}
                    bankLinkText={bankLinkText}
                />
            )}

            {loanMessageModal && (
                <LoanMessageModal closeModal={() => setLoanMessageModal(false)} isOpen={loanMessageModal} />
            )}

            {paymentModal && (
                <PaymentModal
                    isOpen={paymentModal}
                    headText="Make Loan Repayment"
                    closeModal={() => setPaymentModal(false)}
                    amount={userDashboardDetails?.next_payment_amount || 0}
                    amountText="Amount to pay"
                    accountName={user?.account?.account_name || 'LENDHA TECHNOLOGY LIMITED'}
                    accountNumber={user?.account?.account_number || '1219170339'}
                    bankName={user?.account?.bank_name || 'ZENITH BANK'}
                    receiptTo={user?.account?.account_number ? undefined : 'info@lendha.com'}
                    config={paystackConfig}
                />
            )}
        </>
    );
}

export default UserDashboardPage;
