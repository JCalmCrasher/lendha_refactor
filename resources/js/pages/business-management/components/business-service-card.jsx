import React from 'react';

export function BusinessServiceCard({ icon, title, description }) {
    return (
        <div className="business-management" style={{ backgroundColor: '#FFCE7030', padding: '20px' }}>
            <div className="business-management__icon">{icon}</div>
            <h3 className="business-management__title">{title}</h3>
            <p className="business-management__desc">{description}</p>
        </div>
    );
}

export default BusinessServiceCard;
