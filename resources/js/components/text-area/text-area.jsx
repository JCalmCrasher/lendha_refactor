import React from 'react';

const TextArea = ({ name, label, type, rows, inputRef, error, errorMessage }) => (
    <div className="form-group">
        <label>{label}</label>
        <textarea
            name={name}
            type={type}
            className="form-control"
            rows={rows}
            {...inputRef}
            // ref={inputRef}
        />
        {error && <span>* {errorMessage}</span>}
    </div>
);

export default TextArea;
