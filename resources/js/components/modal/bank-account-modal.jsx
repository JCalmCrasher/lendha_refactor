import React from 'react';

import { Modal } from 'reactstrap';

import Button from '../button/button';
import FormContainer from '../form-container/form-container';
import FormInput from '../form-input/form-input';
import FormSelect from '../form-select/form-select';

import './modal.scss';

function BankAccountModal({
    isOpen,
    closeModal,
    bankAccountList,
    accountName,
    bvnRef,
    ninRef,
    selectRef,
    accountNumberRef,
    accountNameRef,
    errors,
    isSubmitting,
    onSubmit,
}) {
    return (
        <Modal className="bank_account_modal" isOpen={isOpen}>
            <FormContainer headText="Edit Bank Account" rule close={closeModal}>
                <form className="form" onSubmit={onSubmit}>
                    <div className="grid_div">
                        <FormInput
                            label="BVN"
                            name="bvn"
                            type="number"
                            inputRef={bvnRef}
                            readOnly={isSubmitting}
                            error={errors?.bvn}
                            errorMessage={errors?.bvn && errors?.bvn.message}
                        />
                        <FormInput
                            label="NIN"
                            name="nin"
                            type="number"
                            inputRef={ninRef}
                            readOnly={isSubmitting}
                            error={errors?.nin}
                            errorMessage={errors?.nin && errors?.nin.message}
                        />
                        <FormSelect
                            label="Bank name"
                            name="bank_code"
                            selectRef={selectRef}
                            options={bankAccountList || []}
                            readOnly={isSubmitting}
                            error={errors?.bank_code}
                            errorMessage={errors?.bank_code && errors?.bank_code.message}
                        />
                        <FormInput
                            label="Account number"
                            name="account_number"
                            type="number"
                            inputRef={accountNumberRef}
                            readOnly={accountName.fetching || isSubmitting}
                            error={errors?.account_number}
                            errorMessage={errors?.account_number && errors?.account_number.message}
                        />
                        {accountName.fetching && <p className="note">Loading... Please wait</p>}
                        <FormInput
                            label="Account Name"
                            name="account_name"
                            type="text"
                            value={accountName?.value}
                            // inputRef={accountNameRef}
                            readOnly
                            error={errors?.account_name}
                            errorMessage={errors?.account_name && errors?.account_name.message}
                        />
                    </div>

                    <div className="actions">
                        <button type="button" className="btn_white_blue" onClick={closeModal}>
                            Cancel
                        </button>
                        <Button
                            text="Submit"
                            loading={isSubmitting}
                            disabled={!accountName.value || errors?.bvn || errors?.nin}
                        />
                    </div>
                </form>
            </FormContainer>
        </Modal>
    );
}

export default BankAccountModal;
