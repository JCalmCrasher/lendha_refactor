import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function GuarantorModal({
    isOpen,
    closeModal,
    nameRef,
    addressRef,
    phoneNumberRef,
    businessTypeRef,
    guarantorFacePhoto,
    businessAddressRef,
    relationshipRef,
    guarantorIdCard,
    guarantorProofOfResidence,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    return (
        <Modal className="guarantor_modal" isOpen={isOpen}>
            <FormContainer headText="Edit Guarantor" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <FormInput
                        label="Guarantor's name"
                        name="name"
                        type="text"
                        inputRef={nameRef}
                        readOnly={isSubmitting}
                        error={errors?.name}
                        errorMessage={errors?.name && errors?.name.message}
                    />
                    <FormInput
                        label="Guarantor's phone"
                        name="phone"
                        type="number"
                        inputRef={phoneNumberRef}
                        readOnly={isSubmitting}
                        error={errors?.phone}
                        errorMessage={errors?.phone && errors?.phone.message}
                    />
                    <FormInput
                        label="Guarantor's address"
                        name="address"
                        type="text"
                        inputRef={addressRef}
                        readOnly={isSubmitting}
                        error={errors?.address}
                        errorMessage={errors?.address && errors?.address.message}
                    />
                    <FormInput
                        label="Guarantor's face photo"
                        name="guarantors_face_photo"
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        inputRef={guarantorFacePhoto}
                        readOnly={isSubmitting}
                        error={errors}
                        errorMessage={errors && errors?.guarantors_face_photo}
                    />
                    <FormInput
                        label="Id card"
                        name="id_card"
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        inputRef={guarantorIdCard}
                        readOnly={isSubmitting}
                        error={errors}
                        errorMessage={errors && errors?.id_card}
                    />
                    <FormInput
                        label="Proof of residence"
                        name="proof_of_residence"
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        inputRef={guarantorProofOfResidence}
                        readOnly={isSubmitting}
                        error={errors}
                        errorMessage={errors && errors?.proof_of_residence}
                    />
                    <FormInput
                        label="Nature of business"
                        name="business_type"
                        type="text"
                        inputRef={businessTypeRef}
                        readOnly={isSubmitting}
                        error={errors?.business_type}
                        errorMessage={errors?.business_type && errors?.business_type.message}
                    />
                    <FormInput
                        label="Business address"
                        name="business_address"
                        type="text"
                        inputRef={businessAddressRef}
                        readOnly={isSubmitting}
                        error={errors?.business_address}
                        errorMessage={errors?.business_address && errors?.business_address.message}
                    />
                    <FormInput
                        label="Relationship"
                        name="relationship"
                        type="text"
                        placeholder="Father, mother, son, etc"
                        inputRef={relationshipRef}
                        readOnly={isSubmitting}
                        error={errors?.relationship}
                        errorMessage={errors?.relationship && errors?.relationship.message}
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

export default GuarantorModal;
