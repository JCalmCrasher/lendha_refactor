import React from 'react';

import { Modal } from 'reactstrap';

import FormContainer from '../form-container/form-container';
import { formatAmount } from '../utils/helper';

import './modal.scss';

const FoodPackageModal = ({ isOpen, closeModal, selectedPackage, onClick, disabled }) => (
    <Modal className="food_package_modal" isOpen={isOpen}>
        <FormContainer
            headText={`${selectedPackage.name + ` @ ` + formatAmount(selectedPackage.price)}`}
            rule
            close={closeModal}
        >
            <div className="items">
                {selectedPackage &&
                    selectedPackage.items.map((item, i) => (
                        <p key={i} className="item">
                            {item}
                        </p>
                    ))}
            </div>

            <div className="actions">
                <button className="btn_white_blue" onClick={closeModal}>
                    Cancel
                </button>
                <button className="btn_blue" onClick={onClick} disabled={disabled}>
                    Proceed
                </button>
            </div>
        </FormContainer>
    </Modal>
);

export default React.memo(FoodPackageModal);
