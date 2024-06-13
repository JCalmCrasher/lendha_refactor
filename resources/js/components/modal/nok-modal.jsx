import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function NokModal({
    isOpen,
    closeModal,
    nameRef,
    addressRef,
    phoneNumberRef,
    emailRef,
    relationshipRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    return (
        <Modal className="guarantor_modal" isOpen={isOpen}>
            <FormContainer headText="Edit Next of Kin" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <FormInput
                        label="Next of Kin's name"
                        name="nokName"
                        type="text"
                        inputRef={nameRef}
                        readOnly={isSubmitting}
                        error={errors?.nokName}
                        errorMessage={errors?.nokName && errors?.nokName.message}
                    />
                    <FormInput
                        label="Next of Kin's email"
                        name="nokEmail"
                        inputRef={emailRef}
                        readOnly={isSubmitting}
                        error={errors?.nokEmail}
                        errorMessage={errors?.nokEmail && errors?.nokEmail.message}
                    />
                    <FormInput
                        label="Next of Kin's phone"
                        name="nokPhone"
                        type="number"
                        inputRef={phoneNumberRef}
                        readOnly={isSubmitting}
                        error={errors?.nokPhone}
                        errorMessage={errors?.nokPhone && errors?.nokPhone.message}
                    />
                    <FormInput
                        label="Next of Kin's address"
                        name="nokAddress"
                        type="text"
                        inputRef={addressRef}
                        readOnly={isSubmitting}
                        error={errors?.nokAddress}
                        errorMessage={errors?.nokAddress && errors?.nokAddress.message}
                    />
                    <FormInput
                        label="Relationship"
                        name="nokRelationship"
                        type="text"
                        placeholder="Father, mother, son, etc"
                        inputRef={relationshipRef}
                        readOnly={isSubmitting}
                        error={errors?.nokRelationship}
                        errorMessage={errors?.nokRelationship && errors?.nokRelationship.message}
                    />

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

export default NokModal;
