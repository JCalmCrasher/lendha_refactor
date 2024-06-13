import React, { useState } from 'react';

import { CopyIcon } from '../assets/icons';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import Alert from './alert/alert';

const CopyToClipboard = ({ text = '' }) => {
    const [copied, setCopied] = useState(false);
    const [, copy] = useCopyToClipboard();

    const handleCopy = (val) => {
        copy(val).then(() => {
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1000);
        });
    };

    return (
        <>
            {copied && <Alert className="success" textBeforeLink="Account number copied" />}

            <div
                onClick={() => handleCopy(text)}
                style={{
                    display: 'inline-flex',
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F5F7FE',
                    cursor: 'pointer',
                    height: '22px',
                    minWidth: '66px',
                    gap: '4px',
                    userSelect: 'none',
                    borderRadius: '3px',
                }}
            >
                {copied ? null : <CopyIcon />}

                <span>{copied ? 'Copied' : 'Copy'}</span>
            </div>
        </>
    );
};

export default CopyToClipboard;
