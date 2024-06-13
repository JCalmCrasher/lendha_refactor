import React from 'react';

export default function EligibilityRequirements({ title, requirements }) {
    return (
        <>
            <h5>{title}:</h5>
            <ul>
                {requirements.map((requirement, index) => (
                    <li key={requirement?.id || index}>{requirement.text}</li>
                ))}
            </ul>
        </>
    );
}
