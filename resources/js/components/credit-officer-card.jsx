import React from 'react';

import OverviewInfo from './overview-info/overview-info';

const CreditOfficerCard = ({ name, email, phone, image }) => {
    return (
        <div className="info_div">
            <div style={{ gridColumn: '1 / span 2' }}>
                <div className="row">
                    <div className="col-6">
                        <OverviewInfo shouldImageFallback subTextSpan="Image" sx={{ border: 0 }} />
                    </div>
                </div>
            </div>
            <OverviewInfo headText={name} subTextSpan="Name" />
            {email && <OverviewInfo headText={email} subTextSpan="Email" />}
            {phone && <OverviewInfo headText={phone} subTextSpan="Phone number" />}
        </div>
    );
};

export default CreditOfficerCard;
