import React from 'react';

import { HashLink } from 'react-router-hash-link';

import './banner-text-and-button.scss';

import { Box } from '@chakra-ui/react';

function BannerTextAndButton({
    align,
    headText,
    headTextSpan,
    headTextEnd,
    firstSubText,
    secondSubText,
    links,
    actionElement = '',
    sx = {},
}) {
    return (
        <div className={`banner_text_and_button ${align}`} style={{ ...sx }}>
            <h1>
                {headText}
                {headTextSpan && <span>{headTextSpan}</span>}
                {headTextEnd}
            </h1>
            <h4 className="font-weight-normal" style={{ maxWidth: '36rem' }}>
                {firstSubText}
            </h4>
            {secondSubText && <h4>{secondSubText}</h4>}
            {links && (
                <Box fontFamily="Poppins" className="actions">
                    {links.map((link, i) => (
                        <HashLink key={i} onClick={link.onClick} to={link.to} className={link.className}>
                            {link.text}
                        </HashLink>
                    ))}
                </Box>
            )}
            {actionElement && actionElement}
        </div>
    );
}

export default BannerTextAndButton;
