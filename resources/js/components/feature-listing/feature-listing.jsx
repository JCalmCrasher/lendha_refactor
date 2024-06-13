import React from 'react';

import './feature-listing.scss';

const FeatureListing = ({ features }) => {
    return (
        <div className="feature_listing">
            {features.map((feature, i) => (
                <div key={i} className="feature">
                    <img src={feature.icon} className="feature_icon" alt="Lendha features" />
                    {feature.headText && <h5>{feature.headText}</h5>}
                    {feature.midText && <h6>{feature.midText}</h6>}
                    {feature.subText && <p>{feature.subText}</p>}
                </div>
            ))}
        </div>
    );
};

export default FeatureListing;
