import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Alert from '../../../../components/alert/alert';
import Loader from '../../../../components/loader/loader';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import { formatDateToString, formatNumber } from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import { getReferrals } from '../../../../store/referrals/referralsSlice';

import './referrals.scss';

import { invalidateUser } from '../../../../components/utils/auth';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

const AdminReferralsPage = () => {
    const [,] = useDocumentTitle('Lendha | Admin - Referrals');

    const dispatch = useDispatch();
    const { isFetching, alert } = useSelector((state) => state.componentsSlice);
    const { referrals } = useSelector((state) => state.referralsSlice);
    const notification = alert;

    useEffect(() => {
        const abortController = new AbortController();
        dispatch(getReferrals());

        return function cleanup() {
            dispatch(closeAlert());
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <div className="admin_referrals_page">
                <div className="requests_div">
                    <SubSectionHeader headText={`Referrals (${formatNumber(referrals?.length) || 0})`} rule />

                    <Table
                        headers={['ID', 'Referral ID', 'Referral email', 'Created at']}
                        noTableData={!isFetching && (!referrals || referrals?.length === 0)}
                    >
                        {referrals?.map((item, i) => (
                            <tr key={i}>
                                <td>{item.id || '-'}</td>
                                <td>{item.referrer_id || '-'}</td>
                                <td>
                                    <p className="text_wrap">{item.referrer_email || '-'}</p>
                                </td>
                                <td>{formatDateToString(item.created_at)}</td>
                            </tr>
                        ))}

                        {isFetching && !referrals && (
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

export default AdminReferralsPage;
