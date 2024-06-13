import React from 'react';

import './sub-section-header.scss';

import { Text } from '@chakra-ui/react';

function SubSectionHeader({ headText, action = null, rule, close }) {
    return (
        <div className="sub_section_header">
            {action ? (
                <div className="d-flex justify-content-between">
                    <h4>{headText}</h4>
                    {action}
                </div>
            ) : (
                <Text as="h4" textStyle="2xl" fontWeight={600} mb="10px">
                    {headText}
                </Text>
            )}
            {rule && <hr />}
            {close && (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                <img
                    src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1610444093/Lendha/x_icon_ihn2xz.svg"
                    className="close"
                    alt="Close"
                    onClick={close}
                />
            )}
        </div>
    );
}

export default SubSectionHeader;
