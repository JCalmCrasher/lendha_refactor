import React, { useEffect, useState } from 'react';

import './performance.scss';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as k } from 'uuid';

import Filter from '../../../../components/filter/filter';
import FormInput from '../../../../components/form-input/form-input';
import FormSelect from '../../../../components/form-select/form-select';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import { extractBranches } from '../../../../components/utils/helper';
import { getBranches } from '../../../../store/branch/branchSlice';

function AdminPerformancePage() {
    const [currentPage, setCurrentPage] = useState(1);

    const { register, handleSubmit, watch, errors } = useForm();
    const { isFetching, isLoading: isSubmitting, alert: notification } = useSelector((state) => state.componentsSlice);

    const { branches: branchResponse } = useSelector((state) => state.branchSlice);
    const dispatch = useDispatch();

    const [branches, officers] = extractBranches(branchResponse?.data || []);

    const filterForm = () => {
        // console.log('Filter form');
    };

    const changeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        const page = offset + 1;

        setCurrentPage(page);
    };

    const performances = [];

    useEffect(() => {
        dispatch(getBranches());
    }, [dispatch]);

    return (
        <div className="admin_performance_page">
            <div className="performance_div">
                <SubSectionHeader headText="Performance" rule />

                <Filter whiteSpace onSubmit={handleSubmit(filterForm)} loading={isFetching}>
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
                            groupSx={{ marginLeft: '24px' }}
                        />
                    </div>
                </Filter>

                <Table
                    headers={['Position', 'Name', 'Clients', 'Amount disbursed', 'Due payment paid']}
                    noTableData={(performances || []).length === 0}
                    pageCount={performances?.meta?.last_page || 1}
                    changeData={changeData}
                >
                    {(performances?.data || []).map((p) => (
                        <tr key={k()}>
                            <td>{p?.position || 'N/A'}</td>
                            <td>{p?.name || 'N/A'}</td>
                            <td>{p?.client || 'N/A'}</td>
                            <td>{p?.amount || 'N/A'}</td>
                            <td>{p?.due_payment || 'N/A'}</td>
                        </tr>
                    ))}
                </Table>
            </div>
        </div>
    );
}

export default AdminPerformancePage;
