import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Alert from '../../../../components/alert/alert';
import Loader from '../../../../components/loader/loader';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import { formatDateToString, formatNumber } from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import { getMerchants } from '../../../../store/merchants/merchantsSlice';

import './merchants.scss';

import { invalidateUser } from '../../../../components/utils/auth';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

const AdminMerchantsPage = () => {
    const [,] = useDocumentTitle('Lendha | Admin - Merchants');

    const dispatch = useDispatch();
    const { isFetching, alert } = useSelector((state) => state.componentsSlice);
    const { merchants } = useSelector((state) => state.merchantsSlice);
    const notification = alert;

    useEffect(() => {
        const abortController = new AbortController();
        dispatch(getMerchants());

        return function cleanup() {
            abortController.abort();
            dispatch(closeAlert());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <div className="admin_merchants_page">
                <div className="requests_div">
                    <SubSectionHeader headText={`Merchants (${formatNumber(merchants?.length) || 0})`} rule />

                    <Table
                        headers={['ID', 'Name', "User's ID", 'Code', 'Created at']}
                        noTableData={!isFetching && (!merchants || merchants?.length === 0)}
                    >
                        {merchants?.map((item, i) => (
                            <tr key={i}>
                                <td>{item.id || '-'}</td>
                                <td>
                                    <p className="text_wrap">{item.name || '-'}</p>
                                </td>
                                <td>{item.users_id || '-'}</td>
                                <td>{item.code || '-'}</td>
                                <td>{formatDateToString(item.created_at)}</td>
                            </tr>
                        ))}

                        {isFetching && !merchants && (
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
        </React.Fragment>
    );
};

export default AdminMerchantsPage;
