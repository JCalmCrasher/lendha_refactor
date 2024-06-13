/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { PaystackButton } from 'react-paystack';
import { Modal } from 'reactstrap';

import FormContainer from '../form-container/form-container';
import { formatAmount } from '../utils/helper';

import './modal.scss';

function PaymentModal({
    isOpen,
    headText,
    closeModal,
    amount,
    amountText,
    accountName,
    accountNumber,
    bankName,
    receiptTo,
    config,
}) {
    return (
        <Modal className="loan_repayment_modal" isOpen={isOpen}>
            <FormContainer headText={headText} rule close={closeModal}>
                <div className="form">
                    <div className="content">
                        <div className="info">
                            <p>{amountText}:</p>
                            <h6>{formatAmount(amount)}</h6>
                        </div>

                        <div className="info">
                            <p>Pay via Bank Transfer to:</p>
                            <h6>
                                {accountName}
                                <br />
                                {accountNumber}
                                <br />
                                {bankName}
                            </h6>
                            {receiptTo && (
                                <p>and send a receipt to {receiptTo}</p>
                            )}
                        </div>

                        <p>-- OR --</p>

                        <div className="info">
                            <h6>Pay Online Below</h6>
                            <p className="note">
                                * Online payment attracts a small Payment Processing Fee from our payment provider.
                            </p>
                        </div>
                    </div>
                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <PaystackButton {...config} />
                    </div>
                </div>
            </FormContainer>
        </Modal>
    );
}

export default PaymentModal;
