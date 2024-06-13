/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React, { useEffect, useState } from 'react';

import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Modal } from 'reactstrap';

import Alert from '../../../../components/alert/alert';
import Button from '../../../../components/button/button';
import Dropdown from '../../../../components/dropdown/dropdown';
import Loader from '../../../../components/loader/loader';
import ConfirmationModal from '../../../../components/modal/confirmation-modal';
import DenyApplicationModal from '../../../../components/modal/deny-application-modal';
import LoanRepaymentModal from '../../../../components/modal/loan-repayment-modal';
import ModifyApplicationModal from '../../../../components/modal/modify-application-modal';
import ModifyLoanPurposeModal from '../../../../components/modal/modify-loan-purpose';
import OverviewInfo, { OverviewInfoVideo } from '../../../../components/overview-info/overview-info';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import {
    formatAmount,
    formatDateInWords,
    formatDateToString,
    statusStyling,
    successStatusCode,
} from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import {
    getBusinessPictures,
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

import PencilIcon from '../../../../assets/icons/pencil.icon';
import CreditOfficerCard from '../../../../components/credit-officer-card';
import FormContainer from '../../../../components/form-container/form-container';
import FormInput from '../../../../components/form-input/form-input';
import LendhaWalletCard from '../../../../components/lendha-wallet-card';
import AddSubadminModal from '../../../../components/modal/add-subadmin-modal';
import AutoDebitModal from '../../../../components/modal/auto-debit-modal';
import Table from '../../../../components/table/table';
import TextArea from '../../../../components/text-area/text-area';
import { reviewCustomerTransferRequest } from '../../../../store/admin/adminSlice';
import { getBranch } from '../../../../store/branch/branchSlice';
import { updateUserProfile } from '../../../../store/user/userSlice';

function AdminRequestInfoDetailsPage() {
    const { loan_id } = useParams();
    const query = new URLSearchParams(useLocation().search);
    const loan_detail_id = query.get('id');

    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { branch } = useSelector((state) => state.branchSlice);
    const { adminLoanDetails, loanPurposes, subAdminList } = useSelector((state) => state.loanSlice);
    const businessPictures = adminLoanDetails?.user?.business?.business_pictures;

    const bankStatements = adminLoanDetails?.loan_details?.bank_statement?.data;
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
    const [transferRequestDeclineModal, setTransferRequestDeclineModal] = useState(false);
    const [confirmApprovalTransferRequest, setConfirmApprovalTransferRequest] = useState(false);

    const [loanPaymentId, setLoanPaymentId] = useState(null);
    const [subadminId, setSubadminId] = useState(0);
    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
    } = useForm({
        mode: 'onChange',
    });
    const {
        register: registerModifyApp,
        handleSubmit: handleSubmitModifyApp,
        formState: { isValid: isValidModifyApp, errors: errorsModifyApp },
    } = useForm({
        mode: 'onChange',
    });
    const {
        register: registerModifyLoanPurpose,
        handleSubmit: handleSubmitModifyLoanPurpose,
        formState: { isValid: isValidModifyLoanPurpose, errors: errorsModifyLoanPurpose },
    } = useForm({
        mode: 'onChange',
    });
    const {
        register: registerSubadmin,
        handleSubmit: handleSubmitRegisterSubadmin,
        formState: { errors: subadminErrors },
    } = useForm({
        mode: 'onChange',
    });
    const { handleSubmit: handleLoanApproval } = useForm({
        mode: 'onChange',
    });
    const {
        register: registerDenial,
        formState: { errors: denialErrors, isValid: isDenialValid },
        handleSubmit: handleSubmitDenial,
    } = useForm({
        mode: 'onChange',
    });
    const { handleSubmit: completeLoanRequest } = useForm({ mode: 'onChange' });

    const {
        register: registerReviewTransfer,
        handleSubmit: handleSubmitReviewTransfer,
        formState: { errors: reviewTransferErrors, isSubmitting: isRequestTransferSubmitting },
    } = useForm({
        mode: 'onChange',
    });

    const {
        handleSubmit: handleSubmitApprovalRequest,
        formState: { isSubmitting: isTransferRequestSubmitting },
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        const abortController = new AbortController();
        window.scroll(0, 0);
        dispatch(getBusinessPictures(loan_id));
        dispatch(getLoanDetails(loan_id));
        dispatch(getLoanPurposes());
        dispatch(getSubAdminList());

        return function cleanup() {
            dispatch(closeAlert());
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        if (adminLoanDetails?.user?.branch_id) {
            dispatch(getBranch(adminLoanDetails?.user?.branch_id));
        }
    }, [adminLoanDetails?.user?.branch_id, dispatch]);

    // const getUserLoanInfo = () => {};

    const submitAutoDebit = (data) => {
        const id = { id: parseInt(loan_detail_id, 10) };

        const loanData = Object.assign(id, data);
        dispatch(postAutoDebit(loanData)).then((res) => {
            if (res?.status === successStatusCode) {
                setAutoDebitModal(false);
                dispatch(getLoanDetails(loan_id));
            }
        });
    };

    const submitModifyApplication = (data) => {
        const id = { id: parseInt(loan_detail_id, 10) };

        const loanData = Object.assign(id, data);
        dispatch(postAdminUpdateLoan(loanData)).then((res) => {
            if (res?.status === successStatusCode) {
                setModifyApplicationModal(false);
                dispatch(getLoanDetails(loan_id));
            }
        });
    };

    const submitModifyLoanPurpose = (data) => {
        const id = { loan_details_id: parseInt(loan_detail_id, 10) };

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

    const teamLeadStatus = adminLoanDetails?.loan_details?.team_lead_approval;
    const getTeamLeadApprovalStatus = (status) => {
        switch (status) {
            case true:
                return 'Approved';
            case false:
                return 'Denied';
            default:
                return 'Awaiting approval';
        }
    };

    const transferRequestDetails = adminLoanDetails?.user?.user_transfers[0];
    const transferRequestStatus = transferRequestDetails?.status;
    const oldLoanOfficer = transferRequestDetails?.old_officer_name || 'N/A';
    const newLoanOfficer = transferRequestDetails?.new_officer_name || 'N/A';

    const [isApprovingRequestTransfer, setIsApprovingRequestTransfer] = useState(false);
    const approveCustomerTransfer = () => {
        setIsApprovingRequestTransfer(true);
        dispatch(reviewCustomerTransferRequest({ user_transfer_id: transferRequestDetails?.id, status: 1 })).then(
            () => {
                setIsApprovingRequestTransfer(false);
                dispatch(getLoanDetails(loan_id));
                setConfirmApprovalTransferRequest(false);
            },
        );
    };

    const declineCustomerTransfer = (data) => {
        dispatch(
            reviewCustomerTransferRequest({
                user_transfer_id: transferRequestDetails?.id,
                status: 2,
                denial_reason: data.reason,
            }),
        ).then(() => {
            dispatch(getLoanDetails(loan_id));
            setTransferRequestDeclineModal(false);
        });
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
                                headText="Customer Profile"
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

                        <ConfirmationModal
                            isOpen={confirmApprovalTransferRequest}
                            closeModal={() => {
                                setConfirmApprovalTransferRequest(false);
                            }}
                            text="Proceed to APPROVE this transfer request?"
                            isSubmitting={isTransferRequestSubmitting}
                            onSubmit={handleSubmitApprovalRequest(approveCustomerTransfer)}
                        />

                        <Modal isOpen={transferRequestDeclineModal} close={() => setTransferRequestDeclineModal(false)}>
                            <FormContainer
                                headText="Decline Request"
                                rule
                                close={() => setTransferRequestDeclineModal(false)}
                            >
                                <form className="form" onSubmit={handleSubmitReviewTransfer(declineCustomerTransfer)}>
                                    <TextArea
                                        label="Reason for decline"
                                        name="reason"
                                        type="text"
                                        rows={3}
                                        inputRef={registerReviewTransfer('reason', {
                                            required: 'This field is required',
                                        })}
                                        error={reviewTransferErrors?.reason}
                                        errorMessage="This field is required"
                                    />
                                    <button
                                        type="submit"
                                        className="button_component btn_blue"
                                        disabled={isRequestTransferSubmitting}
                                    >
                                        Decline Transfer
                                    </button>
                                </form>
                            </FormContainer>
                        </Modal>

                        {/* Account */}
                        <div className="section_div">
                            {transferRequestStatus === 'pending' && (
                                <div
                                    style={{
                                        marginBottom: '14px',
                                    }}
                                >
                                    <h4>
                                        There is a new transfer request on this account from {oldLoanOfficer} to{' '}
                                        {newLoanOfficer}
                                    </h4>
                                    <div className="d-flex" style={{ gap: '8px' }}>
                                        <button
                                            className="button_component btn_blue d-flex align-items-center"
                                            type="button"
                                            onClick={() => setConfirmApprovalTransferRequest(true)}
                                            disabled={isApprovingRequestTransfer}
                                        >
                                            Approve transfer
                                        </button>
                                        <button
                                            className="button_component btn_blue d-flex align-items-center"
                                            style={{
                                                background: '#F05757',
                                                border: 'none',
                                            }}
                                            type="button"
                                            onClick={() => setTransferRequestDeclineModal(true)}
                                        >
                                            Decline transfer
                                        </button>
                                    </div>
                                </div>
                            )}
                            <Link to="/admin/requests">
                                <button
                                    type="button"
                                    className="btn btn-sm h6 bg-white"
                                    style={{
                                        border: '1px solid var(--color-blue)',
                                        boxShadow: 'none',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faLeftLong} />
                                    <span type="button" aria-hidden="true" /> Back
                                </button>
                            </Link>
                            <SubSectionHeader
                                headText="Customer Profile"
                                action={
                                    <button
                                        type="button"
                                        className="button_component btn_blue d-flex align-items-center"
                                        onClick={() => setCustomerProfileEditModal(true)}
                                    >
                                        <span className="pr-2">Edit Profile</span>
                                        <PencilIcon />
                                    </button>
                                }
                                rule
                            />
                            <div className="flex_div">
                                <img
                                    src={
                                        adminLoanDetails
                                            ? `${import.meta.env.VITE_APP_URL}/${adminLoanDetails?.documents?.passport_photo}`
                                            : ''
                                    }
                                    className="user_img"
                                    alt={adminLoanDetails?.user?.name}
                                />
                                <div className="group">
                                    <p className="label">PROFILE STATUS:</p>
                                    <Status
                                        type={statusStyling(adminLoanDetails?.user?.profile_status)}
                                        text={adminLoanDetails?.user?.profile_status}
                                    />
                                </div>
                                <div className="group">
                                    <p className="label">TEAM LEAD STATUS:</p>
                                    <Status
                                        type={statusStyling(adminLoanDetails?.loan_details?.team_lead_approval)}
                                        text={getTeamLeadApprovalStatus(teamLeadStatus)}
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

                        {/* Business info */}
                        <div className="section_div">
                            <div className="flex_div">
                                <SubSectionHeader headText="Business Information" rule />
                            </div>
                            <div className="info_div">
                                <OverviewInfo headText={business?.name || 'N/A'} subTextSpan="Business Name" />
                                <OverviewInfo headText={business?.email || 'N/A'} subTextSpan="Business email" />
                                <OverviewInfo headText={business?.category || 'N/A'} subTextSpan="Business category" />
                                <OverviewInfo
                                    headText={business?.description || 'N/A'}
                                    subTextSpan="Business description"
                                />
                                <OverviewInfo headText={business?.street || 'N/A'} subTextSpan="Business street" />
                                <OverviewInfo headText={business?.landmark || 'N/A'} subTextSpan="Business landmark" />
                                <OverviewInfo headText={business?.city || 'N/A'} subTextSpan="Business city" />
                                <OverviewInfo headText={business?.state || 'N/A'} subTextSpan="Business state" />
                            </div>
                        </div>

                        {/* Business images */}
                        <div className="section_div">
                            <div className="flex_div">
                                <SubSectionHeader headText="Business Images" rule />
                            </div>
                            <div className="info_div">
                                {(businessPictures || [])?.length > 0 ? (
                                    businessPictures.map((img, i) => (
                                        <OverviewInfo
                                            key={i}
                                            imageUrl={img}
                                            imageWidth={100}
                                            subTextSpan={`Business Images ${i + 1}`}
                                        />
                                    ))
                                ) : (
                                    <OverviewInfo headText="" subTextSpan="N/A" />
                                )}
                            </div>
                        </div>

                        {/* Business registration status */}
                        <div className="section_div">
                            <div className="flex_div">
                                <SubSectionHeader headText="Business registration status" rule />
                            </div>
                            <div className="info_div">
                                <OverviewInfo
                                    headText={business?.registration_status ? 'Yes' : 'No'}
                                    subTextSpan="Registered?"
                                />
                                {business?.registration_status && (
                                    <>
                                        <OverviewInfo
                                            headText={busReg?.business_registration_number || 'N/A'}
                                            subTextSpan="Registration Number"
                                        />

                                        <OverviewInfo
                                            imageUrl={busReg?.cac_document}
                                            imageWidth={100}
                                            subTextSpan="CAC Document"
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Payments */}
                        {adminLoanDetails?.loan_details?.payments && (
                            <div className="section_div">
                                <SubSectionHeader headText="Repayments" rule />
                                <div className="payments_div">
                                    {adminLoanDetails?.loan_details?.payments.map((item, i) => (
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
                                            <Button
                                                text="Pay loan"
                                                onClick={() => {
                                                    setLoanRepaymentModal(true);
                                                    setLoanPaymentId(item.id);
                                                    dispatch(closeAlert());
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Loan Information */}
                        <div className="section_div">
                            <SubSectionHeader headText="Loan information" rule />
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
                                    'ID',
                                    'Status',
                                    'Mer. code',
                                    'TL Denial reason',
                                    'Denial reason',
                                    'Loan amount',
                                    'Request date',
                                ]}
                                id="loan-requests"
                                noTableData={
                                    adminLoanDetails?.loan_history &&
                                    Object.values(adminLoanDetails?.loan_history || [])?.length === 0
                                }
                            >
                                {isFetching ? (
                                    <tr>
                                        <td>
                                            <Loader color="blue" />
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {adminLoanDetails &&
                                            Object.values(adminLoanDetails?.loan_history || [])?.map((loan, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <p className="text_wrap">#{loan.application_id}</p>
                                                    </td>
                                                    <td>
                                                        <Status type={statusStyling(loan.status)} text={loan.status} />
                                                    </td>
                                                    <td>{loan.merchant_id || '-'}</td>
                                                    <td>{loan.team_lead_denial_reason || 'N/A'}</td>
                                                    <td>{loan.loan_denial_reason || 'N/A'}</td>
                                                    <td>{formatAmount(loan.amount)}</td>
                                                    <td>{formatDateToString(loan.request_date)}</td>
                                                </tr>
                                            ))}
                                    </>
                                )}
                            </Table>
                        </div>

                        {/* NOK */}
                        <div className="section_div">
                            <SubSectionHeader headText="Next of Kin" rule />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.next_of_kin?.name}
                                    subTextSpan="Next of Kin name"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.next_of_kin?.email}
                                    subTextSpan="Next of Kin email"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.next_of_kin?.phone}
                                    subTextSpan="Next of Kin phone number"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.next_of_kin?.address}
                                    subTextSpan="Next of Kin address"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.next_of_kin?.relationship}
                                    subTextSpan="Relationship with you"
                                />
                            </div>
                        </div>

                        {/* Guarantor */}
                        <div className="section_div">
                            <SubSectionHeader headText="Guarantor" rule />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.guarantor?.name}
                                    subTextSpan="Guarantor name"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.guarantor?.phone}
                                    subTextSpan="Guarantor phone number"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.guarantor?.address}
                                    subTextSpan="Guarantor address"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.guarantor?.relationship}
                                    subTextSpan="Relationship with you"
                                />
                                <OverviewInfo
                                    imageUrl={`${adminLoanDetails?.user?.guarantor?.guarantors_face_photo}`}
                                    subTextSpan="Guarantor face photo"
                                />
                                <OverviewInfo
                                    imageUrl={`${adminLoanDetails?.user?.guarantor?.id_card}`}
                                    subTextSpan="Guarantor ID Card"
                                />
                                <OverviewInfo
                                    imageUrl={`${adminLoanDetails?.user?.guarantor?.proof_of_residence}`}
                                    subTextSpan="Proof of residence"
                                />
                                <OverviewInfoVideo
                                    videoUrl={adminLoanDetails?.user?.guarantor?.video}
                                    subTextSpan="Guarantor verification video"
                                />
                            </div>
                        </div>

                        {/* Bank account */}
                        <div className="section_div">
                            <SubSectionHeader
                                headText="Bank account"
                                rule
                                action={
                                    bankStatements ? (
                                        <Link to={`/admin/requests/bank-statement/:id`.replace(':id', loan_id)}>
                                            <Button
                                                text={
                                                    <div className="d-flex align-items-center" style={{ gap: '3px' }}>
                                                        Bank account{' '}
                                                        <svg
                                                            width="22"
                                                            height="19"
                                                            viewBox="0 0 22 19"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M10.9983 0.316406C16.3904 0.316406 20.8764 4.19617 21.8169 9.31641C20.8764 14.4366 16.3904 18.3164 10.9983 18.3164C5.60617 18.3164 1.1202 14.4366 0.179688 9.31641C1.1202 4.19617 5.60617 0.316406 10.9983 0.316406ZM10.9983 16.3164C15.2339 16.3164 18.8583 13.3684 19.7757 9.31641C18.8583 5.26444 15.2339 2.31641 10.9983 2.31641C6.76265 2.31641 3.13827 5.26444 2.22083 9.31641C3.13827 13.3684 6.76265 16.3164 10.9983 16.3164ZM10.9983 13.8164C8.51303 13.8164 6.49831 11.8017 6.49831 9.31641C6.49831 6.83113 8.51303 4.81641 10.9983 4.81641C13.4835 4.81641 15.4983 6.83113 15.4983 9.31641C15.4983 11.8017 13.4835 13.8164 10.9983 13.8164ZM10.9983 11.8164C12.379 11.8164 13.4983 10.6971 13.4983 9.31641C13.4983 7.93571 12.379 6.81641 10.9983 6.81641C9.61765 6.81641 8.49831 7.93571 8.49831 9.31641C8.49831 10.6971 9.61765 11.8164 10.9983 11.8164Z"
                                                                fill="#1A1F4C"
                                                            />
                                                        </svg>
                                                        <svg
                                                            width="22"
                                                            height="20"
                                                            viewBox="0 0 22 20"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M0 12.8164C0 10.488 1.22429 8.44551 3.06426 7.29761C3.56469 3.36041 6.92686 0.316406 11 0.316406C15.0731 0.316406 18.4353 3.36041 18.9357 7.29761C20.7757 8.44551 22 10.488 22 12.8164C22 16.238 19.3562 19.0421 16 19.2975L6 19.3164C2.64378 19.0421 0 16.238 0 12.8164ZM15.8483 17.3032C18.1817 17.1257 20 15.1725 20 12.8164C20 11.2434 19.1884 9.81261 17.8771 8.99451L17.0714 8.49181L16.9517 7.54979C16.5735 4.57444 14.0288 2.31641 11 2.31641C7.97116 2.31641 5.42647 4.57444 5.0483 7.54979L4.92856 8.49181L4.12288 8.99451C2.81156 9.81261 2 11.2434 2 12.8164C2 15.1725 3.81833 17.1257 6.1517 17.3032L6.325 17.3164H15.675L15.8483 17.3032ZM12 10.3164H15L11 15.3164L7 10.3164H10V6.31641H12V10.3164Z"
                                                                fill="#1A1F4C"
                                                            />
                                                        </svg>
                                                    </div>
                                                }
                                                style={{
                                                    background: '#f5a831',
                                                    border: 'none',
                                                    color: '#1a1f4c',
                                                }}
                                            />
                                        </Link>
                                    ) : (
                                        <h5 className="font-weight-bold" style={{ color: 'gray' }}>
                                            No bank statement attached yet
                                        </h5>
                                    )
                                }
                            />
                            <div className="info_div">
                                <OverviewInfo headText={adminLoanDetails?.bank_account?.bvn} subTextSpan="BVN" />
                                <OverviewInfo headText={adminLoanDetails?.bank_account?.nin} subTextSpan="NIN" />
                                <OverviewInfo
                                    headText={adminLoanDetails?.bank_account?.account_name}
                                    subTextSpan="Account name"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.bank_account?.account_number}
                                    subTextSpan="Account number"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.bank_account?.bank_name}
                                    subTextSpan="Bank name"
                                />
                            </div>
                        </div>

                        {/* Employment */}
                        {adminLoanDetails?.employment_details?.length > 0 && (
                            <div className="section_div">
                                <SubSectionHeader headText="Employment" rule />
                                <div className="info_div">
                                    <OverviewInfo
                                        headText={adminLoanDetails?.employment_details?.name}
                                        subTextSpan="Employer name"
                                    />
                                    <OverviewInfo
                                        headText={adminLoanDetails?.employment_details?.email}
                                        subTextSpan="Employer work email"
                                    />
                                    <OverviewInfo
                                        headText={adminLoanDetails?.employment_details?.site}
                                        subTextSpan="Employer website"
                                    />
                                    <OverviewInfo
                                        headText={adminLoanDetails?.employment_details?.address}
                                        subTextSpan="Employer work address"
                                    />
                                    <OverviewInfo
                                        headText={adminLoanDetails?.employment_details?.phone}
                                        subTextSpan="Employer phone number"
                                    />
                                    <OverviewInfo
                                        headText={formatDateInWords(
                                            adminLoanDetails?.employment_details?.resumption_date,
                                        )}
                                        subTextSpan="Date you started work"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Documents */}
                        <div className="section_div">
                            <SubSectionHeader headText="Documents" rule />
                            <div className="info_div image_info_div">
                                <OverviewInfo
                                    imageUrl={`${adminLoanDetails?.documents?.passport_photo}`}
                                    subTextSpan="Passport photograph"
                                />
                                <OverviewInfo
                                    imageUrl={`${adminLoanDetails?.documents?.work_id}`}
                                    subTextSpan="Work ID"
                                />
                                <OverviewInfo
                                    imageUrl={`${adminLoanDetails?.documents?.valid_id}`}
                                    subTextSpan="Valid ID"
                                />
                                <OverviewInfo
                                    imageUrl={`${adminLoanDetails?.documents?.residence_proof}`}
                                    subTextSpan="Proof of residence"
                                />
                            </div>
                        </div>
                        {/* Debit card */}
                        <div className="section_div">
                            <SubSectionHeader headText="Debit card" rule />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={adminLoanDetails?.debit_card?.card_number}
                                    subTextSpan="Card number"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.debit_card?.card_expiry}
                                    subTextSpan="Card expiry"
                                />
                                <OverviewInfo headText={adminLoanDetails?.debit_card?.cvv} subTextSpan="CVV" />
                            </div>
                        </div>
                        {/* Social handles */}
                        <div className="section_div">
                            <SubSectionHeader headText="Social handles" rule />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.social_media_handles?.facebook}
                                    subTextSpan="Facebook"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.social_media_handles?.instagram}
                                    subTextSpan="Instagram"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.social_media_handles?.linkedin}
                                    subTextSpan="LinkedIn"
                                />
                            </div>
                        </div>
                        {/* Address */}
                        <div className="section_div">
                            <SubSectionHeader headText="Home address" rule />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.home_address?.number}
                                    subTextSpan="House number"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.home_address?.street_name}
                                    subTextSpan="Street name"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.home_address?.landmark}
                                    subTextSpan="Closest landmark/bustop"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.home_address?.city}
                                    subTextSpan="City"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.home_address?.local_government}
                                    subTextSpan="Local government area"
                                />
                                <OverviewInfo
                                    headText={adminLoanDetails?.user?.home_address?.state}
                                    subTextSpan="State"
                                />
                            </div>
                        </div>

                        {/* Credit Officer */}
                        <div className="section_div">
                            <SubSectionHeader headText="Credit Officer" rule />
                            <CreditOfficerCard
                                phone={adminLoanDetails?.credit_officer?.phone_number || 'N/A'}
                                name={adminLoanDetails?.credit_officer?.name || 'N/A'}
                            />
                        </div>

                        {/* Lendha Wallet */}
                        <div className="section_div">
                            <SubSectionHeader headText="Lendha Wallet" rule />
                            <LendhaWalletCard
                                account_name={adminLoanDetails?.lendha_wallet?.account_name}
                                account_number={adminLoanDetails?.lendha_wallet?.account_number}
                                bank_name={adminLoanDetails?.lendha_wallet?.bank_name}
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
                    loanAmtRef={registerModifyApp('loan_amount', {
                        required: 'This field is required',
                        valueAsNumber: true,
                    })}
                    loanTermRef={registerModifyApp('loan_term', {
                        required: 'This field is required',
                        valueAsNumber: true,
                    })}
                    errors={errorsModifyApp}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitModifyApp(submitModifyApplication)}
                    disabled={!isValidModifyApp}
                />
            )}

            {modifyLoanPurposeModal && (
                <ModifyLoanPurposeModal
                    isOpen={modifyLoanPurposeModal}
                    closeModal={() => {
                        setModifyLoanPurposeModal(false);
                    }}
                    loan_purposes={loanPurposes}
                    selectRef={registerModifyLoanPurpose('new_loan_purpose_id', {
                        required: 'This field is required',
                        valueAsNumber: true,
                    })}
                    errors={errorsModifyLoanPurpose}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitModifyLoanPurpose(submitModifyLoanPurpose)}
                    disabled={!isValidModifyLoanPurpose}
                />
            )}

            {denyApplicationModal && (
                <DenyApplicationModal
                    isOpen={denyApplicationModal}
                    closeModal={() => {
                        setDenyApplicationModal(false);
                    }}
                    textRef={registerDenial('loan_denial_reason', {
                        required: 'This field is required',
                    })}
                    errors={denialErrors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitDenial(submitUpdateApplicationStatus)}
                    disabled={!isDenialValid}
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
                    onSubmit={handleLoanApproval(submitUpdateApplicationStatus)}
                />
            )}

            {addSubAdminModal && (
                <AddSubadminModal
                    isOpen={addSubAdminModal}
                    selectRef={registerSubadmin('subadmin_id', {
                        required: 'This field is required',
                        valueAsNumber: true,
                    })}
                    closeModal={() => {
                        setAddSubAdminModal(false);
                    }}
                    subadmins={subAdminList}
                    errors={subadminErrors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitRegisterSubadmin(submitAddSubAdmin)}
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
                    onSubmit={completeLoanRequest(submitUpdateApplicationStatus)}
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

export default AdminRequestInfoDetailsPage;
