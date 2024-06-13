import React from 'react';

import { Button as ChakraButton } from '@chakra-ui/react';

import Button from '../button/button';

import './filter.scss';

export function FilterGridForm({ onClear, onSubmit, children, loading, whiteSpace = false }) {
    return (
        <form className="grid_filter" onSubmit={onSubmit}>
            {children}

            <div className="d-flex" style={{ flexBasis: '100%', gap: '4px' }}>
                <div className="d-flex" style={{ gap: '4px', marginTop: '10px' }}>
                    <Button text="Filter" loading={loading} />
                    {onClear && (
                        <ChakraButton
                            variant="outline"
                            // className="button_component clear"
                            style={{ width: '100px' }}
                            type="button"
                            onClick={onClear}
                        >
                            Clear
                        </ChakraButton>
                    )}
                </div>
            </div>
        </form>
    );
}

function Filter({ onSubmit, onClear, children, loading, whiteSpace = false }) {
    return (
        <form className="filter_div" onSubmit={onSubmit}>
            {children}
            {whiteSpace && <>&nbsp;</>}

            <div className="d-flex" style={{ flexBasis: '100%', gap: '4px' }}>
                <div className="d-flex" style={{ gap: '4px' }}>
                    <Button text="Filter" loading={loading} />
                    {onClear && (
                        <button className="button_component clear" type="button" onClick={onClear}>
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}

export default Filter;
