/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'reactstrap';
import { v4 as key } from 'uuid';

import Alert from '../../../../components/alert/alert';
import Loader from '../../../../components/loader/loader';
import OverviewInfo from '../../../../components/overview-info/overview-info';
import Spinner from '../../../../components/spinner/spinner';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import { formatAmount, formatDateToString, formatNumber, statusStyling } from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import { getAdminDashboardDetails, setShowPrivacyPolicy } from '../../../../store/user/userSlice';

import './dashboard.scss';

// import Button from "../../../../components/button/button";

import FormContainer from '../../../../components/form-container/form-container';
import { invalidateUser } from '../../../../components/utils/auth';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

import '../../../../components/modal/privacy-modal.scss';

function AdminDashboardPage() {
    const [,] = useDocumentTitle('Lendha | Admin - Dashboard');

    const dispatch = useDispatch();
    const { isFetching, alert } = useSelector((state) => state.componentsSlice);
    const { adminDashboardDetails } = useSelector((state) => state.userSlice);
    const { privacyPolicy: shouldShowPrivacyPolicy } = useSelector((state) => state.userSlice);
    const notification = alert;

    useEffect(() => {
        const abortController = new AbortController();
        dispatch(getAdminDashboardDetails());

        return function cleanup() {
            abortController.abort();
        };
    }, []);

    return (
        <>
            {isFetching && <Spinner />}

            <div className="admin_dasboard_page">
                <div className="overview_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Overview" rule />
                    </div>
                    <div className="info_div">
                        <OverviewInfo
                            headText={formatNumber(adminDashboardDetails?.today_loan_request)}
                            subTextSpan="Today's loan request"
                        />
                        <OverviewInfo
                            headText={formatNumber(adminDashboardDetails?.week_loan_request)}
                            subTextSpan="This week's loan request"
                        />
                        <OverviewInfo
                            headText={formatNumber(adminDashboardDetails?.month_loan_request)}
                            subTextSpan="This month's loan request"
                        />
                        <OverviewInfo
                            headText={formatNumber(adminDashboardDetails?.total_loan_request)}
                            subTextSpan="Total loan request"
                        />
                    </div>
                </div>

                <div className="recent_requests_div">
                    <SubSectionHeader headText="Recent Loan Requests" rule />

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
                            'Loan amount',
                            'Request date',
                            'Branch',
                        ]}
                        noTableData={
                            adminDashboardDetails && Object.values(adminDashboardDetails?.loan_requests)?.length === 0
                        }
                    >
                        {isFetching ? (
                            <tr>
                                <td>
                                    <Loader color="blue" />
                                </td>
                            </tr>
                        ) : (
                            <>
                                {adminDashboardDetails &&
                                    Object.values(adminDashboardDetails?.loan_requests)?.map((loan, i) => (
                                        <tr key={key()}>
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
                                            <td>{loan?.user?.id}</td>
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
                    closeAlert={() => dispatch(closeAlert(null))}
                />
            )}

            <Modal className="privacy_modal" isOpen={shouldShowPrivacyPolicy} centered>
                <FormContainer
                    headText={<p style={{ textAlign: 'center' }}>NOTICE !!!</p>}
                    close={() => dispatch(setShowPrivacyPolicy(false))}
                    rule={false}
                >
                    <p className="text-center text-gray-300 mb-4">
                        Our privacy policy describes our process and procedure in safely guiding the information of
                        customers.
                        <br />
                        Every Lendha staff is expected to abide by it. <br /> Any staff found to misuse customers&apos;
                        information will be prosecuted by law.
                    </p>
                    <div className="actions" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            className="btn_blue"
                            onClick={() => dispatch(setShowPrivacyPolicy(false))}
                            type="button"
                        >
                            Ok
                        </Button>
                    </div>
                </FormContainer>
            </Modal>
        </>
    );
}

export default AdminDashboardPage;
