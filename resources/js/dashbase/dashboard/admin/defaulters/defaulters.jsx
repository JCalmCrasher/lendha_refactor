import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Alert from '../../../../components/alert/alert';
import Loader from '../../../../components/loader/loader';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import { formatAmount, formatNumber } from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import { getDefaulters } from '../../../../store/defaulters/defaultersSlice';

import './defaulters.scss';

import { invalidateUser } from '../../../../components/utils/auth';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

const AdminDefaultersPage = () => {
    const [,] = useDocumentTitle('Lendha | Admin - Defaulters');

    const dispatch = useDispatch();
    const { isFetching, alert } = useSelector((state) => state.componentsSlice);
    const { defaulters } = useSelector((state) => state.defaultersSlice);
    const notification = alert;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const abortController = new AbortController();
        getAllDefaulters();

        return function cleanup() {
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllDefaulters = async (page) => {
        dispatch(getDefaulters({ page: currentPage }));
    };

    const changeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        let page = offset + 1;
        // setLoans(null);
        setCurrentPage(page);
    };
    useEffect(() => {
        getAllDefaulters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        <React.Fragment>
            <div className="admin_defaulters_page">
                <div className="requests_div">
                    <SubSectionHeader headText={`Defaulters (${formatNumber(defaulters?.total) || 0})`} rule />

                    <Table
                        headers={['Name', 'Email', 'Application ID', 'Owed amount']}
                        noTableData={!isFetching && (!defaulters || defaulters?.length === 0)}
                        pageCount={defaulters?.last_page}
                        changeData={changeData}
                    >
                        {isFetching ? (
                            <tr>
                                <td>
                                    <Loader color="blue" />
                                </td>
                            </tr>
                        ) : (
                            <>
                                {defaulters?.data?.map((item, i) => (
                                    <tr key={i}>
                                        <td>
                                            <p className="text_wrap">
                                                {item.loan_detail ? item.loan_detail.user.name : '-'}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="text_wrap">
                                                {item.loan_detail ? item.loan_detail.user.email : '-'}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="text_wrap">
                                                #{item.loan_detail ? item.loan_detail.application_id : '-'}
                                            </p>
                                        </td>
                                        <td>{formatAmount(item.owed_amount)}</td>
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
        </React.Fragment>
    );
};

export default AdminDefaultersPage;
