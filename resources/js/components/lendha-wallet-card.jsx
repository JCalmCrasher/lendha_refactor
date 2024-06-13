import React from 'react';

import OverviewInfo from './overview-info/overview-info';

const LendhaWalletCard = ({ account_name, account_number, bank_name }) => {
    return (
        account_name && account_number && bank_name ? (
            <div className="info_div">
                <OverviewInfo headText={account_name} subTextSpan="Wallet Name" />
                <OverviewInfo headText={account_number} subTextSpan="Wallet Number" />
                <OverviewInfo headText={bank_name} subTextSpan="Wallet Provider" />
            </div>
        ) : (
            <div>
                <h6>Wallet not set up</h6>
            </div>
        )
    );
};

export default LendhaWalletCard;
