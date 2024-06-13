import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';

import './modal.scss';

import FormSelect from '../form-select/form-select';

function AddSubadminModal({ isOpen, closeModal, selectRef, subadmins, errors, isSubmitting, onSubmit }) {
    return (
        <Modal className="auto_deny_modal" isOpen={isOpen}>
            <FormContainer headText="Add Sub-Admin" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <FormSelect
                        selectRef={selectRef}
                        name="subadmin_id"
                        label="Subadmin"
                        options={subadmins.map((item) => ({
                            value: item.id,
                            name: item.name,
                        }))}
                        error={errors?.subadmin_id}
                        errorMessage={errors?.subadmin_id && errors?.subadmin_id.message}
                    />

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

export default AddSubadminModal;
