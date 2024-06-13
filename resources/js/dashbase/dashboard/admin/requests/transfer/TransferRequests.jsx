/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import '../requests.scss';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'reactstrap';

import FormContainer from '../../../../../components/form-container/form-container';
import ConfirmationModal from '../../../../../components/modal/confirmation-modal';
import Spinner from '../../../../../components/spinner/spinner';
import Status from '../../../../../components/status/status';
import SubSectionHeader from '../../../../../components/sub-section-header/sub-section-header';
import Table from '../../../../../components/table/table';
import TextArea from '../../../../../components/text-area/text-area';
import { formatDateToString, sluggify, statusStyling } from '../../../../../components/utils/helper';
import { getTransferRequests, reviewCustomerTransferRequest } from '../../../../../store/admin/adminSlice';
import Alert from '../../../../../components/alert/alert';
import { closeAlert } from '../../../../../store/components/componentsSlice';

const headers = ['Date', 'Customer name', 'Current C.O', 'New C.O', 'Status', ''];

function TransferRequests() {
    const { isFetching, alert } = useSelector((state) => state.componentsSlice);
    const notification = alert;
    const { transferRequests } = useSelector((state) => state.adminSlice);
    const requests = transferRequests?.data || [];

    const dispatch = useDispatch();

    const {
        register: registerReviewTransfer,
        handleSubmit: handleSubmitReviewTransfer,
        formState: { errors: reviewTransferErrors, isSubmitting: isRequestTransferSubmitting },
    } = useForm({
        mode: 'onChange',
    });

    const [confirmApprovalTransferRequest, setConfirmApprovalTransferRequest] = useState(false);

    const {
        handleSubmit: handleSubmitApprovalRequest,
        formState: { isSubmitting: isTransferRequestSubmitting },
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        dispatch(getTransferRequests());
    }, [dispatch]);

    // const requests = [
    //     {
    //         id: 1,
    //         user_id: 4,
    //         team_lead_id: 3,
    //         old_officer_id: 3,
    //         new_officer_id: 1,
    //         transfer_reason: 'Staff moved to a new branch',
    //         status: 'denied',
    //         denial_reason: 'Test denial reason',
    //         created_at: '2024-04-21T09:11:26.000000Z',
    //         updated_at: '2024-04-21T09:11:26.000000Z',
    //     },
    //     {
    //         id: 2,
    //         user_id: 4,
    //         team_lead_id: 2,
    //         old_officer_id: 3,
    //         new_officer_id: 1,
    //         transfer_reason: 'Staff moved to a new branch',
    //         status: 'denied',
    //         denial_reason: 'Test denial reason',
    //         created_at: '2024-04-21T09:12:35.000000Z',
    //         updated_at: '2024-04-21T09:14:39.000000Z',
    //     },
    //     {
    //         id: 3,
    //         user_id: 4,
    //         team_lead_id: 2,
    //         old_officer_id: 3,
    //         new_officer_id: 1,
    //         transfer_reason: 'Staff moved to a new branch',
    //         status: 'denied',
    //         denial_reason: 'Test denial reason',
    //         created_at: '2024-04-22T08:15:34.000000Z',
    //         updated_at: '2024-04-22T08:15:34.000000Z',
    //     },
    //     {
    //         id: 4,
    //         user_id: 4,
    //         team_lead_id: 3,
    //         old_officer_id: 3,
    //         new_officer_id: 1,
    //         transfer_reason: 'Staff moved to a new branch',
    //         status: 'denied',
    //         denial_reason: 'Test denial reason',
    //         created_at: '2024-04-22T08:17:29.000000Z',
    //         updated_at: '2024-04-22T08:17:29.000000Z',
    //     },
    //     {
    //         id: 5,
    //         user_id: 4,
    //         team_lead_id: 3,
    //         old_officer_id: 3,
    //         new_officer_id: 1,
    //         transfer_reason: 'Staff moved to a new branch',
    //         status: 'pending',
    //         denial_reason: null,
    //         created_at: '2024-04-25T16:30:13.000000Z',
    //         updated_at: '2024-04-25T16:30:13.000000Z',
    //     },
    // ];

    const pendingRequests = requests.filter((request) => request.status === 'pending');
    const approvedRequests = requests.filter((request) => request.status === 'approved');
    const declinedRequests = requests.filter((request) => request.status === 'denied');

    const [transferRequestModal, setTransferRequestModal] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState({});

    const [transferRequestDeclineModal, setTransferRequestDeclineModal] = useState(false);

    const [isApprovingRequestTransfer, setIsApprovingRequestTransfer] = useState(false);
    const approveCustomerTransfer = (request) => {
        setSelectedRequest(() => requests.find((req) => req.id === request));

        setIsApprovingRequestTransfer(true);
        dispatch(reviewCustomerTransferRequest({ user_transfer_id: selectedRequest?.id, status: 1 })).then(() => {
            setIsApprovingRequestTransfer(false);
            dispatch(getTransferRequests());
            setConfirmApprovalTransferRequest(false);
        });
    };

    const declineCustomerTransfer = (data) => {
        dispatch(
            reviewCustomerTransferRequest({
                user_transfer_id: selectedRequest?.id,
                status: 2,
                denial_reason: data.reason,
            }),
        ).then(() => {
            dispatch(getTransferRequests());
            setTransferRequestDeclineModal(false);
        });
    };

    const setTransferRequestToDecline = (request) => {
        setSelectedRequest(() => requests.find((req) => req.id === request));
        setTransferRequestDeclineModal(true);
    };

    const setTransferRequestToApprove = (request) => {
        setSelectedRequest(() => requests.find((req) => req.id === request));

        setConfirmApprovalTransferRequest(true);
    };

    return (
        <>
            {isFetching && <Spinner />}
            <div className="admin_requests_page">
                <Modal isOpen={transferRequestModal}>
                    <FormContainer headText="View Request" rule close={() => setTransferRequestModal(false)}>
                        <Table
                            headers={['Date', 'Customer name', 'Current C.O', 'New C.O', 'Status']}
                            noTableData={false}
                        >
                            <tr>
                                <td>
                                    {(selectedRequest?.created_at && formatDateToString(selectedRequest.created_at)) ||
                                        'N/A'}
                                </td>
                                <td>{selectedRequest?.user_name || 'N/A'}</td>
                                <td>{selectedRequest?.old_officer_name || 'N/A'}</td>
                                <td>{selectedRequest?.new_officer_name || 'N/A'}</td>
                                <td>
                                    <Status
                                        type={statusStyling(selectedRequest?.status)}
                                        text={selectedRequest?.status}
                                    />
                                </td>
                            </tr>
                        </Table>
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
                    <FormContainer headText="Decline Request" rule close={() => setTransferRequestDeclineModal(false)}>
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

                <div className="requests_div">
                    <SubSectionHeader headText="Transfer Request" rule />
                </div>

                <ul className="nav nav-tabs" id="transfer-request-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="pending-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#pending"
                            type="button"
                            role="tab"
                            aria-controls="pending"
                            aria-selected="true"
                        >
                            Pending
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="approved-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#approved"
                            type="button"
                            role="tab"
                            aria-controls="approved"
                            aria-selected="false"
                        >
                            Approved
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="declined-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#declined"
                            type="button"
                            role="tab"
                            aria-controls="declined"
                            aria-selected="false"
                        >
                            Declined
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="all-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#all"
                            type="button"
                            role="tab"
                            aria-controls="all"
                            aria-selected="false"
                        >
                            All
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="transfer-request-tab-content" style={{ marginTop: '32px' }}>
                    <div
                        className="tab-pane fade show active"
                        id="pending"
                        role="tabpanel"
                        aria-labelledby="pending-tab"
                        tabIndex="1"
                    >
                        <Table headers={headers} noTableData={pendingRequests.length === 0}>
                            {pendingRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{formatDateToString(request.created_at)}</td>
                                    <td>{request?.user_name || 'N/A'}</td>
                                    <td>{request?.old_officer_name || 'N/A'}</td>
                                    <td>{request?.new_officer_name || 'N/A'}</td>
                                    <td>
                                        <Status type={statusStyling(request.status)} text={request.status} />
                                    </td>
                                    <td>
                                        <RequestTransferActions
                                            user_id={request?.user_id}
                                            onApprove={() => setTransferRequestToApprove(request?.id)}
                                            onDecline={() => setTransferRequestToDecline(request?.id)}
                                            isApproving={isApprovingRequestTransfer}
                                            showApproveButton={request?.status !== 'approved'}
                                            showDeclineButton={request?.status !== 'denied'}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="approved"
                        role="tabpanel"
                        aria-labelledby="approved-tab"
                        tabIndex="1"
                    >
                        <Table headers={headers} noTableData={approvedRequests.length === 0}>
                            {approvedRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{formatDateToString(request.created_at)}</td>
                                    <td>{request?.user_name || 'N/A'}</td>
                                    <td>{request?.old_officer_name || 'N/A'}</td>
                                    <td>{request?.new_officer_name || 'N/A'}</td>
                                    <td>
                                        <Status type={statusStyling(request.status)} text={request.status} />
                                    </td>
                                    <td>
                                        <RequestTransferActions
                                            user_id={request?.user_id}
                                            onApprove={() => setTransferRequestToApprove(request?.id)}
                                            onDecline={() => setTransferRequestToDecline(request?.id)}
                                            isApproving={isApprovingRequestTransfer}
                                            showApproveButton={false}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="declined"
                        role="tabpanel"
                        aria-labelledby="declined-tab"
                        tabIndex="1"
                    >
                        <Table headers={headers} noTableData={declinedRequests.length === 0}>
                            {declinedRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{formatDateToString(request.created_at)}</td>
                                    <td>{request?.user_name || 'N/A'}</td>
                                    <td>{request?.old_officer_name || 'N/A'}</td>
                                    <td>{request?.new_officer_name || 'N/A'}</td>
                                    <td>
                                        <Status type={statusStyling(request.status)} text={request.status} />
                                    </td>
                                    <td>
                                        <RequestTransferActions
                                            user_id={request?.user_id}
                                            onApprove={() => setTransferRequestToApprove(request?.id)}
                                            onDecline={() => setTransferRequestToDecline(request?.id)}
                                            isApproving={isApprovingRequestTransfer}
                                            showDeclineButton={false}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                    <div className="tab-pane fade" id="all" role="tabpanel" aria-labelledby="all-tab" tabIndex="1">
                        <Table headers={headers} noTableData={requests.length === 0}>
                            {requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{formatDateToString(request.created_at)}</td>
                                    <td>{request?.user_name || 'N/A'}</td>
                                    <td>{request?.old_officer_name || 'N/A'}</td>
                                    <td>{request?.new_officer_name || 'N/A'}</td>
                                    <td>
                                        <Status type={statusStyling(request.status)} text={request.status} />
                                    </td>
                                    <td>
                                        <RequestTransferActions
                                            user_id={request?.user_id}
                                            onApprove={() => setTransferRequestToApprove(request?.id)}
                                            onDecline={() => setTransferRequestToDecline(request?.id)}
                                            isApproving={isApprovingRequestTransfer}
                                            showApproveButton={request?.status !== 'approved'}
                                            showDeclineButton={request?.status !== 'denied'}
                                        />
                                    </td>
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
                    textBeforeLink={notification.message}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}
        </>
    );
}

export default TransferRequests;

function RequestTransferActions({
    // onView,
    onApprove,
    onDecline,
    isApproving = false,
    showApproveButton = true,
    showDeclineButton = true,
    user_id,
}) {
    return (
        <div className="d-flex" style={{ gap: '4px' }}>
            <Link to={`/admin/users/${user_id}`}>
                <button
                    className="button_component btn_blue"
                    type="button"
                    // onClick={onView}
                    style={{
                        border: 'none',
                        background: 'gray',
                    }}
                    title="View Transfer Request"
                >
                    <i className="fa fa-eye" aria-hidden="true" /> View
                </button>
            </Link>
            {showApproveButton && (
                <button
                    className="button_component btn_blue d-flex align-items-center"
                    type="button"
                    onClick={onApprove}
                    disabled={isApproving}
                    title="Approve Transfer Request"
                >
                    <i className="fa fa-check" aria-hidden="true" />
                </button>
            )}
            {showDeclineButton && (
                <button
                    className="button_component btn_blue d-flex align-items-center"
                    style={{
                        background: '#F05757',
                        border: 'none',
                    }}
                    type="button"
                    onClick={onDecline}
                    title="Decline Transfer Request"
                >
                    <i className="fa fa-times" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
