import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Modal } from 'reactstrap';

import { URL } from '../../../../api';
import Alert from '../../../../components/alert/alert';
import Button from '../../../../components/button/button';
import Loader from '../../../../components/loader/loader';
import OverviewInfo from '../../../../components/overview-info/overview-info';
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
import { getSubAdminList } from '../../../../store/loan/loanSlice';

import '../request-info/request-info.scss';

import PencilIcon from '../../../../assets/icons/pencil.icon';
import FormContainer from '../../../../components/form-container/form-container';
import FormInput from '../../../../components/form-input/form-input';
import LendhaWalletCard from '../../../../components/lendha-wallet-card';
import ConfirmationModal from '../../../../components/modal/confirmation-modal';
import Table from '../../../../components/table/table';
import TextArea from '../../../../components/text-area/text-area';
import { reviewCustomerTransferRequest } from '../../../../store/admin/adminSlice';
import { getUserProfileInfo, updateUserProfile } from '../../../../store/user/userSlice';

function AdminUserInfoPage() {
    const { user_id } = useParams();
    const query = new URLSearchParams(useLocation().search);
    const loan_detail_id = query.get('id');

    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const [userProfileDetails, setUserProfileDetails] = useState(null);
    // const { userProfileDetails } = state.userSlice

    const { adminLoanDetails } = useSelector((state) => state.loanSlice);

    const business = userProfileDetails?.business;
    const busReg = business?.business_registration;
    const isSubmitting = isLoading;
    const notification = alert;
    const [customerProfileEditModal, setCustomerProfileEditModal] = useState(false);
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
        dispatch(getUserProfileInfo(user_id)).then((data) => {
            setUserProfileDetails(data);
        });
        dispatch(getSubAdminList());

        return function cleanup() {
            dispatch(closeAlert());
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const getUserLoanInfo = () => {};

    const submitCustomerProfile = (data) => {
        const userId = userProfileDetails.id;
        if (userId && data.full_name) {
            const userPayload = { user_id: userId, user_name: data.full_name };
            dispatch(updateUserProfile(userPayload)).then((res) => {
                if (res?.status === successStatusCode) {
                    setCustomerProfileEditModal(false);
                    dispatch(getUserProfileInfo(user_id)).then((_data) => {
                        setUserProfileDetails(_data);
                    });
                }
            });
        }
    };

    const {
        register: registerReviewTransfer,
        handleSubmit: handleSubmitReviewTransfer,
        formState: { errors: reviewTransferErrors, isSubmitting: isRequestTransferSubmitting },
    } = useForm({
        mode: 'onChange',
    });

    const [transferRequestDeclineModal, setTransferRequestDeclineModal] = useState(false);
    const [confirmApprovalTransferRequest, setConfirmApprovalTransferRequest] = useState(false);

    const transferRequestDetails = userProfileDetails?.user_transfers?.[0];
    const transferRequestStatus = transferRequestDetails?.status;
    const oldLoanOfficer = transferRequestDetails?.old_officer_name || 'N/A';
    const newLoanOfficer = transferRequestDetails?.new_officer_name || 'N/A';

    const [isApprovingRequestTransfer, setIsApprovingRequestTransfer] = useState(false);
    const approveCustomerTransfer = () => {
        setIsApprovingRequestTransfer(true);
        dispatch(reviewCustomerTransferRequest({ user_transfer_id: transferRequestDetails?.id, status: 1 })).then(
            () => {
                setIsApprovingRequestTransfer(false);
                dispatch(getUserProfileInfo(user_id)).then((data) => {
                    setUserProfileDetails(data);
                });
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
            dispatch(getUserProfileInfo(user_id)).then((data) => {
                setUserProfileDetails(data);
            });
            setTransferRequestDeclineModal(false);
        });
    };

    const {
        handleSubmit: handleSubmitApprovalRequest,
        formState: { isSubmitting: isTransferRequestSubmitting },
    } = useForm({
        mode: 'onChange',
    });

    return (
        <>
            <div className="admin_request_info_page">
                {isFetching ? (
                    <Loader color="blue" />
                ) : !userProfileDetails || Object.values(userProfileDetails)?.length === 0 ? (
                    <div className="incomplete_profile">User has not completed profile</div>
                ) : (
                    <>
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

                        <ConfirmationModal
                            isOpen={confirmApprovalTransferRequest}
                            closeModal={() => {
                                setConfirmApprovalTransferRequest(false);
                            }}
                            text="Proceed to APPROVE this transfer request?"
                            isSubmitting={isTransferRequestSubmitting}
                            onSubmit={handleSubmitApprovalRequest(approveCustomerTransfer)}
                        />

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
                            {transferRequestStatus === 'pending' && (
                                <div
                                    style={{
                                        marginBottom: '14px',
                                        marginTop: '14px',
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
                            <SubSectionHeader
                                headText="Customer profile"
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
                                        userProfileDetails
                                            ? `${URL.baseURL}/${userProfileDetails?.documents?.passport_photo}`
                                            : ''
                                    }
                                    className="user_img"
                                    alt="passport"
                                />
                                <div className="group">
                                    <p className="label">PROFILE STATUS:</p>
                                    <Status
                                        type={statusStyling(userProfileDetails.profile_status)}
                                        text={userProfileDetails.profile_status}
                                    />
                                </div>
                            </div>
                            <div className="info_div">
                                <OverviewInfo headText={userProfileDetails.name} subTextSpan="Full name" />
                                <OverviewInfo headText={userProfileDetails.email} subTextSpan="Email address" />
                                <OverviewInfo headText={userProfileDetails.phone_number} subTextSpan="Phone number" />
                                <OverviewInfo
                                    headText={formatDateInWords(userProfileDetails.date_of_birth)}
                                    subTextSpan="Date of birth"
                                />
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
                                                    <td>{loan?.team_lead_denial_reason || 'N/A'}</td>
                                                    <td>{loan?.loan_denial_reason || 'N/A'}</td>
                                                    <td>{formatAmount(loan.amount)}</td>
                                                    <td>{formatDateToString(loan.request_date)}</td>
                                                </tr>
                                            ))}
                                    </>
                                )}
                            </Table>
                        </div>

                        {/* Guarantor */}
                        <div className="section_div">
                            <SubSectionHeader headText="Guarantor" rule />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={userProfileDetails.next_of_kin?.name}
                                    subTextSpan="Guarantor name"
                                />
                                <OverviewInfo
                                    headText={userProfileDetails.next_of_kin?.phone}
                                    subTextSpan="Guarantor phone number"
                                />
                                <OverviewInfo
                                    headText={userProfileDetails.next_of_kin?.address}
                                    subTextSpan="Guarantor address"
                                />
                                <OverviewInfo
                                    headText={userProfileDetails.next_of_kin?.relationship}
                                    subTextSpan="Relationship with you"
                                />
                            </div>
                        </div>
                        {/* Bank account */}
                        <div className="section_div">
                            <SubSectionHeader headText="Bank account" rule />
                            <div className="info_div">
                                <OverviewInfo headText={userProfileDetails?.bank?.bvn} subTextSpan="BVN" />
                                <OverviewInfo headText={userProfileDetails?.bank?.nin} subTextSpan="NIN" />
                                <OverviewInfo
                                    headText={userProfileDetails?.bank?.account_name}
                                    subTextSpan="Account name"
                                />
                                <OverviewInfo
                                    headText={userProfileDetails?.bank?.account_number}
                                    subTextSpan="Account number"
                                />
                                <OverviewInfo headText={userProfileDetails?.bank?.bank_name} subTextSpan="Bank name" />
                            </div>
                        </div>

                        {/* Employment */}
                        {userProfileDetails?.employment?.length > 0 && (
                            <div className="section_div">
                                <SubSectionHeader headText="Employment" rule />
                                <div className="info_div">
                                    <OverviewInfo
                                        headText={userProfileDetails?.employment?.name}
                                        subTextSpan="Employer name"
                                    />
                                    <OverviewInfo
                                        headText={userProfileDetails?.employment?.email}
                                        subTextSpan="Employer work email"
                                    />
                                    <OverviewInfo
                                        headText={userProfileDetails?.employment?.site}
                                        subTextSpan="Employer website"
                                    />
                                    <OverviewInfo
                                        headText={userProfileDetails?.employment?.address}
                                        subTextSpan="Employer work address"
                                    />
                                    <OverviewInfo
                                        headText={userProfileDetails?.employment?.phone}
                                        subTextSpan="Employer phone number"
                                    />
                                    <OverviewInfo
                                        headText={formatDateInWords(userProfileDetails?.employment?.resumption_date)}
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
                                    imageUrl={`${userProfileDetails?.documents?.passport_photo}`}
                                    subTextSpan="Passport photograph"
                                />
                                <OverviewInfo
                                    imageUrl={`${userProfileDetails?.documents?.work_id}`}
                                    subTextSpan="Work ID"
                                />
                                <OverviewInfo
                                    imageUrl={`${userProfileDetails?.documents?.valid_id}`}
                                    subTextSpan="Valid ID"
                                />
                                <OverviewInfo
                                    imageUrl={`${userProfileDetails?.documents?.residence_proof}`}
                                    subTextSpan="Proof of residence"
                                />
                            </div>
                        </div>
                        {/* Debit card */}
                        {/* <div className="section_div">
                          <SubSectionHeader headText="Debit card" rule />
                          <div className="info_div">
                              <OverviewInfo
                                  headText={
                                      userProfileDetails?.cards?.card_number
                                  }
                                  subTextSpan="Card number"
                              />
                              <OverviewInfo
                                  headText={
                                      userProfileDetails?.cards?.card_expiry
                                  }
                                  subTextSpan="Card expiry"
                              />
                              <OverviewInfo
                                  headText={userProfileDetails?.cards?.cvv}
                                  subTextSpan="CVV"
                              />
                          </div>
                      </div> */}
                        {/* Social handles */}
                        <div className="section_div">
                            <SubSectionHeader headText="Social handles" rule />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={userProfileDetails?.social_media_handles?.facebook}
                                    subTextSpan="Facebook"
                                />
                                <OverviewInfo
                                    headText={userProfileDetails?.social_media_handles?.instagram}
                                    subTextSpan="Instagram"
                                />
                                <OverviewInfo
                                    headText={userProfileDetails?.social_media_handles?.linkedin}
                                    subTextSpan="LinkedIn"
                                />
                            </div>
                        </div>
                        {/* Address */}
                        <div className="section_div">
                            <SubSectionHeader headText="Home address" rule />
                            <div className="info_div">
                                <OverviewInfo
                                    headText={userProfileDetails.home_address?.number}
                                    subTextSpan="House number"
                                />
                                <OverviewInfo
                                    headText={userProfileDetails.home_address?.street_name}
                                    subTextSpan="Street name"
                                />
                                <OverviewInfo
                                    headText={userProfileDetails.home_address?.landmark}
                                    subTextSpan="Closest landmark/bustop"
                                />
                                <OverviewInfo headText={userProfileDetails.home_address?.city} subTextSpan="City" />
                                <OverviewInfo
                                    headText={userProfileDetails.home_address?.local_government}
                                    subTextSpan="Local government area"
                                />
                                <OverviewInfo headText={userProfileDetails.home_address?.state} subTextSpan="State" />
                            </div>
                        </div>

                        {/* Lendha Wallet */}
                        <div className="section_div">
                            <SubSectionHeader headText="Lendha Wallet" rule />
                            <LendhaWalletCard
                                account_name={userProfileDetails?.account?.account_name}
                                account_number={userProfileDetails?.account?.account_number}
                                bank_name={userProfileDetails?.account?.bank_name}
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
        </>
    );
}

export default AdminUserInfoPage;
