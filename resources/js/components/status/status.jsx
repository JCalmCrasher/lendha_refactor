import React from 'react';

import './status.scss';

function Status({ type, text }) {
    return (
        <div className={`status_div ${type}`}>
            <span className="dot" />
            <p>{text}</p>
        </div>
    );
}

export default Status;
