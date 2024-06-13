import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as k } from 'uuid';

import Alert from '../../../../components/alert/alert';
import Filter from '../../../../components/filter/filter';
import FormInput from '../../../../components/form-input/form-input';
import FormSelect from '../../../../components/form-select/form-select';
import Spinner from '../../../../components/spinner/spinner';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import {
    dateInISO,
    extractBranches,
    extractBranchOfficers,
    formatAmount,
    isEmpty,
} from '../../../../components/utils/helper';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';
import { closeAlert } from '../../../../store/components/componentsSlice';

import './collection.scss';

import { getBranches } from '../../../../store/branch/branchSlice';
import { searchCollections } from '../../../../store/collection/collectionSlice';

function AdminCollectionPage() {
    const [currentPage, setCurrentPage] = useState(1);

    const { register, handleSubmit, watch, errors, reset } = useForm();

    const dispatch = useDispatch();
    const [,] = useDocumentTitle('Lendha | Admin - Collection');

    const { branches: branchResponse } = useSelector((state) => state.branchSlice);
    const [branches] = extractBranches(branchResponse?.data || []);

    const [officers, setOfficers] = useState([]);

    const { filteredCollections } = useSelector((state) => state.collectionSlice);
    const { isFetching, isLoading: isSubmitting, alert: notification } = useSelector((state) => state.componentsSlice);

    useEffect(() => {
        dispatch(getBranches());
    }, [dispatch]);

    const startDate = watch('start_date', '');
    const endDate = watch('end_date', '');
    const officerId = watch('officer_id', '');
    const branchId = watch('branch_id', '');

    const filterForm = () => {
        let start_date = '';
        let end_date = '';
        let officer_id = '';
        let branch_id = '';

        if (!isEmpty(startDate)) {
            start_date = dateInISO(startDate);
        }
        if (!isEmpty(endDate)) {
            end_date = dateInISO(endDate);
        }
        if (!isEmpty(officerId)) {
            officer_id = officerId;
        }
        if (!isEmpty(branchId)) {
            branch_id = branchId;
        }

        const payload = {
            start_date,
            end_date,
            officer_id,
            branch_id,
        };

        dispatch(searchCollections(payload));
    };

    useEffect(() => {
        const id = branchId;

        if (id) {
            const branchOfficers = extractBranchOfficers(branchResponse?.data || [], id);
            setOfficers(branchOfficers);
        }
    }, [branchId]);

    const sx = { marginLeft: '24px' };

    const fetchCollection = async () => {
        dispatch(searchCollections({ page: currentPage }));
    };

    const changeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        const page = offset + 1;

        setCurrentPage(page);
    };
    useEffect(() => {
        fetchCollection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const totalCollection = filteredCollections?.total_collections || 0;
    const prevMonthCollection = filteredCollections?.previous_month_total_collections || 0;
    const collectionsDifference = filteredCollections?.collections_difference || '0%';

    const totalRepayment = filteredCollections?.total_repayments || 0;
    const prevMonthRepayment = filteredCollections?.previous_month_total_repayments || 0;
    const repaymentsDifference = filteredCollections?.repayments_difference || '0%';

    const performance = filteredCollections?.performance || 0;
    const prevMonthPerformance = filteredCollections?.previous_month_performance || 0;
    const performanceDifference = filteredCollections?.performance_difference || '0%';

    return (
        <>
            {isFetching && <Spinner />}
            <div className="admin_collection_page">
                <div className="collection_div">
                    <SubSectionHeader headText="Collection" rule />
                    <div className="mt-4 mb-4">
                        <div className="wrapper">
                            <CollectionStat
                                icon={
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 34 34"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            opacity="0.1"
                                            x="0.617188"
                                            y="0.269531"
                                            width="32.8398"
                                            height="32.8398"
                                            rx="5"
                                            fill="#1A1F4C"
                                        />
                                        <g clipPath="url(#clip0_15716_6842)">
                                            <path
                                                d="M14.9511 16.4884L17.1211 16.4889C19.6064 16.4889 21.6211 18.5036 21.6211 20.9889L14.6201 20.988L14.6211 21.9889L22.6211 21.9881V20.9889C22.6211 19.9064 22.3029 18.8858 21.735 17.9881L24.6211 17.9889C26.6134 17.9889 28.3335 19.1541 29.1372 20.8403C26.7724 23.9609 22.943 25.9889 18.6211 25.9889C15.8598 25.9889 13.5206 25.3983 11.6207 24.3641L11.6221 15.0599C12.8677 15.2383 14.0074 15.7445 14.9511 16.4884ZM9.62109 13.9889C10.1339 13.9889 10.5566 14.3749 10.6144 14.8723L10.6211 14.988V23.9889C10.6211 24.5412 10.1734 24.9889 9.62109 24.9889H7.62109C7.06881 24.9889 6.62109 24.5412 6.62109 23.9889V14.9889C6.62109 14.4366 7.06881 13.9889 7.62109 13.9889H9.62109ZM19.2675 8.56426L19.6208 8.91803L19.9746 8.56426C20.9509 7.58795 22.5339 7.58795 23.5102 8.56426C24.4865 9.54057 24.4865 11.1235 23.5102 12.0998L19.6211 15.9889L15.732 12.0998C14.7557 11.1235 14.7557 9.54057 15.732 8.56426C16.7083 7.58795 18.2912 7.58795 19.2675 8.56426Z"
                                                fill="#1A1F4C"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_15716_6842">
                                                <rect
                                                    width="24"
                                                    height="24"
                                                    fill="white"
                                                    transform="translate(5.61719 4.98828)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                }
                                title="Total collection"
                                value={formatAmount(totalCollection)}
                                percentage={`${collectionsDifference}`}
                                period={`Last month: ${formatAmount(prevMonthCollection)}`}
                            />
                            <CollectionStat
                                icon={
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 34 34"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            opacity="0.1"
                                            x="0.617188"
                                            y="0.269531"
                                            width="32.8398"
                                            height="32.8398"
                                            rx="5"
                                            fill="#1A1F4C"
                                        />
                                        <g clipPath="url(#clip0_15716_6837)">
                                            <path
                                                d="M7.61719 26.9883C7.61719 24.8665 8.46004 22.8317 9.96033 21.3314C11.4606 19.8311 13.4955 18.9883 15.6172 18.9883C17.7389 18.9883 19.7738 19.8311 21.274 21.3314C22.7743 22.8317 23.6172 24.8665 23.6172 26.9883H7.61719ZM15.6172 17.9883C12.3022 17.9883 9.61719 15.3033 9.61719 11.9883C9.61719 8.67328 12.3022 5.98828 15.6172 5.98828C18.9322 5.98828 21.6172 8.67328 21.6172 11.9883C21.6172 15.3033 18.9322 17.9883 15.6172 17.9883ZM22.9802 20.2213C24.5098 20.6144 25.8765 21.4801 26.8855 22.6951C27.8946 23.9101 28.4946 25.4125 28.6002 26.9883H25.6172C25.6172 24.3783 24.6172 22.0023 22.9802 20.2213ZM20.9572 17.9453C21.7952 17.1958 22.4653 16.2776 22.9237 15.251C23.3822 14.2244 23.6185 13.1126 23.6172 11.9883C23.6193 10.6217 23.2698 9.27765 22.6022 8.08528C23.7348 8.31287 24.7537 8.92565 25.4856 9.81948C26.2176 10.7133 26.6174 11.833 26.6172 12.9883C26.6175 13.7007 26.4654 14.405 26.1713 15.054C25.8772 15.7029 25.4477 16.2814 24.9117 16.7508C24.3758 17.2202 23.7457 17.5696 23.0636 17.7756C22.3816 17.9817 21.6634 18.0395 20.9572 17.9453Z"
                                                fill="#1A1F4C"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_15716_6837">
                                                <rect
                                                    width="24"
                                                    height="24"
                                                    fill="white"
                                                    transform="translate(5.61719 4.98828)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                }
                                title="Total Paid"
                                value={formatAmount(totalRepayment)}
                                percentage={`${repaymentsDifference}`}
                                period={`Last month: ₦${prevMonthRepayment}`}
                            />
                            <CollectionStat
                                icon={
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 34 34"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            opacity="0.1"
                                            x="0.585938"
                                            y="0.269531"
                                            width="32.8398"
                                            height="32.8398"
                                            rx="5"
                                            fill="#1A1F4C"
                                        />
                                        <g clipPath="url(#clip0_15716_6825)">
                                            <path
                                                d="M6.78383 13.8666C6.23439 13.6834 6.22913 13.3877 6.79436 13.1993L26.8846 6.50287C27.4414 6.31762 27.7603 6.62918 27.6045 7.1744L21.8638 27.2635C21.706 27.8203 21.3849 27.8393 21.1492 27.3109L17.3663 18.7978L23.6816 10.3773L15.2611 16.6927L6.78383 13.8666Z"
                                                fill="#1A1F4C"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_15716_6825">
                                                <rect
                                                    width="25.2614"
                                                    height="25.2614"
                                                    fill="white"
                                                    transform="translate(4.73438 4.05859)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                }
                                title="Performance"
                                value={performance}
                                percentage={`${performanceDifference}`}
                                period={`Last month: ${prevMonthPerformance}`}
                            />
                        </div>
                    </div>
                    <Filter whiteSpace onSubmit={handleSubmit(filterForm)} loading={isFetching} onClear={() => reset()}>
                        <div
                            className="d-flex"
                            style={{
                                gap: '20px',
                            }}
                        >
                            <FormSelect
                                name="branch_id"
                                label="All Branches"
                                selectRef={register('branch_id')}
                                options={[{ value: '', name: 'Select Branch' }, ...branches]}
                            />
                            <FormSelect
                                name="officer_id"
                                label="All Credit Officers"
                                selectRef={register('officer_id')}
                                options={[{ value: '', name: 'Select Officer' }, ...officers]}
                            />
                        </div>
                        <div className="d-flex mb-4">
                            <FormInput
                                label="Start date"
                                name="start_date"
                                type="date"
                                inputRef={register('start_date')}
                                readOnly={isSubmitting}
                                error={errors?.start_date}
                                errorMessage={errors?.start_date && errors?.start_date.message}
                            />

                            <FormInput
                                label="End date"
                                name="end_date"
                                type="date"
                                inputRef={register('end_date')}
                                readOnly={isSubmitting}
                                error={errors?.end_date}
                                errorMessage={errors?.end_date && errors?.end_date.message}
                                groupSx={sx}
                            />
                        </div>
                    </Filter>
                    <Table
                        headers={['Name', 'Loan type', 'Due payment', 'Due date']}
                        noTableData={(filteredCollections || []).length === 0}
                        pageCount={filteredCollections?.meta?.last_page || 1}
                        changeData={changeData}
                    >
                        {(filteredCollections?.data || []).map((collection) => (
                            <tr key={k()}>
                                <td>{collection?.name || 'N/A'}</td>
                                <td>{collection?.loan_name || 'N/A'}</td>
                                <td>{collection?.intended_payment || 'N/A'}</td>
                                <td>{collection?.due_date || 'N/A'}</td>
                            </tr>
                        ))}
                    </Table>
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

export default AdminCollectionPage;

function CollectionStat({ icon, title, value, percentage, period }) {
    return (
        <>
            <div className="stat" style={{ border: '1px solid #C5C5C5', borderRadius: '10px', padding: '14px 24px' }}>
                {icon}
                <div className="d-flex flex-column" style={{ marginTop: '8px', marginBottom: '10px', gap: '2px' }}>
                    <div className="d-flex align-items-center" style={{ gap: '24px' }}>
                        <h4>{title}</h4>
                        <span
                            style={{
                                background: '#1A1F4C26',
                                borderRadius: '9px',
                                padding: '0 6px',
                                border: '1px solid #1A1F4C26',
                            }}
                        >
                            {percentage}
                        </span>
                    </div>
                    <h1>{value}</h1>
                </div>
                <h5>{period}</h5>
            </div>
        </>
    );
}
