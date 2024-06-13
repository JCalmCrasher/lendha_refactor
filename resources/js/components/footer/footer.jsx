import React from 'react';

import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { facebookIcon, instagramIcon, linkedinIcon, twitterIcon, youtubeIcon } from '../../assets/icons';
import { googleStore, iosStore } from '../../assets/images';

import './footer.scss';

import CookieConsentBanner from '../cookie/CookieConsentBanner';

const Footer = () => {
    const footer_links = [
        { to: '/', exact: true, name: 'Home' },
        { to: '/loans', end: false, name: 'Loans' },
        { to: '/#contact-us', end: false, name: 'Contact Us' },
        { to: '/faq', end: false, name: 'FAQ' },
        { to: '/sign-in', end: false, name: 'Sign in' },
    ];
    const footer_texts = ['info@lendha.com', '+234 816 791 0608', '134 Bode Thomas Street, Surulere, Lagos State.'];
    const socials = [
        {
            icon: facebookIcon,
            link: 'https://www.facebook.com/lendhaloan',
        },
        {
            icon: twitterIcon,
            link: 'https://www.twitter.com/lendhaloan',
        },
        {
            icon: instagramIcon,
            link: 'https://www.instagram.com/lendhaloan',
        },
        {
            icon: linkedinIcon,
            link: 'https://www.linkedin.com/company/lendha/',
        },
        {
            icon: youtubeIcon,
            link: 'https://youtube.com/@lendha3486',
        },
    ];
    const apps = [
        {
            icon: googleStore,
            link: '#',
            alt: 'Google Play',
        },
        {
            icon: iosStore,
            link: '#',
            alt: 'Apple Store',
        },
    ];

    return (
        <div className="section footer_section">
            <CookieConsentBanner />
            <div className="footer">
                <div className="grids">
                    <div className="grid">
                        {footer_links.map((item, i) => (
                            <HashLink key={i} to={item.to} className="footer_link">
                                {item.name}
                            </HashLink>
                        ))}
                    </div>
                    <div className="grid">
                        {footer_texts.map((item, i) => (
                            <p key={i} className="footer_link">
                                {item}
                            </p>
                        ))}
                    </div>
                    <div className="grid">
                        <div className="socials">
                            {socials.map((item, i) => (
                                <a key={i} href={item.link} target="_blank" rel="noreferrer">
                                    <img src={item.icon} alt="Social" />
                                </a>
                            ))}
                        </div>
                        <div className="apps d-flex flex-row">
                            {apps.map((item, i) => (
                                // Uncomment when there's a real link
                                // <a key={i} href={item.link} target="_blank" rel="noreferrer">
                                //   <img src={item.icon} alt="App" />
                                // </a>
                                <div className="d-flex flex-column" key={i}>
                                    <Link to={item.link}>
                                        <img src={item.icon} alt={item.alt} />
                                    </Link>
                                    <div style={{ lineHeight: '1' }}>
                                        <small style={{ color: '#818991' }}>coming soon</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="foot_navs">
                    <div className="foot_nav">
                        <Link to="/terms" className="footer_link">
                            Terms
                        </Link>
                        <Link to="/privacy" className="footer_link">
                            Privacy
                        </Link>
                    </div>
                    <div className="foot_nav">
                        <p className="footer_link">&#169; 2020 Lendha . All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
