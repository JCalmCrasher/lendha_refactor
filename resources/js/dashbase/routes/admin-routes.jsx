import React, { lazy, Suspense } from 'react';

import { Route } from 'react-router-dom';

import Spinner from '../../components/spinner/spinner';

const AdminDashboardPage = lazy(() => import('../dashboard/admin/dashboard/dashboard'));
const AdminRequestsPage = lazy(() => import('../dashboard/admin/requests/requests'));
const AdminRequestInfoPage = lazy(() => import('../dashboard/admin/request-info/request-info'));
const AdminRequestInfoDetailsPage = lazy(() => import('../dashboard/admin/request-info/request-info-details'));
const AdminInvestmentsPage = lazy(() => import('../dashboard/admin/investments/investments'));
const AdminMerchantsPage = lazy(() => import('../dashboard/admin/merchants/merchants'));
const AdminDefaultersPage = lazy(() => import('../dashboard/admin/defaulters/defaulters'));
const AdminReferralsPage = lazy(() => import('../dashboard/admin/referrals/referrals'));
const AdminUsersPage = lazy(() => import('../dashboard/admin/users/users'));
const AdminUserInfoPage = lazy(() => import('../dashboard/admin/user-info/user-info'));
const AdminPaymentsPage = lazy(() => import('../dashboard/admin/payments/payments'));
const AdminReconciliationPage = lazy(() => import('../dashboard/admin/reconciliation/reconciliation'));
const AdminCollectiontionPage = lazy(() => import('../dashboard/admin/collection/collection'));
const AdminBranchPage = lazy(() => import('../dashboard/admin/branch/branch'));
const AdminBranchCreditOfficerPage = lazy(() => import('../dashboard/admin/branch/branch-credit-officer'));

function AdminRoutes() {
    const routes = [
        '/admin/dashboard',
        '/admin/requests',
        '/admin/request/:id',
        '/admin/investments',
        '/admin/merchants',
        '/admin/defaulters',
        '/admin/reconciliation',
        '/admin/branch',
        '/admin/branch/:id',
        '/admin/referrals',
        '/admin/users',
        '/admin/payments/:id',
    ];
    const { pathname } = window.location;

    return (
        <>
            <Route
                path="/admin/dashboard"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminDashboardPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/requests"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminRequestsPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/requests/:loan_id"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminRequestInfoPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/requests/profile/:loan_id"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminRequestInfoDetailsPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/investments"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminInvestmentsPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/merchants"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminMerchantsPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/defaulters"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminDefaultersPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/reconciliation"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminReconciliationPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/collection"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminCollectiontionPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/branch"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminBranchPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/branch/:id"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminBranchCreditOfficerPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/referrals"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminReferralsPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminUsersPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/users/:user_id"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminUserInfoPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin/payments/:id"
                element={
                    <Suspense fallback={<Spinner />}>
                        <AdminPaymentsPage />
                    </Suspense>
                }
            />
            <Route path="*" element={() => <Redirect to="/admin/dashboard" />} />
        </>
    );
}

export default AdminRoutes;
