import React, { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { getCookie, setCookie } from '../utils/helper';

import './cookie-consent.scss';

const COOKIE_CONSENT_KEY = 'lendha_cookie_consent_accepted';

const CookieConsentBanner = () => {
    const [showBanner, setShowBanner] = useState(getCookie(COOKIE_CONSENT_KEY) === 'false');

    const handleAccept = () => {
        setShowBanner(false);
        setCookie(COOKIE_CONSENT_KEY, 'true', 365); // Set the cookie to expire after a year
    };

    const handleDecline = () => {
        setCookie(COOKIE_CONSENT_KEY, 'false', 365); // Set the cookie to expire after a year
        setShowBanner(false);
    };

    useEffect(() => {
        const cookie = getCookie(COOKIE_CONSENT_KEY);

        if (cookie === 'true') {
            setShowBanner(false);
        } else {
            setShowBanner(true);
        }
    }, []);

    if (!showBanner) {
        return null;
    }

    return createPortal(
        <div className="cookie-banner">
            <p>
                This website uses cookies to enhance the user experience. If you continue to use this website, you
                consent to our use of cookies.
            </p>
            <div className="cookie-action">
                <button className="cookie" onClick={handleAccept}>
                    Accept cookies
                </button>
                <button className="cookie" onClick={handleDecline}>
                    Decline cookies
                </button>
                <button className="close" onClick={() => setShowBanner(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.0046 10.5865L16.9543 5.63672L18.3685 7.05093L13.4188 12.0007L18.3685 16.9504L16.9543 18.3646L12.0046 13.4149L7.05483 18.3646L5.64062 16.9504L10.5904 12.0007L5.64062 7.05093L7.05483 5.63672L12.0046 10.5865Z"
                            fill="#5F5F5F"
                        />
                    </svg>
                </button>
            </div>
        </div>,
        document.body, // Render the banner at the body level of the DOM
    );
};

export default CookieConsentBanner;
