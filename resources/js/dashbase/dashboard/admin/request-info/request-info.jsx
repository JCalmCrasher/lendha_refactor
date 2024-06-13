/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Modal } from 'reactstrap';

import { URL } from '../../../../api';
import Alert from '../../../../components/alert/alert';
import Dropdown from '../../../../components/dropdown/dropdown';
import Loader from '../../../../components/loader/loader';
import ConfirmationModal from '../../../../components/modal/confirmation-modal';
import DenyApplicationModal from '../../../../components/modal/deny-application-modal';
import LoanRepaymentModal from '../../../../components/modal/loan-repayment-modal';
import ModifyApplicationModal from '../../../../components/modal/modify-application-modal';
import ModifyLoanPurposeModal from '../../../../components/modal/modify-loan-purpose';
import OverviewInfo from '../../../../components/overview-info/overview-info';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import {
    formatAmount,
    formatDateInWords,
    formatDateToString,
    isEmpty,
    statusStyling,
    successStatusCode,
} from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import {
    getLoanDetails,
    getLoanPurposes,
    getSubAdminList,
    postAdminUpdateLoan,
    postAutoDebit,
    postLoanRepayments,
    postLoanStatus,
    postModifyLoanPurpose,
} from '../../../../store/loan/loanSlice';

import './request-info.scss';

import ProfileIcon from '../../../../assets/icons/profile.icon';
import AvatarPlaceholder from '../../../../assets/images/avatar-placeholder.png';
import Button from '../../../../components/button/button';
import CreditOfficerCard from '../../../../components/credit-officer-card';
import FormContainer from '../../../../components/form-container/form-container';
import FormInput from '../../../../components/form-input/form-input';
import AddSubadminModal from '../../../../components/modal/add-subadmin-modal';
import AutoDebitModal from '../../../../components/modal/auto-debit-modal';
import Table from '../../../../components/table/table';
import { getBranch } from '../../../../store/branch/branchSlice';
import { updateUserProfile } from '../../../../store/user/userSlice';

const NUMBER_OF_PAGES = 10;
function AdminRequestInfoPage() {
    const { user } = useSelector((state) => state.userSlice);

    const { loan_id } = useParams();
    const query = new URLSearchParams(useLocation().search);
    const loan_detail_id = query.get('id');

    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { branch } = useSelector((state) => state.branchSlice);
    const { adminLoanDetails, adminLoanRequests, loanPurposes, subAdminList } = useSelector((state) => state.loanSlice);
    const branchID = adminLoanDetails?.user?.branch_id;
    const user_detail_id = adminLoanDetails?.user?.id;
    const business = adminLoanDetails?.user?.business;
    const busReg = business?.business_registration;
    const isSubmitting = isLoading;
    const notification = alert;
    const [customerProfileEditModal, setCustomerProfileEditModal] = useState(false);
    const [autoDebitModal, setAutoDebitModal] = useState(false);
    const [modifyApplicationModal, setModifyApplicationModal] = useState(false);
    const [modifyLoanPurposeModal, setModifyLoanPurposeModal] = useState(false);
    const [approveApplicationModal, setApproveApplicationModal] = useState(false);
    const [addSubAdminModal, setAddSubAdminModal] = useState(false);
    const [completeApplicationModal, setCompleteApplicationModal] = useState(false);
    const [denyApplicationModal, setDenyApplicationModal] = useState(false);
    const [loanRepaymentModal, setLoanRepaymentModal] = useState(false);
    const [loanPaymentId, setLoanPaymentId] = useState(null);
    const [subadminId, setSubadminId] = useState(0);
    const [offset, setOffset] = useState(0);
    const [paginatedLoanHistory, setPaginatedLoanHistory] = useState(
        adminLoanDetails?.loan_history?.slice(offset * NUMBER_OF_PAGES, offset * NUMBER_OF_PAGES + NUMBER_OF_PAGES),
    );

    useEffect(
        () =>
            setPaginatedLoanHistory(
                adminLoanDetails?.loan_history?.slice(
                    offset * NUMBER_OF_PAGES,
                    offset * NUMBER_OF_PAGES + NUMBER_OF_PAGES,
                ),
            ),
        [adminLoanDetails?.loan_history, offset],
    );

    const changeData = (data) => {
        // const offset = data.selected;
        setOffset(data.selected);

        setPaginatedLoanHistory(adminLoanDetails?.loan_history.slice(offset * 2, offset * 2 + 2));
    };

    const {
        register,
        handleSubmit,
        formState: { isValid },
        errors,
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        const abortController = new AbortController();
        window.scroll(0, 0);
        dispatch(getLoanDetails(loan_id));
        dispatch(getLoanPurposes());
        dispatch(getSubAdminList());

        return function cleanup() {
            dispatch(closeAlert());
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        if (branchID) {
            dispatch(getBranch(branchID));
        }
    }, [branchID, dispatch]);

    // const getUserLoanInfo = () => {};

    const submitAutoDebit = (data) => {
        const id = { id: parseInt(loan_detail_id) };

        const loanData = Object.assign(id, data);
        dispatch(postAutoDebit(loanData)).then((res) => {
            if (res?.status === successStatusCode) {
                setAutoDebitModal(false);
                dispatch(getLoanDetails(loan_id));
            }
        });
    };

    const submitModifyApplication = (data) => {
        const id = { id: parseInt(loan_detail_id) };

        const loanData = Object.assign(id, data);
        dispatch(postAdminUpdateLoan(loanData)).then((res) => {
            if (res?.status === successStatusCode) {
                setModifyApplicationModal(false);
                dispatch(getLoanDetails(loan_id));
            }
        });
    };

    const submitModifyLoanPurpose = (data) => {
        const id = { loan_details_id: parseInt(loan_detail_id) };

        const loanData = Object.assign(id, data);
        dispatch(postModifyLoanPurpose(loanData)).then((res) => {
            if (res?.status === successStatusCode) {
                setModifyLoanPurposeModal(false);
                dispatch(getLoanDetails(loan_id));
            }
        });
    };

    const submitUpdateApplicationStatus = (data) => {
        let status = null;
        if (denyApplicationModal) status = 'denied';
        if (approveApplicationModal) status = 'approved';
        if (completeApplicationModal) status = 'completed';

        const id = { id: parseInt(loan_detail_id) };
        const loan_status = { loan_status: status };
        const subadmin = { subadmin_id: subadminId };
        const loanData = Object.assign(id, loan_status, subadmin, data);
        dispatch(postLoanStatus(loanData)).then((res) => {
            if (res?.status === successStatusCode) {
                setDenyApplicationModal(false);
                setApproveApplicationModal(false);
                setCompleteApplicationModal(false);
                dispatch(getLoanDetails(loan_id));
            }
        });
    };

    const submitAddSubAdmin = (data) => {
        setSubadminId(data?.subadmin_id);
        setAddSubAdminModal(false);
        setApproveApplicationModal(true);
    };

    const submitLoanRepayment = (data) => {
        const id = { loan_payments_id: parseInt(loanPaymentId) };

        const loanData = Object.assign(id, data);
        dispatch(postLoanRepayments(loanData)).then((res) => {
            if (res?.status === successStatusCode) {
                setLoanRepaymentModal(false);
                dispatch(getLoanDetails(loan_id));
            }
        });
    };

    const submitCustomerProfile = (data) => {
        const userId = adminLoanDetails?.user?.id;
        if (userId && data.full_name) {
            const userPayload = { user_id: userId, user_name: data.full_name };
            dispatch(updateUserProfile(userPayload)).then((res) => {
                if (res?.status === successStatusCode) {
                    setCustomerProfileEditModal(false);
                    dispatch(getLoanDetails(loan_id));
                }
            });
        }
    };

    return (
        <>
            <div className="admin_request_info_page">
                {isFetching ? (
                    <Loader color="blue" />
                ) : !adminLoanDetails || Object.values(adminLoanDetails)?.length === 0 ? (
                    <div className="incomplete_profile">User has not completed profile</div>
                ) : (
                    <>
                        <Modal isOpen={customerProfileEditModal}>
                            <FormContainer
                                headText="Customer profile"
                                rule
                                close={() => setCustomerProfileEditModal(false)}
                            >
                                <form className="form" onSubmit={handleSubmit(submitCustomerProfile)}>
                                    <FormInput
                                        label="Full name"
                                        name="full_name"
                                        type="text"
                                        inputRef={register('full_name', {
                                            required: 'This field is required',
                                        })}
                                        readOnly={isSubmitting}
                                        error={errors?.full_name}
                                        errorMessage={errors?.full_name && errors?.full_name.message}
                                    />
                                    <button
                                        className="button_component btn_blue"
                                        style={{ width: '100%' }}
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Save changes
                                    </button>
                                </form>
                            </FormContainer>
                        </Modal>
                        {/* Account */}
                        <div className="section_div">
                            <SubSectionHeader
                                headText="Customer profile"
                                action={
                                    <Link
                                        className="button_component btn_blue d-flex align-items-center"
                                        to={`/admin/requests/profile/${adminLoanDetails?.loan_details?.application_id}`}
                                    >
                                        <ProfileIcon />
                                        <span className="pl-2">View Profile Info</span>
                                    </Link>
                                }
                                rule
                            />
                            <div className="flex_div">
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={
                                            adminLoanDetails
                                                ? `${URL.baseURL}/${adminLoanDetails?.documents?.passport_photo}`
                                                : ''
                                        }
                                        // eslint-disable-next-line no-return-assign
                                        onError={(e) => (e.target.src = AvatarPlaceholder)}
                                        className="user_img"
                                        alt=""
                                    />
                                    {adminLoanDetails?.documents?.passport_photo && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                right: '1px',
                                                bottom: '1px',
                                                borderRadius: '100%',
                                                width: '25px',
                                                height: '25px',
                                                backgroundColor: '#1A1F4A',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontFamily: 'Poppins !important',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            <span style={{ marginTop: '-3px' }}>v2</span>
                                        </div>
                                    )}
                                </div>
                                <div className="group">
                                    <p className="label">PROFILE STATUS:</p>
                                    <Status
                                        type={statusStyling(adminLoanDetails?.user?.profile_status)}
                                        text={adminLoanDetails?.user?.profile_status}
                                    />
                                </div>
                                <div className="group">
                                    <p className="label">APPL. STATUS:</p>
                                    <Status
                                        type={statusStyling(adminLoanDetails?.loan_details?.status)}
                                        text={adminLoanDetails?.loan_details?.status}
                                    />
                                </div>
                                <div className="group">
                                    <p className="label">BRANCH:</p>
                                    <Status type={statusStyling('info')} text={branch?.data?.name || 'N/A'} />
                                </div>
                                {adminLoanDetails?.loan_details?.status !== 'completed' &&
                                    adminLoanDetails?.loan_details?.status !== 'denied' && (
                                        <Dropdown>
                                            {adminLoanDetails?.loan_details?.status === 'pending' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setModifyApplicationModal(true);
                                                            dispatch(closeAlert());
                                                        }}
                                                    >
                                                        Modify Application
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setModifyLoanPurposeModal(true);
                                                            dispatch(closeAlert());
                                                        }}
                                                    >
                                                        Modify Loan Purpose
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setAddSubAdminModal(true);
                                                            dispatch(closeAlert());
                                                        }}
                                                    >
                                                        Approve Application
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setDenyApplicationModal(true);
                                                            dispatch(closeAlert());
                                                        }}
                                                    >
                                                        Deny Application
                                                    </button>
                                                </>
                                            )}
                                            {adminLoanDetails?.loan_details?.status === 'approved' && (
                                                <>
                                                    {/* <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setAutoDebitModal(
                                                                true
                                                            );
                                                            dispatch(
                                                                closeAlert()
                                                            );
                                                        }}
                                                    >
                                                        Auto Debit
                                                    </button> */}
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setCompleteApplicationModal(true);
                                                            dispatch(closeAlert());
                                                        }}
                                                    >
                                                        Mark as Completed
                                                    </button>
                                                </>
                                            )}
                                        </Dropdown>
                                    )}
                            </div>
                            <div className="info_div">
                                <OverviewInfo headText={adminLoanDetails?.user?.name} subTextSpan="Full name" />
                                <OverviewInfo headText={adminLoanDetails?.user?.email} subTextSpan="Email address" />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.phone_number}
                                    subTextSpan="Phone number"
                                />
                                <OverviewInfo
                                    headText={formatDateInWords(adminLoanDetails?.user?.date_of_birth)}
                                    subTextSpan="Date of birth"
                                />
                                <OverviewInfo headText={adminLoanDetails?.bank_account?.bvn} subTextSpan="BVN" />
                            </div>
                        </div>

                        {/* Payments */}
                        {adminLoanDetails?.loan_details?.payments && (
                            <div className="section_div">
                                <SubSectionHeader headText="Repayments" rule />
                                <div className="payments_div">
                                    {adminLoanDetails?.loan_details?.payments.map((item, i) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <div key={i} className="payment">
                                            <div className="info">
                                                <h6>#{item.id}</h6>
                                                <p>Payment ID</p>
                                            </div>
                                            <div className="info">
                                                <h6>{formatAmount(item.intended_payment)}</h6>
                                                <p>Intended payment</p>
                                            </div>
                                            <div className="info">
                                                <h6>{formatAmount(item.user_payment)}</h6>
                                                <p>Amount paid</p>
                                            </div>
                                            {item.user_payment !== item.intended_payment && item.user_payment !== 0 && (
                                                <div className="info">
                                                    <h6>{formatAmount(item.intended_payment - item.user_payment)}</h6>
                                                    <p>To balance</p>
                                                </div>
                                            )}
                                            <div className="info">
                                                <h6>{formatDateInWords(item.updated_at)}</h6>
                                                <p>Last updated at</p>
                                            </div>
                                            {user.id == 2 && item.status !== 'completed' && (
                                                <Button
                                                    text="Pay loan"
                                                    onClick={() => {
                                                        setLoanRepaymentModal(true);
                                                        setLoanPaymentId(item.id);
                                                        dispatch(closeAlert());
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loan Information */}
                        <div className="section_div">
                            <SubSectionHeader
                                headText="Loan information"
                                action={
                                    <Link
                                        className="button_component btn_blue d-flex align-items-center"
                                        to={`/admin/payments/${adminLoanDetails?.loan_details?.application_id}?loan_id=${loan_detail_id}&user_id=${user_detail_id}`}
                                    >
                                        <i className="fa fa-credit-card" aria-hidden="true" />
                                        <span className="pl-2">Payment information</span>
                                    </Link>
                                }
                                rule
                            />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={`#${adminLoanDetails?.loan_details?.application_id}`}
                                    subTextSpan="Application ID"
                                />
                                <OverviewInfo
                                    headText={formatAmount(adminLoanDetails?.loan_details?.amount)}
                                    subTextSpan="Applied amount"
                                />
                                <OverviewInfo
                                    headText={`${adminLoanDetails?.loan_details?.duration}months`}
                                    subTextSpan="Applied / modified duration"
                                />
                                <OverviewInfo
                                    headText={formatAmount(adminLoanDetails?.loan_details?.approved_amount)}
                                    subTextSpan="Modified / approved amount"
                                />
                                <OverviewInfo
                                    headText={formatDateInWords(adminLoanDetails?.loan_details?.request_date)}
                                    subTextSpan="Date of application"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.loan_details?.open_duration}
                                    subTextSpan="Open for"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.loan_details?.purpose}
                                    subTextSpan="Loan purpose"
                                />
                            </div>
                        </div>

                        {/* Loan History */}
                        <div className="section_div">
                            <SubSectionHeader headText="Loan History" rule />
                            <Table
                                headers={[
                                    'Application ID',
                                    'Loan amount',
                                    'Loan status',
                                    'Loan Denial Reason',
                                    'Request date',
                                ]}
                                noTableData={
                                    paginatedLoanHistory && Object.values(paginatedLoanHistory || [])?.length === 0
                                }
                                pageCount={
                                    adminLoanDetails?.loan_history?.length > NUMBER_OF_PAGES
                                        ? // eslint-disable-next-line no-unsafe-optional-chaining
                                          adminLoanDetails?.loan_history?.length / NUMBER_OF_PAGES
                                        : 1
                                }
                                changeData={changeData}
                                id="loan-requests"
                            >
                                {isFetching ? (
                                    <tr>
                                        <td>
                                            <Loader color="blue" />
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {paginatedLoanHistory &&
                                            Object.values(paginatedLoanHistory || [])
                                                ?.sort((a, b) => {
                                                    return new Date(b.request_date) - new Date(a.request_date);
                                                })
                                                ?.map((loan, i) => (
                                                    <tr key={i}>
                                                        <td>
                                                            <p className="text_wrap">#{loan.application_id}</p>
                                                        </td>
                                                        <td>{formatAmount(loan.amount)}</td>
                                                        <td>
                                                            <Status
                                                                type={statusStyling(loan.status)}
                                                                text={loan.status}
                                                            />
                                                        </td>
                                                        <td>
                                                            {isEmpty(loan.loan_denial_reason)
                                                                ? 'N/A'
                                                                : loan.loan_denial_reason}
                                                        </td>
                                                        <td>{formatDateToString(loan.request_date)}</td>
                                                    </tr>
                                                ))}
                                    </>
                                )}
                            </Table>
                        </div>

                        {/* Credit Officer */}
                        <div className="section_div">
                            <SubSectionHeader headText="Credit Officer" rule />
                            <CreditOfficerCard
                                phone={adminLoanDetails?.credit_officer?.phone_number || 'N/A'}
                                name={adminLoanDetails?.credit_officer?.name || 'N/A'}
                            />
                        </div>
                    </>
                )}
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

            {autoDebitModal && (
                <AutoDebitModal
                    isOpen={autoDebitModal}
                    closeModal={() => {
                        setAutoDebitModal(false);
                    }}
                    inputRef={register('amount', {
                        required: 'This field is required',
                        valueAsNumber: true,
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitAutoDebit)}
                    disabled={!isValid}
                />
            )}

            {modifyApplicationModal && (
                <ModifyApplicationModal
                    isOpen={modifyApplicationModal}
                    closeModal={() => {
                        setModifyApplicationModal(false);
                    }}
                    loanAmtRef={register('loan_amount', {
                        required: 'This field is required',
                        valueAsNumber: true,
                    })}
                    loanTermRef={register('loan_amount', {
                        required: 'This field is required',
                        valueAsNumber: true,
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitModifyApplication)}
                    disabled={!isValid}
                />
            )}

            {modifyLoanPurposeModal && (
                <ModifyLoanPurposeModal
                    isOpen={modifyLoanPurposeModal}
                    closeModal={() => {
                        setModifyLoanPurposeModal(false);
                    }}
                    loan_purposes={loanPurposes}
                    selectRef={register('new_loan_purpose_id', {
                        required: 'This field is required',
                        valueAsNumber: true,
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitModifyLoanPurpose)}
                    disabled={!isValid}
                />
            )}

            {denyApplicationModal && (
                <DenyApplicationModal
                    isOpen={denyApplicationModal}
                    closeModal={() => {
                        setDenyApplicationModal(false);
                    }}
                    textRef={register('loan_denial_reason', {
                        required: 'This field is required',
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitUpdateApplicationStatus)}
                    disabled={!isValid}
                />
            )}

            {approveApplicationModal && (
                <ConfirmationModal
                    isOpen={approveApplicationModal}
                    closeModal={() => {
                        setApproveApplicationModal(false);
                    }}
                    text="Proceed to APPROVE this loan application?"
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitUpdateApplicationStatus)}
                />
            )}

            {addSubAdminModal && (
                <AddSubadminModal
                    isOpen={addSubAdminModal}
                    selectRef={register('subadmin_id', {
                        required: 'This field is required',
                        // valueAsNumber: true,
                    })}
                    closeModal={() => {
                        setAddSubAdminModal(false);
                    }}
                    subadmins={subAdminList}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitAddSubAdmin)}
                />
            )}

            {completeApplicationModal && (
                <ConfirmationModal
                    isOpen={completeApplicationModal}
                    closeModal={() => {
                        setCompleteApplicationModal(false);
                    }}
                    text="Proceed to mark this application as COMPLETE?"
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitUpdateApplicationStatus)}
                />
            )}

            {loanRepaymentModal && (
                <LoanRepaymentModal
                    isOpen={loanRepaymentModal}
                    closeModal={() => {
                        setLoanRepaymentModal(false);
                    }}
                    inputRef={register('amount', {
                        required: 'This field is required',
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitLoanRepayment)}
                    disabled={!isValid}
                />
            )}
        </>
    );
}

export default AdminRequestInfoPage;
