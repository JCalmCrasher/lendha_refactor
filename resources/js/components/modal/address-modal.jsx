import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function AddressModal({
    isOpen,
    closeModal,
    numberRef,
    street_nameRef,
    landmarkRef,
    cityRef,
    local_governmentRef,
    stateRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    return (
        <Modal className="address_modal" isOpen={isOpen}>
            <FormContainer headText="Edit Home Address" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label="House number"
                            name="number"
                            type="number"
                            inputRef={numberRef}
                            readOnly={isSubmitting}
                            error={errors?.number}
                            errorMessage={errors?.number && errors?.number.message}
                        />
                        <FormInput
                            label="Street name"
                            name="street_name"
                            type="text"
                            inputRef={street_nameRef}
                            readOnly={isSubmitting}
                            error={errors?.street_name}
                            errorMessage={errors?.street_name && errors?.street_name.message}
                        />
                        <FormInput
                            label="Closest landmark/bustop"
                            name="landmark"
                            type="text"
                            inputRef={landmarkRef}
                            readOnly={isSubmitting}
                            error={errors?.landmark}
                            errorMessage={errors?.landmark && errors?.landmark.message}
                        />
                        <FormInput
                            label="City"
                            name="city"
                            type="text"
                            inputRef={cityRef}
                            readOnly={isSubmitting}
                            error={errors?.city}
                            errorMessage={errors?.city && errors?.city.message}
                        />
                        <FormInput
                            label="Local government area"
                            name="local_government"
                            type="text"
                            inputRef={local_governmentRef}
                            readOnly={isSubmitting}
                            error={errors?.local_government}
                            errorMessage={errors?.local_government && errors?.local_government.message}
                        />
                        <FormInput
                            label="State"
                            name="state"
                            type="text"
                            inputRef={stateRef}
                            readOnly={isSubmitting}
                            error={errors?.state}
                            errorMessage={errors?.state && errors?.state.message}
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

export default AddressModal;
