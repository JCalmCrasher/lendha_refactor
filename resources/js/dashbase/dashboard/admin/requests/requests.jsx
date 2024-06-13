/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';

import { CSVLink } from 'react-csv';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Alert from '../../../../components/alert/alert';
import Dropdown from '../../../../components/dropdown/dropdown';
import { FilterGridForm } from '../../../../components/filter/filter';
import FormInput from '../../../../components/form-input/form-input';
import FormSelect from '../../../../components/form-select/form-select';
import Loader from '../../../../components/loader/loader';
import AutoDenyModal from '../../../../components/modal/auto-deny-modal';
import EditLoanInterestModal from '../../../../components/modal/edit-loan-interest-modal';
import LoanInterestModal from '../../../../components/modal/loan-interest-modal';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import {
    dateInISO,
    exportFileAsExcel,
    formatAmount,
    formatAutoDenyDate,
    formatDateToString,
    formatNumber,
    isEmpty,
    statusStyling,
    successStatusCode,
} from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import {
    getAdminLoanRequests,
    getLoanPurposes,
    getSearchLoans,
    postAutoDenyLoans,
    postNewLoanInterest,
    postUpdateLoanInterest,
} from '../../../../store/loan/loanSlice';

import './requests.scss';

import { invalidateUser } from '../../../../components/utils/auth';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

function AdminRequestsPage() {
    const loanRequestCSVData = [];
    const [,] = useDocumentTitle('Lendha | Admin - Requests');

    const exportToExcel = () => {
        exportFileAsExcel('loan-requests', 'Loan Requests Sheet 1', 'Loan Requests');
    };
    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { loanPurposes, adminLoanRequests } = useSelector((state) => state.loanSlice);

    adminLoanRequests?.data?.forEach((loanRequest) => {
        loanRequestCSVData.push({
            ID: loanRequest?.application_id,
            Status: loanRequest?.status,
            Profile: loanRequest?.user?.profile_status,
            'User ID': loanRequest?.user_id,
            'Mer. code': loanRequest?.merchant_id,
            'Full name': loanRequest?.user?.name,
            Email: loanRequest?.user?.email,
            Phone: loanRequest?.user?.phone_number,
            'Loan amount': formatAmount(loanRequest?.amount),
            'Request data': formatDateToString(loanRequest?.request_date),
        });
    });

    const isSubmitting = isLoading;
    const notification = alert;
    const [showCustomDateFilter, setShowCustomDateFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageChangeTracker, setCurrentPageChangeTracker] = useState(0);
    const [loanInterest, setLoanInterest] = useState(null);
    const [loanInterestModal, setLoanInterestModal] = useState(false);
    const [editLoanInterestModal, setEditLoanInterestModal] = useState(false);
    const [autoDenyModal, setAutoDenyModal] = useState(false);
    const { register, handleSubmit, watch, errors, reset } = useForm();
    const { register: register1, errors: errors1, handleSubmit: handleSubmit1 } = useForm();

    const getLoanRequests = () => {
        dispatch(getAdminLoanRequests({ page: currentPage }));
    };

    useEffect(() => {
        const abortController = new AbortController();
        getLoanRequests();
        dispatch(getLoanPurposes());

        return function cleanup() {
            abortController.abort();
        };
    }, []);

    const page = currentPage;
    const searchTerm = watch('email', '');
    const status = watch('status', '');
    const start_date = watch('start_date', '');
    const end_date = watch('end_date', '');
    const date_filter = watch('date_filter', '');

    useEffect(() => {
        if (date_filter === 'custom') {
            setShowCustomDateFilter(true);
        } else {
            setShowCustomDateFilter(false);
        }
    }, [date_filter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, status]);

    const searchLoanRequests = (data) => {
        dispatch(getSearchLoans(data));
    };

    const filterForm = () => {
        let startDate;
        let endDate;

        if (isEmpty(start_date)) {
            startDate = undefined;
        } else {
            startDate = dateInISO(start_date);
        }

        if (isEmpty(end_date)) {
            endDate = undefined;
        } else {
            endDate = dateInISO(end_date);
        }

        // if (isEmpty(start_date) || isEmpty(end_date)) {
        //   const nowStartDate = new Date();
        //     startDate = dateInISO(
        //         nowStartDate.setDate(nowStartDate.getDate() - 7)
        //     );
        //   endDate = dateInISO(new Date());
        // } else {
        //     startDate = dateInISO(start_date);
        //     endDate = dateInISO(end_date);
        // }

        searchLoanRequests({
            page,
            searchTerm,
            status,
            startDate,
            endDate,
            date_filter,
        });
    };

    const changeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        const pageWithOffset = offset + 1;
        setCurrentPage(pageWithOffset);
        setCurrentPageChangeTracker(pageWithOffset);
    };
    useEffect(() => {
        if (searchTerm !== '' || status !== '') {
            filterForm();
        } else {
            getLoanRequests();
        }
    }, [currentPageChangeTracker]);

    const submitNewLoanInterest = (data) => {
        dispatch(postNewLoanInterest(data)).then((res) => {
            if (res?.status === successStatusCode) {
                setLoanInterestModal(false);
                dispatch(getLoanPurposes());
            }
        });
    };

    const submitEditLoanInterest = (data) => {
        const id = { id: loanInterest.id };

        const loanData = Object.assign(id, data);
        dispatch(postUpdateLoanInterest(loanData)).then((res) => {
            if (res?.status === successStatusCode) {
                setEditLoanInterestModal(false);
                dispatch(getLoanPurposes());
            }
        });
    };

    const submitAutoDenyRequests = (data) => {
        const autoDenyData = {
            dates: [formatAutoDenyDate(data.from_date), formatAutoDenyDate(data.to_date)],
        };

        dispatch(postAutoDenyLoans(autoDenyData)).then((res) => {
            if (res?.status === successStatusCode) {
                setAutoDenyModal(false);
                getLoanRequests();
            }
        });
    };

    return (
        <>
            <div className="admin_requests_page">
                <div className="requests_div">
                    <SubSectionHeader
                        headText={`Loan Requests (${formatNumber(adminLoanRequests?.total) || 0})`}
                        rule
                    />

                    <Dropdown>
                        <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                                setLoanInterestModal(true);
                                dispatch(closeAlert());
                            }}
                        >
                            New loan interest
                        </button>
                        <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                                setAutoDenyModal(true);
                                dispatch(closeAlert());
                            }}
                        >
                            Auto-deny applications
                        </button>
                    </Dropdown>

                    <FilterGridForm onSubmit={handleSubmit(filterForm)} loading={isFetching} onClear={() => reset()}>
                        <div className="d-flex">
                            <FormInput
                                name="email"
                                type="email"
                                placeholder="Email address"
                                inputRef={register('email', {
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                readOnly={isSubmitting}
                                error={errors?.email}
                                errorMessage={errors?.email && errors?.email.message}
                            />
                            <FormSelect
                                name="status"
                                placeholder="Status"
                                selectRef={register('status')}
                                options={[
                                    { name: 'All', value: '' },
                                    { name: 'Pending', value: 'pending' },
                                    { name: 'Approved', value: 'approved' },
                                    { name: 'Completed', value: 'completed' },
                                    { name: 'Denied', value: 'denied' },
                                ]}
                                readOnly={isSubmitting}
                                error={errors?.status}
                                errorMessage={errors?.status && errors?.status.message}
                            />
                        </div>
                        <div className="d-flex">
                            {showCustomDateFilter && (
                                <>
                                    <FormInput
                                        label="Start date"
                                        name="start_date"
                                        type="date"
                                        inputRef={register('start_date')}
                                        readOnly={isSubmitting}
                                        error={errors?.start_date}
                                        errorMessage={errors?.start_date && errors?.start_date.message}
                                        className="mr-3"
                                    />
                                    <FormInput
                                        label="End date"
                                        name="end_date"
                                        type="date"
                                        inputRef={register('end_date')}
                                        readOnly={isSubmitting}
                                        error={errors?.end_date}
                                        errorMessage={errors?.end_date && errors?.end_date.message}
                                        className="mr-3"
                                    />
                                </>
                            )}
                            <FormSelect
                                label="Date filter"
                                id="date-filter"
                                title="Filter by"
                                name="date_filter"
                                value="custom"
                                selectRef={register('date_filter', {
                                    required: 'Date filter is required',
                                })}
                                sx={{ gridColumn: '1 / span 2' }}
                                options={[
                                    { name: 'Today', value: 'today' },
                                    { name: 'Yesterday', value: 'yesterday' },
                                    { name: 'This week', value: 'this week' },
                                    { name: 'This month', value: 'this month' },
                                    {
                                        name: 'This quarter',
                                        value: 'this quarter',
                                    },
                                    { name: 'This year', value: 'this year' },
                                    {
                                        name: 'Custom',
                                        value: 'custom',
                                        selected: true,
                                    },
                                ]}
                                readOnly={isSubmitting}
                                error={errors?.date_filter}
                                errorMessage={errors?.date_filter && errors?.date_filter.message}
                            />
                        </div>

                        <div className="d-flex action">
                            <button
                                className="btn_blue"
                                onClick={exportToExcel}
                                type="button"
                                disabled={isFetching || adminLoanRequests?.data?.length < 1}
                            >
                                Export as Excel
                            </button>
                            <CSVLink filename="loan-request.csv" data={loanRequestCSVData}>
                                <button
                                    className="btn_blue"
                                    type="button"
                                    disabled={isFetching || adminLoanRequests?.data?.length < 1}
                                >
                                    Export as CSV
                                </button>
                            </CSVLink>
                        </div>
                    </FilterGridForm>

                    <Table
                        headers={[
                            'ID',
                            'Status',
                            'Profile',
                            'User ID',
                            'Mer. code',
                            'Full name',
                            'Email',
                            'Phone',
                            'Loan Amount',
                            'Request Date',
                            'Branch',
                        ]}
                        noTableData={adminLoanRequests && Object.values(adminLoanRequests?.data)?.length === 0}
                        pageCount={adminLoanRequests?.last_page}
                        changeData={changeData}
                        id="loan-requests"
                    >
                        {isFetching ? (
                            <tr>
                                <td>
                                    <Loader color="blue" />
                                </td>
                            </tr>
                        ) : (
                            <>
                                {adminLoanRequests &&
                                    Object.values(adminLoanRequests?.data)?.map((loan, i) => (
                                        <tr key={i}>
                                            <td>
                                                <p className="text_wrap">
                                                    <Link to={`/admin/requests/${loan.application_id}?id=${loan.id}`}>
                                                        #{loan.application_id}
                                                    </Link>
                                                </p>
                                            </td>
                                            <td>
                                                <Status type={statusStyling(loan.status)} text={loan.status} />
                                            </td>
                                            <td>
                                                <Status
                                                    type={statusStyling(loan?.user?.profile_status)}
                                                    text={loan?.user?.profile_status}
                                                />
                                            </td>
                                            <td>{loan.user_id}</td>
                                            <td>{loan.merchant_id || '-'}</td>
                                            <td>
                                                <p className="text_wrap">{loan?.user?.name}</p>
                                            </td>
                                            <td>
                                                <p className="text_wrap">{loan?.user?.email}</p>
                                            </td>
                                            <td>{loan?.user?.phone_number}</td>
                                            <td>{formatAmount(loan.amount)}</td>
                                            <td>{formatDateToString(loan.request_date)}</td>
                                            <td>
                                                <p className="text_wrap">
                                                    <Status
                                                        type={statusStyling('active')}
                                                        text={loan?.user?.user_branch || 'N/A'}
                                                    />
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                            </>
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

            {loanInterestModal && (
                <LoanInterestModal
                    isOpen={loanInterestModal}
                    closeModal={() => setLoanInterestModal(false)}
                    interests={loanPurposes}
                    onSelect={(item) => {
                        setLoanInterest(item);
                        setLoanInterestModal(false);
                        setEditLoanInterestModal(true);
                    }}
                    rateRef={register1('interest', {
                        required: 'Loan interest is required',
                        pattern: {
                            value: /[0-9]/,
                        },
                        valueAsNumber: true,
                    })}
                    repaymentRef={register1('moratorium', {
                        required: 'Moratorium is required',
                    })}
                    textRef={register1('purpose', {
                        required: 'Loan purpose is required',
                    })}
                    errors={errors1}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit1(submitNewLoanInterest)}
                />
            )}

            {editLoanInterestModal && (
                <EditLoanInterestModal
                    isOpen={editLoanInterestModal}
                    closeModal={() => setEditLoanInterestModal(false)}
                    purpose={loanInterest.purpose}
                    rateRef={register1('interest', {
                        required: 'Loan interest is required',
                        pattern: {
                            value: /[0-9]/,
                        },
                        valueAsNumber: true,
                    })}
                    errors={errors1}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit1(submitEditLoanInterest)}
                />
            )}

            {autoDenyModal && (
                <AutoDenyModal
                    isOpen={autoDenyModal}
                    closeModal={() => setAutoDenyModal(false)}
                    startDateRef={register1('from_date', {
                        required: 'This field is required',
                        valueAsDate: true,
                    })}
                    endDateRef={register1('to_date', {
                        required: 'This field is required',
                        valueAsDate: true,
                    })}
                    errors={errors1}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit1(submitAutoDenyRequests)}
                />
            )}
        </>
    );
}

export default AdminRequestsPage;
