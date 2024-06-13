/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { capitalize } from '../utils/helper';

import './form-select.scss';

function FormSelect({
    name,
    label,
    selectRef,
    readOnly,
    options,
    error,
    errorMessage,
    value = null,
    sx = {},
    disabled = false,
}) {
    return (
        <div className="form-group" style={{ ...sx }}>
            {label && <label>{label}</label>}
            <select
                name={name}
                className="form-control"
                // ref={selectRef}
                {...selectRef}
                readOnly={readOnly}
                defaultValue={value}
                disabled={disabled}
            >
                {options.map((option, i) => (
                    <option key={i} value={option.value}>
                        {capitalize(option.name)}
                    </option>
                ))}
            </select>
            {error && <span>* {errorMessage}</span>}
        </div>
    );
}

export default FormSelect;
