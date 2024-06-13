import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';

import './modal.scss';

function ConfirmationModal({ isOpen, closeModal, text, isSubmitting, onSubmit }) {
    return (
        <Modal className="auto_deny_modal" isOpen={isOpen}>
            <FormContainer headText="Confirmation" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <p>{text}</p>

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <Button text="Submit" loading={isSubmitting} />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default ConfirmationModal;
