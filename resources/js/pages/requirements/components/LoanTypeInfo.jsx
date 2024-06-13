import React from 'react';

import { formatAmount } from '../../../components/utils/helper';

export default function LoanTypeInfo({ loanType, rate, minAmount, maxAmount }) {
    return (
        <>
            <h6>{loanType.toUpperCase()}</h6>
            <table>
                <thead>
                    <tr>
                        <th>Rate</th>
                        <th>{rate}%</th>
                    </tr>
                    <tr>
                        <th>Minimum Amount</th>
                        <th>{formatAmount(minAmount)}</th>
                    </tr>
                    <tr>
                        <th>Maximum Amount</th>
                        <th>{formatAmount(maxAmount)}</th>
                    </tr>
                </thead>
            </table>
        </>
    );
}
