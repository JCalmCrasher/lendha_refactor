import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

function BusinessInfoModal({
    isOpen,
    closeModal,
    businessNameRef,
    categoryRef,
    emailRef,
    descriptionRef,
    addressNumberRef,
    landmarkRef,
    streetRef,
    cityRef,
    stateRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    return (
        <Modal className="social_handles_modal" isOpen={isOpen}>
            <FormContainer headText="Edit Business Info" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label="Business Name"
                            name="business_name"
                            type="text"
                            inputRef={businessNameRef}
                            readOnly={isSubmitting}
                            error={errors?.business_name}
                            errorMessage={errors?.business_name && errors?.business_name.message}
                        />
                        <FormInput
                            label="Business Category"
                            name="category"
                            type="text"
                            inputRef={categoryRef}
                            readOnly={isSubmitting}
                            error={errors?.category}
                            errorMessage={errors?.category && errors?.category.message}
                        />
                        <FormInput
                            label="Business Email"
                            name="email"
                            type="email"
                            inputRef={emailRef}
                            readOnly={isSubmitting}
                            error={errors?.email}
                            errorMessage={errors?.email && errors?.email.message}
                        />
                        <FormInput
                            label="Description"
                            name="description"
                            type="text"
                            inputRef={descriptionRef}
                            readOnly={isSubmitting}
                            error={errors?.description}
                            errorMessage={errors?.description && errors?.description.message}
                        />
                        <FormInput
                            label="Address Number"
                            name="address_number"
                            type="number"
                            inputRef={addressNumberRef}
                            readOnly={isSubmitting}
                            error={errors?.address_number}
                            errorMessage={errors?.address_number && errors?.address_number.message}
                        />
                        <FormInput
                            label="Street"
                            name="street"
                            type="text"
                            inputRef={streetRef}
                            readOnly={isSubmitting}
                            error={errors?.street}
                            errorMessage={errors?.street && errors?.street.message}
                        />
                        <FormInput
                            label="Landmark"
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

export default BusinessInfoModal;
