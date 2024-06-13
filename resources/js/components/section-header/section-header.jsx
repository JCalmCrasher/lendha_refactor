import React from 'react';

import './section-header.scss';

const SectionHeader = ({ headText, firstSubText, secondSubText, header2 = false }) => {
    return (
        <div className="section_header">
            {header2 ? <h2>{headText}</h2> : <h1>{headText}</h1>}
            <h6>{firstSubText}</h6>
            <h6>{secondSubText}</h6>
        </div>
    );
};

export default SectionHeader;
