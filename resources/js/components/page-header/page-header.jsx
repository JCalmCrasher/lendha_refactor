import React from 'react';

import './page-header.scss';

const PageHeader = ({ className, headerText }) => (
    <div className={`section page_header_container ${className}`}>
        <h1>{headerText}</h1>
        {className === 'dark' && (
            <img
                src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1609945490/Lendha/line_w_y_w_emou5w.png"
                alt="divider"
            />
        )}
        {className === 'light' && (
            <img
                src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1610021691/Lendha/line_b_y_b_whhw8x.png"
                alt="divider"
            />
        )}
    </div>
);

export default PageHeader;
