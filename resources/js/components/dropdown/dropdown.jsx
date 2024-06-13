import React from 'react';

import './dropdown.scss';

import { Box } from '@chakra-ui/react';

function DropDown({ children }) {
    return (
        <div className="dropdown_div">
            <Box
                as="button"
                type="submit"
                className="drop"
                id="dropdown001"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                border="1px solid"
                borderColor="darkblue.DEFAULT"
            >
                Action
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                    <g>
                        <path fill="#333" d="M7.41 8.295l4.59 4.58 4.59-4.58L18 9.705l-6 6-6-6 1.41-1.41z" />
                    </g>
                </svg>
            </Box>
            <div className="dropdown-menu" aria-labelledby="dropdown001">
                {children}
            </div>
        </div>
    );
}

export default DropDown;
