/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';

import './modal.scss';

import { businessRegistered } from '../../store/user/userSlice';
import FormSelect from '../form-select/form-select';

function BusinessRegStatusModal({
    isOpen,
    closeModal,
    businessRegNumberRef,
    businessNameRef,
    businessTypeRef,
    regStatusRef,
    cacRef,
    errors,
    isSubmitting,
    onSubmit,
    disabled,
}) {
    const dispatch = useDispatch();

    const { isBusinessRegistered, userDashboardDetails } = useSelector((state) => state.userSlice);
    const busReg = userDashboardDetails?.user?.business;
    const busRegStatus = busReg?.registration_status;

    useEffect(() => {
        if (busRegStatus) {
            dispatch(businessRegistered(!!busRegStatus));
        }
    }, [busRegStatus, dispatch]);

    return (
        <Modal isOpen={isOpen}>
            <FormContainer headText="Edit Business Status Info" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit} encType="multipart/form-data">
                    <div className="grid_div">
                        {!busRegStatus && (
                            <div>
                                <label>Are you registered? {busRegStatus}</label>
                            </div>
                        )}
                        {!busRegStatus && (
                            <>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="yes"
                                        id="yes"
                                        // ref={regStatusRef}
                                        {...regStatusRef}
                                        name="regStatus"
                                        onChange={() => dispatch(businessRegistered(true))}
                                    />
                                    <label className="form-check-label" htmlFor="yes">
                                        Registered
                                    </label>
                                </div>

                                <div className="form-check form-check-inline mb-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="no"
                                        id="no"
                                        // ref={regStatusRef}
                                        {...regStatusRef}
                                        name="regStatus"
                                        onChange={() => dispatch(businessRegistered(false))}
                                    />
                                    <label className="form-check-label" htmlFor="no">
                                        Unregistered
                                    </label>
                                </div>
                            </>
                        )}

                        {errors?.regStatus && (
                            <div>
                                <span>* {errors?.regStatus.message}</span>
                            </div>
                        )}

                        {isBusinessRegistered && (
                            <>
                                <FormInput
                                    label="Business Name"
                                    name="businessName"
                                    type="text"
                                    inputRef={businessNameRef}
                                    readOnly={isSubmitting}
                                    error={errors?.businessName}
                                    errorMessage={errors?.businessName && errors?.businessName.message}
                                />
                                <FormSelect
                                    label="Business Type"
                                    name="businessType"
                                    selectRef={businessTypeRef}
                                    options={[
                                        { value: '', name: 'Select Business Type' },
                                        { value: 'RC', name: 'RC' },
                                        { value: 'BN', name: 'BN' },
                                        { value: 'LLP', name: 'LLP' },
                                        { value: 'LP', name: 'LP' },
                                        { value: 'IT', name: 'IT' },
                                    ]}
                                    error={errors?.businessType}
                                    errorMessage={errors?.businessType && errors?.businessType.message}
                                />
                                {/* <FormInput
                                    label="Business Type"
                                    name="businessType"
                                    type="text"
                                    inputRef={businessTypeRef}
                                    readOnly={isSubmitting}
                                    error={errors?.businessType}
                                    errorMessage={errors?.businessType && errors?.businessType.message}
                                /> */}
                                <FormInput
                                    label="Registration Number"
                                    name="businessRegNumber"
                                    type="text"
                                    inputRef={businessRegNumberRef}
                                    readOnly={isSubmitting}
                                    error={errors?.businessRegNumber}
                                    errorMessage={errors?.businessRegNumber && errors?.businessRegNumber.message}
                                    placeholder="e.g 123456"
                                />

                                <FormInput
                                    label="CAC Document"
                                    name="cac_doc"
                                    type="file"
                                    accept="image/jpeg,image/png,application/pdf"
                                    inputRef={cacRef}
                                    readOnly={isSubmitting}
                                    error={errors?.cac_doc}
                                    errorMessage={errors?.cac_doc && errors?.cac_doc.message}
                                />
                            </>
                        )}
                    </div>

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        {isBusinessRegistered ? (
                            <Button text="Submit" loading={isSubmitting} disabled={disabled} />
                        ) : (
                            <button type="button" className="button_component btn_blue" onClick={closeModal}>
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default BusinessRegStatusModal;
