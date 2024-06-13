import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as key } from 'uuid';

import Alert from '../../../../components/alert/alert';
import Dropdown from '../../../../components/dropdown/dropdown';
import Loader from '../../../../components/loader/loader';
import InvestmentPackageModal from '../../../../components/modal/investment-package-modal';
import NewAdminInvestmentModal from '../../../../components/modal/new-admin-investment-modal';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import {
    formatAmount,
    formatAmountNoDecimal,
    formatDateToString,
    formatNumber,
    statusStyling,
    successStatusCode,
} from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import {
    getAdminInvestors,
    getInvestmentPlans,
    postAdminNewInvestmentPackage,
    postAdminNewInvestor,
} from '../../../../store/investment/investmentSlice';

import './investments.scss';

import { invalidateUser } from '../../../../components/utils/auth';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

function AdminInvestmentsPage() {
    const [,] = useDocumentTitle('Lendha | Admin - Investments');

    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { investment_plans, adminInvestors } = useSelector((state) => state.investmentSlice);
    const isSubmitting = isLoading;
    const notification = alert;
    const [newInvestmentPackageModal, setNewInvestmentPackageModal] = useState(false);
    const [newUserInvestmentModal, setNewUserInvestmentModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const abortController = new AbortController();
        dispatch(getInvestmentPlans());
        dispatch(getAdminInvestors());

        return function cleanup() {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        dispatch(getInvestmentPlans());
        dispatch(getAdminInvestors());

        return function cleanup() {
            abortController.abort();
        };
    }, []);

    const submitNewInvestmentPackage = (data) => {
        dispatch(postAdminNewInvestmentPackage(data)).then((res) => {
            if (res?.status === successStatusCode) {
                setNewInvestmentPackageModal(false);
                dispatch(getInvestmentPlans());
            }
        });
    };

    const submitNewInvestment = (data) => {
        const plan_id = { investment_plan_id: selectedPackage.id };

        const investmentData = Object.assign(plan_id, data);
        dispatch(postAdminNewInvestor(investmentData)).then((res) => {
            if (res?.status === successStatusCode) {
                setNewUserInvestmentModal(false);
                dispatch(getAdminInvestors());
            }
        });
    };

    return (
        <>
            <div className="admin_investments_page">
                <div className="requests_div">
                    <SubSectionHeader headText={`Investments (${formatNumber(adminInvestors?.length) || 0})`} rule />

                    <Dropdown>
                        <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                                setNewInvestmentPackageModal(true);
                                dispatch(closeAlert());
                            }}
                        >
                            New Investment Package
                        </button>
                        <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                                setSelectedPackage(null);
                                setNewUserInvestmentModal(true);
                                dispatch(closeAlert());
                            }}
                        >
                            New User Investment
                        </button>
                    </Dropdown>

                    <Table
                        headers={[
                            'Name',
                            'Email',
                            'Status',
                            'Amount invested',
                            'Plan ID',
                            'Period',
                            'ROI',
                            'Exp. return',
                            'Date invested',
                            'End of cycle',
                        ]}
                        noTableData={adminInvestors?.data?.length === 0}
                    >
                        {adminInvestors?.map((item, i) => (
                            <tr key={key()}>
                                <td>
                                    <p className="text_wrap">{item.user ? item.user.name : '-'}</p>
                                </td>
                                <td>
                                    <p className="text_wrap">{item.user ? item.user.email : '-'}</p>
                                </td>
                                <td>
                                    <Status type={statusStyling(item.status)} text={item.status} />
                                </td>
                                <td>{formatAmount(item.amount) || '-'}</td>
                                <td>{item.investment_plan_id}</td>
                                <td>{item.plan ? `${item.plan.duration}months` : '-'}</td>
                                <td>{item.plan ? `${item.plan.interest}%` : '-'}</td>
                                <td>{formatAmount(item.returns) || '-'}</td>
                                <td>{formatDateToString(item.created_at)}</td>
                                <td>{formatDateToString(item.end_of_cycle)}</td>
                            </tr>
                        ))}

                        {isFetching && !adminInvestors && (
                            <tr>
                                <td>
                                    <Loader color="blue" />
                                </td>
                            </tr>
                        )}
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
                                Update your password. Click{' '}
                                <a href="/forgot" onClick={() => invalidateUser()}>
                                    here
                                </a>{' '}
                                to change password
                            </span>
                        ) : (
                            notification?.message
                        )
                    }
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}

            {newInvestmentPackageModal && (
                <InvestmentPackageModal
                    isOpen={newInvestmentPackageModal}
                    closeModal={() => setNewInvestmentPackageModal(false)}
                    packages={investment_plans}
                    nameRef={register('name', {
                        required: 'This field is required',
                    })}
                    durationRef={register('duration', {
                        required: 'This field is required',
                    })}
                    interestRef={register('interest', {
                        required: 'This field is required',
                    })}
                    min_amountRef={register('min_amount', {
                        required: 'This field is required',
                        pattern: {
                            value: /[0-9]/,
                        },
                    })}
                    max_amountRef={register('max_amount', {
                        required: 'This field is required',
                        pattern: {
                            value: /[0-9]/,
                        },
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitNewInvestmentPackage)}
                />
            )}

            {newUserInvestmentModal && (
                <NewAdminInvestmentModal
                    isOpen={newUserInvestmentModal}
                    closeModal={() => setNewUserInvestmentModal(false)}
                    investment_plans={investment_plans}
                    onSelect={(item) => setSelectedPackage(item)}
                    selected_plan={selectedPackage}
                    amountRef={register('amount_paid', {
                        required: 'Amount to invest is required',
                        min: {
                            value: selectedPackage ? selectedPackage.min_amount : 0,
                            message: `Minimum amount is ${formatAmountNoDecimal(
                                selectedPackage ? selectedPackage.min_amount : 0,
                            )}`,
                        },
                        max: {
                            value: selectedPackage ? selectedPackage.max_amount : 0,
                            message: `Maximum amount is ${formatAmountNoDecimal(
                                selectedPackage ? selectedPackage.max_amount : 0,
                            )}`,
                        },
                        pattern: {
                            value: /[0-9]/,
                        },
                    })}
                    emailRef={register('email', {
                        required: 'User email address is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitNewInvestment)}
                />
            )}
        </>
    );
}

export default AdminInvestmentsPage;
