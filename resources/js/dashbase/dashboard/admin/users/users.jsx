/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Alert from '../../../../components/alert/alert';
import Button from '../../../../components/button/button';
import Filter from '../../../../components/filter/filter';
import FormInput from '../../../../components/form-input/form-input';
import FormSelect from '../../../../components/form-select/form-select';
import Loader from '../../../../components/loader/loader';
import ConfirmationModal from '../../../../components/modal/confirmation-modal';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import {
    formatDateToString,
    formatNumber,
    statusStyling,
    successStatusCode,
} from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import {
    getAdminUsers,
    getSearchAdminUsers,
    postAdminDeleteUser,
    postAdminSuspendUser,
} from '../../../../store/user/userSlice';

import './users.scss';

import { invalidateUser } from '../../../../components/utils/auth';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';
import { getBranches } from '../../../../store/branch/branchSlice';

function AdminUsersPage() {
    const [,] = useDocumentTitle('Lendha | Admin - Users');

    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { branches } = useSelector((state) => state.branchSlice);

    const { adminUsers } = useSelector((state) => state.userSlice);
    const isSubmitting = isLoading;
    const notification = alert;
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageChangeTracker, setCurrentPageChangeTracker] = useState(0);
    const [user, setUser] = useState(null);
    const [suspendUserModal, setSuspendUserModal] = useState(false);
    const [unSuspendUserModal, setUnSuspendUserModal] = useState(false);
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const { register, handleSubmit, watch, errors, reset } = useForm();

    const getAllUsers = async (page) => {
        dispatch(getAdminUsers({ page: currentPage }));
    };

    useEffect(() => {
        const abortController = new AbortController();
        getAllUsers();
        dispatch(getBranches());

        return function cleanup() {
            dispatch(closeAlert());
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const page = currentPage;
    const searchTerm = watch('email', '');
    const status = watch('status', '');
    useEffect(() => {
        setCurrentPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, status]);

    const searchAdminUsers = (data) => {
        dispatch(getSearchAdminUsers(data));
    };

    const filterForm = () => {
        searchAdminUsers({ page, searchTerm, status });
    };

    const changeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        const _page = offset + 1;
        setCurrentPage(_page);
        setCurrentPageChangeTracker(_page);
    };
    useEffect(() => {
        if (searchTerm !== '' || status !== '') {
            filterForm();
        } else {
            getAllUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPageChangeTracker]);

    const suspendUser = (e) => {
        e.preventDefault();

        const user_id = { user_id: user.id };
        const _status = { suspension_status: true };

        const userData = Object.assign(user_id, _status);
        dispatch(postAdminSuspendUser(userData)).then((res) => {
            if (res?.status === successStatusCode) {
                setSuspendUserModal(false);
                dispatch(getAllUsers());
            }
        });
    };

    const unSuspendUser = (e) => {
        e.preventDefault();
        const user_id = { user_id: user.id };
        const _status = { suspension_status: false };

        const userData = Object.assign(user_id, _status);
        dispatch(postAdminSuspendUser(userData)).then((res) => {
            if (res?.status === successStatusCode) {
                setUnSuspendUserModal(false);
                dispatch(getAllUsers());
            }
        });
    };

    const deleteUser = () => {
        const user_id = { id: user.id };

        const userData = Object.assign(user_id);
        dispatch(postAdminDeleteUser(userData)).then((res) => {
            if (res?.status === successStatusCode) {
                setDeleteUserModal(false);
                dispatch(getAllUsers());
            }
        });
    };

    const getUserBranch = (id) => {
        if (!id) return 'N/A';

        // eslint-disable-next-line no-underscore-dangle
        const _branch = branches?.data?.find((branch) => branch.id === id);
        if (_branch) {
            return _branch?.name;
        }
        return 'N/A';
    };

    return (
        <>
            <div className="admin_users_page">
                <div className="requests_div">
                    <SubSectionHeader headText={`Users (${formatNumber(adminUsers?.total) || 0})`} rule />

                    <Filter onSubmit={handleSubmit(filterForm)} loading={isSubmitting} onClear={() => reset()}>
                        <FormInput
                            name="email"
                            type="email"
                            placeholder="Email address"
                            inputRef={register('email')}
                            readOnly={isSubmitting}
                            error={errors?.email}
                            errorMessage={errors?.email && errors?.email.message}
                        />
                        <FormSelect
                            name="status"
                            placeholder="Status"
                            selectRef={register('status')}
                            options={[
                                { name: 'All', value: '' },
                                { name: 'Complete', value: 'complete' },
                                { name: 'Incomplete', value: 'incomplete' },
                            ]}
                            readOnly={isSubmitting}
                            error={errors?.status}
                            errorMessage={errors?.status && errors?.status.message}
                        />
                    </Filter>

                    <Table
                        headers={[
                            'User ID',
                            'Profile',
                            'Full name',
                            'Email',
                            'Phone',
                            'Branch',
                            'Employment status',
                            'Registered date',
                            '',
                            '',
                        ]}
                        noTableData={adminUsers?.length === 0 || adminUsers?.data?.length === 0}
                        pageCount={adminUsers?.last_page}
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
                                {adminUsers?.length !== 0 &&
                                    adminUsers &&
                                    Object.values(adminUsers?.data)?.map((_user, i) => (
                                        <tr key={i}>
                                            {/* <td>{user.id || "-"}</td> */}
                                            <td>
                                                <p className="text_wrap">
                                                    <Link to={`/admin/users/${_user.id}`}>{_user.id || '-'}</Link>
                                                </p>
                                            </td>
                                            <td>
                                                <Status
                                                    type={statusStyling(_user.profile_status)}
                                                    text={_user.profile_status}
                                                />
                                            </td>
                                            <td>
                                                <p className="text_wrap">{_user.name || '-'}</p>
                                            </td>
                                            <td>
                                                <p className="text_wrap">{_user.email || '-'}</p>
                                            </td>
                                            <td>{_user.phone_number || '-'}</td>
                                            <td>
                                                <Status
                                                    type={statusStyling('info')}
                                                    text={getUserBranch(_user?.branch_id)}
                                                />
                                            </td>
                                            <td>{_user.employment_status || '-'}</td>
                                            <td>{formatDateToString(_user.created_at) || '-'}</td>
                                            <td>
                                                {_user.suspended === 0 ? (
                                                    <button
                                                        type="button"
                                                        className="btn_white_blue"
                                                        onClick={() => {
                                                            setUser(_user);
                                                            setSuspendUserModal(true);
                                                        }}
                                                    >
                                                        Suspend
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn_white_blue"
                                                        onClick={() => {
                                                            setUser(_user);
                                                            setUnSuspendUserModal(true);
                                                        }}
                                                    >
                                                        UnSuspend
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                <Button
                                                    text="Delete"
                                                    onClick={() => {
                                                        setUser(_user);
                                                        setDeleteUserModal(true);
                                                    }}
                                                />
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
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}

            {suspendUserModal && (
                <ConfirmationModal
                    isOpen={suspendUserModal}
                    closeModal={() => {
                        setSuspendUserModal(false);
                    }}
                    text="Proceed to SUSPEND this user?"
                    isSubmitting={isSubmitting}
                    onSubmit={suspendUser}
                />
            )}

            {unSuspendUserModal && (
                <ConfirmationModal
                    isOpen={unSuspendUserModal}
                    closeModal={() => {
                        setUnSuspendUserModal(false);
                    }}
                    text="Proceed to UNSUSPEND this user?"
                    isSubmitting={isSubmitting}
                    onSubmit={unSuspendUser}
                />
            )}

            {deleteUserModal && (
                <ConfirmationModal
                    isOpen={deleteUserModal}
                    closeModal={() => {
                        setDeleteUserModal(false);
                    }}
                    text="Proceed to DELETE this user?"
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(deleteUser)}
                />
            )}
        </>
    );
}

export default AdminUsersPage;
