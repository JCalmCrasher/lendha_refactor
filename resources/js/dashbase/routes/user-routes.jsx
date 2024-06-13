import React, { lazy, Suspense } from 'react';

import { Navigate, Route } from 'react-router-dom';

import Spinner from '../../components/spinner/spinner';

const UserDashboardPage = lazy(() => import('../dashboard/user/dashboard/dashboard'));
const UserInvestmentsPage = lazy(() => import('../dashboard/user/investments/investments'));
const UserProfilePage = lazy(() => import('../dashboard/user/profile/profile'));

const LOAN_APPLY_ROUTE = '/dashboard?loan=apply';

const UserRoutes = () => {
    const routes = ['/dashboard', LOAN_APPLY_ROUTE, '/investments', '/profile'];
    let pathname = window.location.pathname;

    const hasLoanApplyQuery = new URLSearchParams(window.location.search).get('loan') === 'apply';
    if (hasLoanApplyQuery) {
        pathname = LOAN_APPLY_ROUTE;
    }

    return (
        <>
            <Route
                path="/dashboard"
                element={
                    <Suspense fallback={<Spinner />}>
                        <UserDashboardPage />
                    </Suspense>
                }
            />
            <Route
                path="/investments"
                element={
                    <Suspense fallback={<Spinner />}>
                        <UserInvestmentsPage />
                    </Suspense>
                }
            />
            <Route
                path="/profile"
                element={
                    <Suspense fallback={<Spinner />}>
                        <UserProfilePage />
                    </Suspense>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route
                path="*"
                element={
                    <Navigate replace to={routes.includes(pathname) || hasLoanApplyQuery ? pathname : '/dashboard'} />
                }
            />
        </>
    );
};

export default UserRoutes;
