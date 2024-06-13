/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function UserAccountModal({
    isOpen,
    closeModal,
    passwordRef,
    newPasswordRef,
    confirmPasswordRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    return (
        <Modal className="user_account_modal" isOpen={isOpen}>
            <FormContainer headText="Change Password" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label="Old password"
                            name="old_password"
                            type="password"
                            inputRef={passwordRef}
                            readOnly={isSubmitting}
                            error={errors?.old_password}
                            errorMessage={errors?.old_password && errors?.old_password.message}
                        />
                        <FormInput
                            label="New password"
                            name="password"
                            type="password"
                            inputRef={newPasswordRef}
                            readOnly={isSubmitting}
                            error={errors?.password}
                            errorMessage={errors?.password && errors?.password.message}
                        />
                        <FormInput
                            label="Confirm password"
                            name="password_confirmation"
                            type="password"
                            inputRef={confirmPasswordRef}
                            readOnly={isSubmitting}
                            error={errors?.password_confirmation}
                            errorMessage={errors?.password_confirmation && errors?.password_confirmation.message}
                        />
                    </div>

                    <div className="actions">
                        <p className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </p>
                        <Button text="Submit" loading={isSubmitting} disabled={disabled} />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default UserAccountModal;
