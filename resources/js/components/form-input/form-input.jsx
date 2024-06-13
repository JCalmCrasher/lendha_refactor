/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';

import './form-input.scss';

import { Input } from '@chakra-ui/react';

function FormInput({
    name,
    label,
    type,
    placeholder,
    accept,
    value,
    inputRef,
    readOnly,
    error,
    errorMessage,
    autoComplete = '',
    groupSx = {},
    maxLength = 50,
    onChange,
}) {
    const [previewSrc, setPreviewSrc] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.type === 'application/pdf') {
            setPreviewSrc(file.name);
        } else {
            setPreviewSrc(URL.createObjectURL(file));
        }
    };

    return (
        <div className="form-group" style={{ ...groupSx }}>
            {label && <label htmlFor={name}>{label}</label>}
            {type === 'file' ? (
                <>
                    <input
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        accept={accept}
                        defaultValue={value}
                        className="form-control"
                        {...inputRef}
                        readOnly={!!readOnly}
                        autoComplete={autoComplete}
                        onChange={handleFileChange}
                        // onChange={typeof onChange === 'function' ? onChange : undefined}
                        // ref={inputRef}
                    />
                    {previewSrc &&
                        (previewSrc.endsWith('.pdf') ? (
                            <p>{previewSrc}</p>
                        ) : (
                            <img
                                src={previewSrc}
                                style={{
                                    width: '100%',
                                    height: '116px',
                                }}
                                alt="Preview"
                            />
                        ))}
                </>
            ) : (
                <Input
                    name={name}
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    accept={accept}
                    defaultValue={value}
                    className="form-control"
                    {...inputRef}
                    readOnly={!!readOnly}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    // ref={inputRef}
                />
            )}

            {/* check if the error object has an element with error object  */}
            {(error || {}).hasOwnProperty(name) ? (
                <span> {`* ${error[name]?.message}`}</span>
            ) : (
                (errorMessage || '')?.length > 0 && <span> {`* ${errorMessage}`}</span>
            )}
        </div>
    );
}

export default FormInput;

export function FormInputWithValue({
    name,
    label,
    type,
    placeholder,
    accept,
    value,
    inputRef,
    readOnly,
    error,
    errorMessage,
    autoComplete = '',
    onChange,
}) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                accept={accept}
                value={value}
                onChange={onChange}
                className="form-control"
                // ref={inputRef}
                {...inputRef}
                readOnly={!!readOnly}
                autoComplete={autoComplete}
            />
            {(error || {}).hasOwnProperty(name) ? (
                <span> {`* ${error[name]?.message}`}</span>
            ) : (
                (errorMessage || '')?.length > 0 && <span> {`* ${errorMessage}`}</span>
            )}
        </div>
    );
}

export function FormInputWithNoRef({
    name,
    label,
    type,
    placeholder,
    accept,
    value,
    readOnly,
    error,
    errorMessage,
    autoComplete = '',
    onChange,
}) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                accept={accept}
                value={value}
                onChange={onChange}
                className="form-control"
                readOnly={!!readOnly}
                autoComplete={autoComplete}
            />
            {(error || {}).hasOwnProperty(name) ? (
                <span> {`* ${error[name]?.message}`}</span>
            ) : (
                (errorMessage || '')?.length > 0 && <span> {`* ${errorMessage}`}</span>
            )}
        </div>
    );
}
