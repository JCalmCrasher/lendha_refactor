import React from 'react';

import { Modal } from 'reactstrap';

import FormContainer from '../form-container/form-container';

import './modal.scss';

import { SuccessIcon } from '../../assets/icons';

function LoanMessageModal({ isOpen, closeModal }) {
    return (
        <Modal className="social_handles_modal" isOpen={isOpen}>
            <FormContainer headText="Take a new loan" rule close={closeModal}>
                <div className="d-flex justify-content-center">
                    <img src={SuccessIcon} alt="success" />
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <p>Your application has been receieved.</p>
                </div>
                <div className="actions">
                    <button type="button" className="btn_white_blue mx-auto" onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </FormContainer>
        </Modal>
    );
}

export default LoanMessageModal;
