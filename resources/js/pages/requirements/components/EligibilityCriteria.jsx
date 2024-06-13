import React from 'react';

export default function EligibilityCriteria({ title, criterias }) {
    return (
        <>
            <h5>{title}:</h5>
            <ol className="">
                {criterias.map((criteria, index) => (
                    <li key={criteria?.id || index}>{criteria.text}</li>
                ))}
            </ol>
        </>
    );
}
