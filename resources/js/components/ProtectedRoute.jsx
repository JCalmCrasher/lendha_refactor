import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import AdminSidebar from './admin-sidebar/admin-sidebar';
import AdminNavBar from './navbar/admin-navbar';
import NavBar from './navbar/navbar';

export function ProtectedRoute({ element: Element, ...rest }) {
    const { user } = useSelector((state) => state.userSlice);

    switch (user?.type) {
        case 'user':
        case 'default':
            return <UserLayout />;
        case 'merchant':
            return <MerchantLayout />;
        case 'admin':
        case 'subadmin':
            return <AdminLayout />;
        default:
            return <Navigate to="/sign-in" />;
    }
}

export function UserLayout() {
    const { user } = useSelector((state) => state.userSlice);
    const isUser = user?.type === 'user' || user?.type === 'default';

    return isUser ? (
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
            <Outlet />
        </>
    ) : (
        <Navigate to="/sign-in" />
    );
}

export function MerchantLayout() {
    const { user } = useSelector((state) => state.userSlice);
    const isMerchant = user?.type === 'merchant';

    return isMerchant ? (
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
            <Outlet />
        </>
    ) : (
        <Navigate to="/sign-in" />
    );
}

export function AdminLayout() {
    const { user } = useSelector((state) => state.userSlice);
    const isAdmin =
        user?.type === 'admin' ||
        user?.type === 'subadmin' ||
        user?.type === 'onboarding_officer' ||
        user?.type === 'credit_officer' ||
        user?.type === 'team_lead';

    const [adminSidebarOpen, setAdminSidebarOpen] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 840) {
            setAdminSidebarOpen(!adminSidebarOpen);
        }
    }, []);

    const toggleAdminSidebar = () => {
        setAdminSidebarOpen(!adminSidebarOpen);
    };

    return isAdmin ? (
        <>
            <AdminNavBar toggleSidebar={() => toggleAdminSidebar()} isSidebarOpen={adminSidebarOpen} />
            <div className="admin_flex_div">
                <AdminSidebar isSidebarOpen={adminSidebarOpen} toggleSidebar={() => toggleAdminSidebar()} />
                <div className={`section admin_dashbase ${adminSidebarOpen && 'shrink'}`}>
                    <Outlet />
                </div>
            </div>
        </>
    ) : (
        <Navigate to="/sign-in" />
    );
}
