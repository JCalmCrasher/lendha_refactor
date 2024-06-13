import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function SocialHandlesModal({
    isOpen,
    closeModal,
    facebookRef,
    instagramRef,
    linkedInRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    return (
        <Modal className="social_handles_modal" isOpen={isOpen}>
            <FormContainer headText="Edit Social Handles" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <FormInput
                        label="Facebook"
                        name="facebook"
                        type="url"
                        placeholder="e.g: https://www.facebook.com/myprofile"
                        inputRef={facebookRef}
                        readOnly={isSubmitting}
                        error={errors?.facebook}
                        errorMessage={errors?.facebook && errors?.facebook.message}
                    />
                    <FormInput
                        label="Instagram"
                        name="instagram"
                        type="url"
                        placeholder="e.g: https://www.instagram.com/myprofile"
                        inputRef={instagramRef}
                        readOnly={isSubmitting}
                        error={errors?.instagram}
                        errorMessage={errors?.instagram && errors?.instagram.message}
                    />
                    <FormInput
                        label="LinkedIn"
                        name="linkedin"
                        type="url"
                        placeholder="e.g: https://www.linkedin.com/myprofile"
                        inputRef={linkedInRef}
                        readOnly={isSubmitting}
                        error={errors?.linkedin}
                        errorMessage={errors?.linkedin && errors?.linkedin.message}
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

export default SocialHandlesModal;
