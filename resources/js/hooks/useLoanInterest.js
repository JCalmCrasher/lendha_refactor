import { useMemo } from 'react';

import { useSelector } from 'react-redux';

export const useLoanInterest = (purpose) => {
    const { loanPurposes } = useSelector((state) => state.loanSlice);

    const loanPurpose = useMemo(() => loanPurposes?.filter((item) => item.id == purpose), [loanPurposes, purpose]);

    return {
        minAmount: loanPurpose ? parseInt(loanPurpose[0]?.minimum_amount) : 0,
        maxAmount: loanPurpose ? parseInt(loanPurpose[0]?.maximum_amount) : 0,
        purpose: loanPurpose ? loanPurpose[0]?.purpose : '',
    };
};
