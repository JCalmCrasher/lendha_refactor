import React, { useEffect, useState } from 'react';

import { createBrowserHistory } from 'history';
import { useSelector } from 'react-redux';
import { Router } from 'react-router-dom';

import AdminSidebar from '../components/admin-sidebar/admin-sidebar';
import AdminNavBar from '../components/navbar/admin-navbar';
import NavBar from '../components/navbar/navbar';
import AdminRoutes from './routes/admin-routes';
import MerchantRoutes from './routes/merchant-routes';
import UserRoutes from './routes/user-routes';

const hist = createBrowserHistory();

function Dashbase() {
    const { user } = useSelector((state) => state.userSlice);
    const [adminSidebarOpen, setAdminSidebarOpen] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 840) {
            setAdminSidebarOpen(!adminSidebarOpen);
        }
    }, []);

    const toggleAdminSidebar = () => {
        setAdminSidebarOpen(!adminSidebarOpen);
    };

    const renderInstance = () => {
        switch (user.type) {
            case 'default':
                return (
                    <>
                        <NavBar
                            navLinks={[
                                {
                                    to: '/dashboard',
                                    end: false,
                                    name: 'Dashboard',
                                },
                                {
                                    to: '/investments',
                                    end: false,
                                    name: 'My Investments',
                                },
                                {
                                    to: '/profile',
                                    end: false,
                                    name: 'Profile',
                                },
                            ]}
                            hideDashboardLink
                        />
                        <UserRoutes />
                    </>
                );
            case 'admin':
                return (
                    <>
                        <AdminNavBar toggleSidebar={() => toggleAdminSidebar()} isSidebarOpen={adminSidebarOpen} />
                        <div className="admin_flex_div">
                            <AdminSidebar isSidebarOpen={adminSidebarOpen} toggleSidebar={() => toggleAdminSidebar()} />
                            <div className={`section admin_dashbase ${adminSidebarOpen && 'shrink'}`}>
                                <AdminRoutes />
                            </div>
                        </div>
                    </>
                );
            case 'subadmin':
                return (
                    <>
                        <AdminNavBar toggleSidebar={() => toggleAdminSidebar()} isSidebarOpen={adminSidebarOpen} />
                        <div className="admin_flex_div">
                            <AdminSidebar isSidebarOpen={adminSidebarOpen} toggleSidebar={() => toggleAdminSidebar()} />
                            <div className={`section admin_dashbase ${adminSidebarOpen && 'shrink'}`}>
                                <AdminRoutes />
                            </div>
                        </div>
                    </>
                );
            case 'merchant':
                return (
                    <>
                        <NavBar
                            navLinks={[
                                {
                                    to: '/merchant/dashboard',
                                    end: false,
                                    name: 'Dashboard',
                                },
                            ]}
                            hideDashboardLink
                        />
                        <MerchantRoutes />
                    </>
                );
            default:
                return (
                    <>
                        <NavBar
                            navLinks={[
                                {
                                    to: '/dashboard',
                                    end: false,
                                    name: 'Dashboard',
                                },
                                {
                                    to: '/investments',
                                    end: false,
                                    name: 'My Investments',
                                },
                                {
                                    to: '/profile',
                                    end: false,
                                    name: 'Profile',
                                },
                            ]}
                            hideDashboardLink
                        />
                        <UserRoutes />
                    </>
                );
        }
    };

    return <Router history={hist}>{renderInstance()}</Router>;
}

export default Dashbase;
