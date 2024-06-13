import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import CopyToClipboard from '../../../../components/copy-to-clipboard';
import Loader from '../../../../components/loader/loader';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import { formatDateToString } from '../../../../components/utils/helper';
import { getPaymentAccount, getPaymentReceipts } from '../../../../store/user/userSlice';

import '../request-info/request-info.scss';

import ReceiptUploader from './components/ReceiptUploader';

const AdminPaymentsPage = () => {
    const loanId = new URLSearchParams(useLocation().search).get('loan_id');
    const userId = new URLSearchParams(useLocation().search).get('user_id');

    let history = useNavigate();

    const dispatch = useDispatch();

    const { paymentReceipts, paymentAccount, user } = useSelector((state) => state.userSlice);
    const paymentAccountLength = Object.keys(paymentAccount);

    const accountNumber = paymentAccount?.account_number || 'N/A';

    const { adminLoanDetails } = useSelector((state) => state.loanSlice);
    const { isFetching } = useSelector((state) => state.componentsSlice);

    useEffect(() => {
        dispatch(
            getPaymentReceipts({
                id: loanId,
            }),
        );
        dispatch(getPaymentAccount(userId));
    }, [dispatch, loanId, userId]);

    const userRole = user.user_type_id;
    const isAdmin = userRole === 2 || userRole === 3;

    return (
        <div style={{ marginTop: '50px' }}>
            <div className="section_div">
                <div
                    className="d-inline-flex align-items-center"
                    style={{
                        cursor: 'pointer',
                        gap: '16px',
                    }}
                    onClick={() => history(-1)}
                >
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    <span>Back</span>
                </div>

                {/* Payment Account */}
                <div className="section_div" style={{ margin: '27px 0' }}>
                    <SubSectionHeader headText="Payment account" rule />
                    <Table
                        headers={['Account name', 'Account number', 'Bank name', 'Account balance']}
                        id="payment-history"
                        noTableData={paymentAccountLength.length === 0}
                    >
                        {isFetching ? (
                            <tr>
                                <td>
                                    <Loader color="blue" />
                                </td>
                            </tr>
                        ) : (
                            paymentAccountLength.length >= 1 && (
                                <tr>
                                    <td>{paymentAccount?.account_name || 'N/A'}</td>
                                    <td style={{ fontFamily: 'Enriqueta' }}>
                                        <div className="d-flex">
                                            <span>{accountNumber}</span>
                                            <CopyToClipboard text={accountNumber} />
                                        </div>
                                    </td>
                                    <td>{paymentAccount?.bank_name || 'N/A'}</td>
                                    <td>N/A</td>
                                </tr>
                            )
                        )}
                    </Table>
                </div>

                {/* Payment history */}
                <div className="section_div" style={{ margin: '27px 0' }}>
                    <SubSectionHeader
                        action={
                            isAdmin && (
                                <ReceiptUploader loan_id={loanId} amount={adminLoanDetails?.loan_details?.amount} />
                            )
                        }
                        headText="Payment history"
                        rule
                    />
                    <Table
                        headers={['Date', 'Amount', 'Receipt']}
                        noTableData={paymentReceipts && Object.values(paymentReceipts || [])?.length === 0}
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
                                {paymentReceipts?.length ? (
                                    paymentReceipts?.map((receipt, i) => (
                                        <tr key={i}>
                                            <td>{formatDateToString(receipt?.created_at)}</td>
                                            <td>{receipt?.amount}</td>
                                            <td>
                                                <p className="text_wrap">
                                                    <a
                                                        href={process.env.MIX_API_URL + receipt?.document}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {receipt?.document}
                                                    </a>
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">
                                            <p className="text-center">No payment history</p>
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentsPage;
