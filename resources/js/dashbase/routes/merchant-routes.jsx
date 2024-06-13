import React, { lazy, Suspense } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import Spinner from '../../components/spinner/spinner';

const MerchantDashboardPage = lazy(() => import('../dashboard/merchant/dashboard/dashboard'));

const MerchantRoutes = () => {
    return (
        <Routes>
            <Route
                path="/merchant/dashboard"
                element={
                    <Suspense fallback={<Spinner />}>
                        <MerchantDashboardPage />
                    </Suspense>
                }
            />

            {/* <Route path="/" render={() => window.location.reload()} /> */}

            <Route path="*" element={() => <Navigate to="/merchant/dashboard" />} />
        </Routes>
    );
};

export default MerchantRoutes;
