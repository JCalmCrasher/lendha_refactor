/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

import { NavLink, Link as RRLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { logoutUser, user } from '../utils/auth';
import { firstLetter } from '../utils/helper';

import './navbar.scss';

import { Button, Link } from '@chakra-ui/react';

function NavBar({ navLinks, hideDashboardLink }) {
    const [collapseNavbar, setCollapseNavbar] = useState(false);
    const defaultNavLinks = [
        { to: '/', end: 'true', name: 'Home' },
        { to: '/loans', end: false, name: 'Loans' },
        { to: '/business-management', end: false, name: 'Business Management' },
        { to: '/#contact-us', end: false, name: 'Contact Us' },
        { to: '/faq', end: false, name: 'FAQ' },
        { to: '/sign-in', end: false, name: 'Sign in' },
    ];

    const toggleNavbarCollapse = () => {
        if (window.innerWidth <= 767) {
            setCollapseNavbar(true);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
                <RRLink to="/">
                    <img
                        src="https://res.cloudinary.com/thelendha/image/upload/v1653493588/upload/lendha-logo_irbke4.png"
                        className="logo"
                        alt="Lendha Logo"
                    />
                </RRLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarsExample08"
                    aria-controls="navbarsExample08"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => setCollapseNavbar(false)}
                >
                    <span className="navbar-toggler-icon">
                        <img
                            className="menu"
                            alt="menu"
                            src="https://res.cloudinary.com/the-now-entity/image/upload/v1609939220/Lendha/menu_2_5_bse0xq.svg"
                        />
                    </span>
                </button>
                <div className={`collapse navbar-collapse ${collapseNavbar && 'hide'}`} id="navbarsExample08">
                    <ul className="navbar-nav mr-auto" />
                    <ul className="navbar-nav mr-right">
                        {navLinks
                            ? navLinks.map((link) => (
                                  <NavLink
                                      key={link.to}
                                      end={link.end}
                                      className="nav-item"
                                      to={link.to}
                                      onClick={() => toggleNavbarCollapse()}
                                  >
                                      {link.name}
                                  </NavLink>
                              ))
                            : defaultNavLinks.map((link) => (
                                  <HashLink
                                      key={link.to}
                                      className="nav-item"
                                      to={link.to}
                                      onClick={() => toggleNavbarCollapse()}
                                  >
                                      {link.name}
                                  </HashLink>
                              ))}
                        {!user ? (
                            <Link as={RRLink} className="sm" to="/register">
                                <Button variant="white">Apply now</Button>
                            </Link>
                        ) : (
                            <li className="nav-item dropdown signed_in_div">
                                <RRLink
                                    className="nav-link"
                                    to="#"
                                    id="dropdown01"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <div className="username">
                                        <p>{firstLetter(user.name)}</p>
                                        {/* <img src="" alt="" /> */}
                                    </div>
                                </RRLink>
                                <div className="dropdown-menu" aria-labelledby="dropdown01">
                                    {hideDashboardLink ? null : (
                                        <NavLink className="dropdown-item" to="/dashboard">
                                            Dashboard
                                        </NavLink>
                                    )}
                                    <hr />
                                    <button type="button" className="dropdown-item" onClick={() => logoutUser()}>
                                        Logout
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
