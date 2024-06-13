import React from 'react';

function BusinessFeaturesCard({ icon, title, description }) {
    return (
        <div className="text-center">
            <div className="d-flex" style={{ marginBottom: '20px' }}>
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default BusinessFeaturesCard;
