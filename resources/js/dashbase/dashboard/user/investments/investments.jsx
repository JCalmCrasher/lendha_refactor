import React, { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { v4 as key } from 'uuid';

import { URL } from '../../../../api';
import Alert from '../../../../components/alert/alert';
import Button from '../../../../components/button/button';
import NewInvestmentModal from '../../../../components/modal/new-investment-modal';
import PaymentModal from '../../../../components/modal/payment-modal';
import OverviewInfo from '../../../../components/overview-info/overview-info';
import Spinner from '../../../../components/spinner/spinner';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import {
    formatAmount,
    formatAmountNoDecimal,
    formatDateInWords,
    formatDateToString,
    paystackFee,
    statusStyling,
    successStatusCode,
} from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import {
    getInvestmentPlans,
    getUserInvestments,
    postUserInvestment,
} from '../../../../store/investment/investmentSlice';

import './investments.scss';

import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

function UserInvestmentsPage() {
    const [,] = useDocumentTitle('Lendha | Investments');

    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { user } = useSelector((state) => state.userSlice);
    const { investment_plans, userInvestments } = useSelector((state) => state.investmentSlice);
    const isSubmitting = isLoading;
    const notification = alert;
    const [newInvestmentModal, setNewInvestmentModal] = useState(false);
    const [investmentPlan, setInvestmentPlan] = useState(null);
    const [investment, setInvestment] = useState(null);
    const [paymentModal, setPaymentModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
        setValue,
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        dispatch(getInvestmentPlans());
        dispatch(getUserInvestments());
    }, []);

    const proceedWithInvestment = (data) => {
        const { id } = investmentPlan;
        setInvestment({
            charge_amount: paystackFee(data.amount),
            investment_amount: data.amount,
            investment_plan_id: id,
            user_id: user.id,
        });
        setPaymentModal(true);
    };

    const onPaymentSuccess = (data) => {
        const { status, reference } = data;
        if (status === 'success') {
            setPaymentModal(false);
            setInvestment({ ...investment, transaction_reference: reference });
        }
    };

    const submitNewInvestment = useCallback(() => {
        dispatch(postUserInvestment(investment)).then((res) => {
            if (res.status === successStatusCode) {
                setNewInvestmentModal(false);
                dispatch(getUserInvestments());
            }
        });
    }, [investment, dispatch]);
    useEffect(() => {
        if (investment && investment.transaction_reference) submitNewInvestment();
    }, [investment, submitNewInvestment]);

    const onPaymentClose = () => {
        console.log('closed');
    };

    const paystackConfig = {
        reference: new Date().getTime().toString(),
        email: user.email,
        amount: investment
            ? (parseInt(investment.investment_amount) + paystackFee(investment.investment_amount)) * 100
            : 0,
        paystackkey: URL.paystack_key,
        embed: false,
        text: 'Pay Online',
        class: 'btn_blue',
        callback: (reference) => onPaymentSuccess(reference),
        close: onPaymentClose,
    };

    const completedInvestments = userInvestments?.investments?.filter((item) => item.status === 'completed');

    return (
        <>
            {isFetching && <Spinner />}

            <div className="section dashbase investment_page">
                <div className="overview_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Investment Overview" rule />
                        <Button
                            text="New Investment"
                            onClick={() => {
                                setInvestmentPlan(null);
                                dispatch(closeAlert());
                                setNewInvestmentModal(true);
                            }}
                        />
                    </div>
                    <div className="info_div">
                        <OverviewInfo
                            headText={formatAmount(userInvestments?.sum_of_investments)}
                            subTextSpan="Total amount invested"
                        />
                        <OverviewInfo
                            headText={formatAmount(userInvestments?.total_expected_returns)}
                            subTextSpan="Total expected returns"
                        />
                        <OverviewInfo
                            headText={
                                userInvestments?.next_end_of_cycle !== ''
                                    ? formatDateInWords(userInvestments?.next_end_of_cycle)
                                    : '-'
                            }
                            subTextSpan="Next end of cycle"
                        />
                        {userInvestments?.investments?.length !== 0 && (
                            <OverviewInfo
                                headText={completedInvestments?.length}
                                headTextSpan={`/${userInvestments?.investments?.length} - Paidout investments`}
                                currentProgress={completedInvestments?.length}
                                totalProgress={userInvestments?.investments?.length}
                            />
                        )}
                    </div>
                </div>

                <div className="recent_investments_div">
                    <SubSectionHeader headText="Recent Investments" rule />

                    <Table
                        headers={[
                            'S/N',
                            'Status',
                            'Amount Invested',
                            'Plan ID',
                            'Period',
                            'ROI',
                            'Exp. Return',
                            'End of cycle',
                        ]}
                        noTableData={userInvestments?.investments?.length === 0}
                    >
                        {(userInvestments?.investments || [])?.map((item, i) => (
                            <tr key={key()}>
                                <td>{i + 1}.</td>
                                <td>
                                    <Status type={statusStyling(item.status)} text={item.status} />
                                </td>
                                <td>{formatAmount(item.amount)}</td>
                                <td>{item.investment_plan_id}</td>
                                <td>{item.plan?.duration}months</td>
                                <td>{item.plan?.interest}%</td>
                                <td>{formatAmount(item.returns)}</td>
                                <td>{formatDateToString(item.end_of_cycle)}</td>
                            </tr>
                        ))}
                    </Table>
                </div>
            </div>

            {/* Other components */}
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={
                        notification.message === 'Please change your password' ? (
                            <span>
                                Update your password. Click <Link to="/profile">here</Link> to change password
                            </span>
                        ) : (
                            notification?.message
                        )
                    }
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}

            {newInvestmentModal && (
                <NewInvestmentModal
                    isOpen={newInvestmentModal}
                    closeModal={() => {
                        setNewInvestmentModal(false);
                        setValue('amount', '');
                    }}
                    investment_plans={investment_plans}
                    onSelect={(plan) => setInvestmentPlan(plan)}
                    selected_plan={investmentPlan}
                    amountRef={register('amount', {
                        required: 'Amount to invest is required',
                        min: {
                            value: investmentPlan ? investmentPlan.min_amount : 0,
                            message: `Minimum amount is ${formatAmountNoDecimal(
                                investmentPlan ? investmentPlan.min_amount : 0,
                            )}`,
                        },
                        max: {
                            value: investmentPlan ? investmentPlan.max_amount : 0,
                            message: `Maximum amount is ${formatAmountNoDecimal(
                                investmentPlan ? investmentPlan.max_amount : 0,
                            )}`,
                        },
                        pattern: {
                            value: /[0-9]/,
                        },
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(proceedWithInvestment)}
                    disabled={!isValid}
                />
            )}

            {paymentModal && (
                <PaymentModal
                    isOpen={paymentModal}
                    headText="Make Investment"
                    closeModal={() => {
                        setPaymentModal(false);
                        setNewInvestmentModal(false);
                    }}
                    amount={investment.investment_amount}
                    amountText="Amount to invest"
                    accountName="LENDHA TECHNOLOGY LIMITED"
                    accountNumber="1423100667"
                    bankName="ACCESS BANK"
                    receiptTo="invest@lendha.com"
                    config={paystackConfig}
                />
            )}
        </>
    );
}

export default UserInvestmentsPage;
