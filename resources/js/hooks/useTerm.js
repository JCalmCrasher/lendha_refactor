/* eslint-disable eqeqeq */
import { useMemo } from 'react';

export const useTerm = (loanPurpose) => {
    const loanTerms = useMemo(() => {
        if (loanPurpose == '4') {
            // loan terms for weekly loan
            return new Array(4).fill(0).map((_, i) => ({
                value: i + 1,
                name: (i + 1).toString(),
            }));
        }
        if (loanPurpose == '5') {
            // loan terms for daily loan
            return new Array(30).fill(0).map((_, i) => ({
                value: i + 1,
                name: (i + 1).toString(),
            }));
        }
        // loan terms for monthly loan
        return new Array(6).fill(0).map((_, i) => ({
            value: i + 1,
            name: (i + 1).toString(),
        }));
    }, [loanPurpose]);

    return { loanTerms };
};
