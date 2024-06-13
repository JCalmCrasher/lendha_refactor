/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';

import { Button as ChakraButton } from '@chakra-ui/react';

import Loader from '../loader/loader';

import './button.scss';

function Button({ text, loading = false, disabled, onClick, style = {}, type = 'submit', w = 'auto' }) {
    return (
        <ChakraButton
            type={type}
            className={` ${loading ? ' loading' : ''}`}
            onClick={onClick}
            disabled={disabled}
            style={style}
            width={w === 'full' ? '100%' : 'auto'}
        >
            {loading ? <Loader /> : <>{text}</>}
        </ChakraButton>
    );
}

export default Button;
