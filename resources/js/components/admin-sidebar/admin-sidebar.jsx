import React from 'react';

import { NavLink } from 'react-router-dom';

import './admin-sidebar.scss';

function AdminSidebar({ isSidebarOpen, toggleSidebar }) {
    const links = [
        { to: '/admin/dashboard', name: 'Dashboard' },
        { to: '/admin/requests', name: 'Requests' },
        { to: '/admin/investments', name: 'Investments' },
        { to: '/admin/merchants', name: 'Merchants' },
        { to: '/admin/defaulters', name: 'Defaulters' },
        { to: '/admin/reconciliation', name: 'Reconciliation' },
        { to: '/admin/collection', name: 'Collection' },
        { to: '/admin/branch', name: 'Branch' },
        { to: '/admin/referrals', name: 'Referrals' },
        { to: '/admin/businesses', name: 'Businesses' },
        { to: '/admin/users', name: 'Users' },
        // { to: '/admin/performance', name: 'Performance' },
        { to: '/admin/admins', name: 'Admins' },
        { to: '/admin/transfer-requests', name: 'Transfer Requests' },
    ];

    const toggleAdminSidebar = () => {
        if (window.innerWidth < 840) {
            toggleSidebar();
        }
    };

    return (
        <div className={`sidebar_div${isSidebarOpen ? ' open' : ''}`}>
            {links.map((link, i) => (
                <p key={i} className="link">
                    <NavLink to={link.to} onClick={toggleAdminSidebar}>
                        {link.name}
                    </NavLink>
                </p>
            ))}
        </div>
    );
}

export default AdminSidebar;
