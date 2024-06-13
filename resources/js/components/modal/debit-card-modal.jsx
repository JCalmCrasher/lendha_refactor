import React from 'react';

import { PaystackButton } from 'react-paystack';
import { Modal } from 'reactstrap';

import FormContainer from '../form-container/form-container';

import './modal.scss';

const DebitCardModal = ({ isOpen, closeModal, config }) => (
    <Modal className="debit_card_modal" isOpen={isOpen}>
        <FormContainer headText="Edit Debit Card" rule close={closeModal}>
            <div className="form">
                <PaystackButton {...config} />
            </div>
        </FormContainer>
    </Modal>
);

export default DebitCardModal;
