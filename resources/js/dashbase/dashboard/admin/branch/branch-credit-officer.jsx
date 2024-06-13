import React, { useEffect, useState } from 'react';

// import ProfileIcon from "../../../../assets/icons/profile.icon";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import OverviewInfo from '../../../../components/overview-info/overview-info';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';

import './branch.scss';

import Alert from '../../../../components/alert/alert';
import Spinner from '../../../../components/spinner/spinner';
import { getOfficerPerformance } from '../../../../store/branch/branchSlice';
import { closeAlert } from '../../../../store/components/componentsSlice';

function BranchCreditOfficer() {
    const [currentPage, setCurrentPage] = useState(1);
    const [performanceCurrentPage, setPerformanceCurrentPage] = useState(1);

    const dispatch = useDispatch();

    const { performance: creditOfficer } = useSelector((state) => state.branchSlice);
    const onboardedCustomers = creditOfficer?.onboarded_users || [];

    const { isFetching, isLoading: isSubmitting, alert: notification } = useSelector((state) => state.componentsSlice);

    const performances = creditOfficer?.performance || [];

    const { id, officer_id } = useParams();

    const changeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        const page = offset + 1;

        setCurrentPage(page);
    };

    const performanceChangeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        const page = offset + 1;

        setPerformanceCurrentPage(page);
    };

    useEffect(() => {
        dispatch(getOfficerPerformance({ branch_id: id, officer_id }));
    }, []);

    return (
        <>
            {isFetching && <Spinner />}
            <div className="admin_branch_page">
                <div className="branch_div" style={{ marginBottom: '36px' }}>
                    <Link to="/admin/branch" style={{ color: '#5F5F5F' }}>
                        <i className="fa fa-arrow-left" style={{ marginRight: '20px' }} aria-hidden="true" />
                        Back to branches
                    </Link>
                </div>
                <SubSectionHeader
                    headText="Credit Officer Profile"
                    className="mt-4"
                    // action={
                    //     <button className="button_component btn_blue d-flex align-items-center">
                    //         <ProfileIcon />
                    //         <span className="pl-2">View profile info</span>
                    //     </button>
                    // }
                    rule
                />
                <div className="branch_div">
                    {/* <OverviewInfo
                        imageUrl="n/a"
                        imageWidth={100}
                        subTextSpan="Business Images"
                    /> */}
                    <OverviewInfo shouldImageFallback subTextSpan="" sx={{ border: 0 }} />
                </div>
                <div className="section_div" style={{ marginBottom: '74px' }}>
                    <OverviewInfo headText={creditOfficer?.name || 'N/A'} subTextSpan="Full name" />
                    <OverviewInfo headText={creditOfficer?.email || 'N/A'} subTextSpan="Email address" />
                    <OverviewInfo headText={creditOfficer?.phone_number || 'N/A'} subTextSpan="Phone number" />
                    <OverviewInfo headText={creditOfficer?.user_branch || 'N/A'} subTextSpan="Region" />
                </div>

                <SubSectionHeader headText="Customers onboarded" rule />

                <div>
                    <Table
                        headers={['Position', 'Name', 'Email', 'Phone number', 'Profile Status', 'Role']}
                        noTableData={(onboardedCustomers || []).length === 0}
                        pageCount={performances?.meta?.last_page || 1}
                        changeData={changeData}
                    >
                        {onboardedCustomers.map((p) => (
                            <tr key={p?.id}>
                                <td>{p?.id || 'N/A'}</td>
                                <td>{p?.name || 'N/A'}</td>
                                <td>{p?.email || 'N/A'}</td>
                                <td>{p?.phone_number || 'N/A'}</td>
                                <td>{p?.profile_status || 'N/A'}</td>
                                <td>{p?.type || 'N/A'}</td>
                            </tr>
                        ))}
                    </Table>
                </div>

                <div className="branch_div">
                    <SubSectionHeader headText="Performance" rule />
                    <div>
                        <Table
                            headers={['ID', 'Name', 'Clients', 'Amount disbursed', 'Due payment paid']}
                            noTableData={(performances || []).length === 0}
                            pageCount={performances?.meta?.last_page || 1}
                            changeData={performanceChangeData}
                        >
                            {performances.map((p) => (
                                <tr key={p?.id}>
                                    <td>{p?.id ?? 'N/A'}</td>
                                    <td>{p?.officer ?? 'N/A'}</td>
                                    <td>{p?.client ?? 'N/A'}</td>
                                    <td>{p?.amount_disbursed ?? 'N/A'}</td>
                                    <td>{p?.due_payment_paid ?? 'N/A'}</td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                </div>
            </div>

            {/* Other components */}
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={notification.message || 'Succesful'}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}
        </>
    );
}

export default BranchCreditOfficer;
