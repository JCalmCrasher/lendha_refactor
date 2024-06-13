import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Alert from '../../../../components/alert/alert';
import Spinner from '../../../../components/spinner/spinner';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import { formatAmount, formatDateToString, statusStyling } from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import { getMerchantLoans } from '../../../../store/merchants/merchantsSlice';

import './dashboard.scss';

import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

const MerchantDashboardPage = () => {
    const [,] = useDocumentTitle('Lendha | Merchant - Dashboard');

    const dispatch = useDispatch();
    const { isFetching, alert } = useSelector((state) => state.componentsSlice);
    const { merchantLoans } = useSelector((state) => state.merchantsSlice);
    const notification = alert;

    useEffect(() => {
        dispatch(getMerchantLoans());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            {isFetching && <Spinner />}

            <div className="section dashbase merchants_page">
                <div className="recent_loans_div">
                    <SubSectionHeader headText={`Loans (${merchantLoans?.length || 0})`} rule />

                    <Table
                        headers={['ID', 'Status', 'Profile', 'Name', 'Email', 'Phone', 'Loan amount', 'Request date']}
                        noTableData={!merchantLoans || merchantLoans?.length === 0}
                    >
                        {merchantLoans?.map((item, i) => (
                            <tr key={i}>
                                <td>
                                    <p className="text_wrap">#{item.application_id}</p>
                                </td>
                                <td>
                                    <Status type={statusStyling(item.status)} text={item.status} />
                                </td>
                                <td>
                                    <Status
                                        type={statusStyling(item?.user?.profile_status)}
                                        text={item?.user?.profile_status}
                                    />
                                </td>
                                <td>
                                    <p className="text_wrap">{item?.user?.name}</p>
                                </td>
                                <td>
                                    <p className="text_wrap">{item?.user?.email}</p>
                                </td>
                                <td>{item?.user?.phone_number}</td>
                                <td>{formatAmount(item.amount)}</td>
                                <td>{formatDateToString(item.request_date)}</td>
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
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}
        </React.Fragment>
    );
};

export default MerchantDashboardPage;
