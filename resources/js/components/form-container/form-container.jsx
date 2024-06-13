import React from 'react';

import SubSectionHeader from '../sub-section-header/sub-section-header';

import './form-container.scss';

function FormContainer({ headText, subText, id = '', rule = true, close, children }) {
    return (
        <div className="form_container" id={id}>
            <img
                className="border_image"
                src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1610021691/Lendha/line_b_y_b_whhw8x.png"
                alt="divider"
            />
            <div className="form_container_body">
                <SubSectionHeader headText={headText} rule={rule} close={close} />
                {subText && <p className="sub_text">{subText}</p>}

                {children}
            </div>
        </div>
    );
}

export default FormContainer;
