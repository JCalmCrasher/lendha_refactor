import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';

import './branch.scss';

import Spinner from '../../../../components/spinner/spinner';
import { sluggify } from '../../../../components/utils/helper';
import { getBranches, setCreditOfficer } from '../../../../store/branch/branchSlice';

const headers = ['Name', 'Region', 'Phone number', 'Email'];

function AdminBranchPage() {
    const dispatch = useDispatch();
    const { branches } = useSelector((state) => state.branchSlice);
    const { isFetching } = useSelector((state) => state.componentsSlice);

    useEffect(() => {
        dispatch(getBranches());
    }, [dispatch]);

    return (
        <>
            {isFetching && <Spinner />}
            <div className="admin_branch_page">
                <div className="branch_div">
                    <SubSectionHeader headText="Branch" rule />

                    <ul className="nav nav-tabs" id="branch-tab" role="tablist">
                        {(branches?.data || []).map((b, i) => (
                            <li className="nav-item" role="presentation" key={b.id}>
                                <button
                                    className={`nav-link ${i === 0 ? 'active' : ''}`}
                                    id={`nav-link${i}`}
                                    data-bs-toggle="tab"
                                    data-bs-target={`#${sluggify(b.name)}-tab-pane`}
                                    type="button"
                                    role="tab"
                                    aria-controls={`${sluggify(b.name)}-tab-pane`}
                                    aria-selected="true"
                                >
                                    {b?.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="tab-content" id="branch-tab-content" style={{ marginTop: '32px' }}>
                        {(branches?.data || []).map((b, i) => (
                            <div
                                key={b.id}
                                className={`tab-pane fade ${i === 0 ? 'active show' : ''}`}
                                id={`${sluggify(b?.name)}-tab-pane`}
                                role="tabpanel"
                                aria-labelledby={`${sluggify(b?.name)}-tab`}
                                tabIndex="1"
                            >
                                <Table
                                    headers={headers}
                                    noTableData={(b?.officers || []).length === 0}
                                    // pageCount={branches?.last_page}
                                    // changeData={changeData}
                                >
                                    {(b?.officers || []).map((officer) => (
                                        <tr key={officer.id}>
                                            <td>
                                                <Link to={`/admin/branch/${b?.id}/officer/${officer?.id}`}>
                                                    {officer?.name || 'N/A'}
                                                </Link>
                                            </td>
                                            <td>{officer?.name || 'N/A'}</td>
                                            <td>{officer?.phone_number || 'N/A'}</td>
                                            <td>{officer?.email || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </Table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminBranchPage;
