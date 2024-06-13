/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import './admins.scss';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'reactstrap';

import Button from '../../../../components/button/button';
import Filter from '../../../../components/filter/filter';
import FormContainer from '../../../../components/form-container/form-container';
import FormInput from '../../../../components/form-input/form-input';
import FormSelect from '../../../../components/form-select/form-select';
import Spinner from '../../../../components/spinner/spinner';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../components/table/table';
import {
    createUserTypeFilter,
    dateInISO,
    dateInYMD,
    extractBranches,
    getYearFromDate,
    isEmpty,
    statusStyling,
    successStatusCode,
} from '../../../../components/utils/helper';

import '../../../../components/modal/modal.scss';

import Alert from '../../../../components/alert/alert';
import Loader from '../../../../components/loader/loader';
import Status from '../../../../components/status/status';
import { getRoles, postAdminTeamMember } from '../../../../store/admin/adminSlice';
import { getBranches } from '../../../../store/branch/branchSlice';
import { closeAlert } from '../../../../store/components/componentsSlice';
import { getOnlyAdminUsers, getSearchAdmin, getUserDashboardDetails } from '../../../../store/user/userSlice';

const sx = { marginLeft: '24px' };

function AdminAdminsPage() {
    const [adminModal, setAdminModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm();

    const {
        register: registerAdmin,
        handleSubmit: handleSubmitAdmin,
        reset: resetAdmin,
        formState: { errors: errorsAdmin },
    } = useForm();

    const { isFetching, isLoading: isSubmitting, alert: notification } = useSelector((state) => state.componentsSlice);

    const { adminUsers } = useSelector((state) => state.userSlice);
    const { branches: branchResponse } = useSelector((state) => state.branchSlice);
    const [adminBranches] = extractBranches(branchResponse?.data || []);
    const { roles } = useSelector((state) => state.adminSlice);
    const adminRoles = roles.map((role) => ({ value: role.id, name: role.type }));
    const adminRolesNames = roles.map((role) => ({ value: role.type, name: role.type }));

    const startDate = watch('start_date', '');
    const endDate = watch('end_date', '');
    const userType = watch('user_type', '');

    const filterForm = () => {
        let start_date = '';
        let end_date = '';
        if (!isEmpty(startDate)) {
            start_date = dateInISO(startDate);
        }
        if (!isEmpty(endDate)) {
            end_date = dateInISO(endDate);
        }

        const filters = userType
            ? createUserTypeFilter([userType])
            : createUserTypeFilter(['admin', 'subadmin', 'merchant', 'team_lead', 'onboarding_officer']);

        const payload = {
            start_date,
            end_date,
            filters,
        };

        dispatch(getSearchAdmin(payload));
    };

    const onAddTeamMember = (data) => {
        const payload = { ...data, date_of_birth: dateInYMD(data.date_of_birth), user_type_id: data.type };
        dispatch(postAdminTeamMember(payload)).then((res) => {
            if (res.status === successStatusCode) {
                setAdminModal(false);
                resetAdmin();

                window.location.reload();
            }
        });
    };

    const getAllUsers = async () => {
        const userTypes = ['admin', 'subadmin', 'merchant', 'team_lead', 'onboarding_officer'];
        const filters = createUserTypeFilter(userTypes);

        dispatch(getOnlyAdminUsers({ page: currentPage, filters }));
    };

    const changeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        const page = offset + 1;
        setCurrentPage(page);
    };

    useEffect(() => {
        dispatch(getRoles());
        dispatch(getBranches());
        getAllUsers();
    }, [currentPage]);

    const getUserBranch = (id) => {
        if (!id) return 'N/A';

        // eslint-disable-next-line no-underscore-dangle
        const _branch = branchResponse?.data?.find((branch) => branch.id === id);
        if (_branch) {
            return _branch?.name;
        }
        return 'N/A';
    };

    const getAdminRole = (role_id) => {
        return adminRoles.filter((role) => role_id === role.value)[0]?.name || 'N/A';
    };

    return (
        <>
            {isFetching && <Spinner />}
            <div className="admin_admins_page">
                <div className="admins_div">
                    <div
                        className="d-flex"
                        style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <SubSectionHeader headText="Admins" rule />
                        <Button text="Add Admin" onClick={() => setAdminModal(true)} />
                    </div>
                    <Filter
                        whiteSpace
                        onSubmit={handleSubmit(filterForm)}
                        loading={isFetching}
                        onClear={() => reset({ start_date: '', end_date: '' })}
                    >
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
                        <div className="d-flex">
                            <FormSelect
                                label="User role"
                                name="user_type"
                                selectRef={register('user_type')}
                                readOnly={isSubmitting}
                                error={errors?.user_type}
                                errorMessage={errors?.user_type && errors?.user_type.message}
                                options={adminRolesNames}
                                groupSx={sx}
                            />
                        </div>
                    </Filter>

                    <Table
                        headers={['Name', 'Email', 'Branch', 'Role']}
                        noTableData={(adminUsers?.data || []).length === 0}
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
                                            <td>
                                                <p className="text_wrap">{_user.name || '-'}</p>
                                            </td>
                                            <td>
                                                <p className="text_wrap">{_user.email || '-'}</p>
                                            </td>
                                            <td>
                                                <Status
                                                    type={statusStyling('active')}
                                                    text={getUserBranch(_user.branch_id)}
                                                />
                                            </td>
                                            <td>
                                                <Status
                                                    type={statusStyling('active')}
                                                    text={getAdminRole(_user.user_type_id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </>
                        )}
                    </Table>
                </div>
            </div>

            {adminModal && (
                <Modal className="loan_interest_modal" isOpen={adminModal}>
                    <FormContainer
                        headText={isEditing ? 'Edit Admin' : 'Add Admin'}
                        rule
                        close={() => setAdminModal(false)}
                    >
                        <form className="form" onSubmit={handleSubmitAdmin(onAddTeamMember)}>
                            <FormInput
                                label="Firstname and lastname"
                                name="name"
                                type="text"
                                inputRef={registerAdmin('name', {
                                    required: 'Name is required',
                                })}
                                error={errorsAdmin?.name}
                                errorMessage={errorsAdmin?.name && errorsAdmin?.name.message}
                            />
                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                inputRef={registerAdmin('email', {
                                    required: 'Email is required',
                                })}
                                error={errorsAdmin?.email}
                                errorMessage={errorsAdmin?.email && errorsAdmin?.email.message}
                            />
                            <FormInput
                                label="Phone number"
                                name="phone_number"
                                type="text"
                                inputRef={registerAdmin('phone_number', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[0-9]{11}$/,
                                        message: 'Invalid phone number',
                                    },
                                })}
                                error={errorsAdmin?.phone_number}
                                errorMessage={errorsAdmin?.phone_number && errorsAdmin?.phone_number.message}
                                maxLength={11}
                            />
                            <FormInput
                                label="Date of birth"
                                name="date_of_birth"
                                type="date"
                                inputRef={registerAdmin('date_of_birth', {
                                    required: 'Date of birth is required',
                                    validate: (value) =>
                                        getYearFromDate(new Date()) - getYearFromDate(value) >= '18' ||
                                        'You are below 18years and not eligble to use our service',
                                    valueAsDate: true,
                                })}
                                readOnly={isSubmitting}
                                error={errorsAdmin?.date_of_birth}
                                errorMessage={errorsAdmin?.date_of_birth && errorsAdmin?.date_of_birth?.message}
                            />
                            <FormSelect
                                label="Branch"
                                name="branch_id"
                                selectRef={registerAdmin('branch_id', {
                                    required: 'Branch is required',
                                })}
                                readOnly={isSubmitting}
                                error={errorsAdmin?.branch_id}
                                errorMessage={errorsAdmin?.branch_id && errorsAdmin?.branch_id.message}
                                options={adminBranches}
                            />

                            <FormSelect
                                label="Assign as"
                                name="type"
                                selectRef={registerAdmin('type', {
                                    required: 'User role is required',
                                })}
                                readOnly={isSubmitting}
                                error={errorsAdmin?.type}
                                errorMessage={errorsAdmin?.type && errorsAdmin?.type.message}
                                options={adminRoles}
                            />
                            <div className="actions">
                                <button type="button" className="btn_white_blue" onClick={() => setAdminModal(false)}>
                                    Cancel
                                </button>
                                <Button text="Submit" loading={isSubmitting} disabled={errors?.rate} />
                            </div>
                        </form>
                    </FormContainer>
                </Modal>
            )}

            {/* Other components */}
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={notification.message}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert(null))}
                />
            )}
        </>
    );
}

export default AdminAdminsPage;
