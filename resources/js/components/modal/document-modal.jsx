import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function DocumentModal({ isOpen, closeModal, label, name, inputRef, errors, isSubmitting, onSubmit, disabled }) {
    return (
        <Modal className="documents_modal" isOpen={isOpen}>
            <FormContainer headText={`Edit ${label}`} rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label={label}
                            name={name}
                            type="file"
                            accept="image/jpeg,image/png,application/pdf"
                            inputRef={inputRef}
                            readOnly={isSubmitting}
                            error={errors}
                            errorMessage={errors && errors?.message}
                        />
                    </div>

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <Button text="Submit" loading={isSubmitting} disabled={disabled} />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default DocumentModal;
