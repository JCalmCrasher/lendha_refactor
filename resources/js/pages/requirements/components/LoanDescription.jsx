import React from 'react';

export default function LoanDescription({ descTitle = 'Who is it for?', loanFor, children }) {
    return (
        <>
            <h5>{descTitle}</h5>
            <p>{loanFor}</p>
            {children}
        </>
    );
}
