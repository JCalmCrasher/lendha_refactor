import React, { lazy, Suspense, useState } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

import { AdminLayout, MerchantLayout, UserLayout } from './components/ProtectedRoute';
import Spinner from './components/spinner/spinner';
import store from './store';
import theme from './theme';

const HomePage = lazy(() => import('./pages/homepage/homepage'));
const LoansPage = lazy(() => import('./pages/loans/loans'));
const InvestPage = lazy(() => import('./pages/invest/invest'));
const BusinessManagementPage = lazy(() => import('./pages/business-management/index'));
const FoodmartPage = lazy(() => import('./pages/foodmart/foodmart'));
const FaqPage = lazy(() => import('./pages/faq/faq'));
const TermsPage = lazy(() => import('./pages/terms/terms'));
const PrivacyPage = lazy(() => import('./pages/privacy/privacy'));
const RequirementsPage = lazy(() => import('./pages/requirements/requirements'));
const SignInPage = lazy(() => import('./pages/sign-in/sign-in'));
const RegisterPage = lazy(() => import('./pages/register/register'));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password/forgot-password'));
const ChangePasswordPage = lazy(() => import('./pages/change-password/change-password'));
const ResetPasswordPage = lazy(() => import('./pages/reset-password/reset-password'));

// user
const UserDashboardPage = lazy(() => import('./dashbase/dashboard/user/dashboard/dashboard'));
const UserInvestmentsPage = lazy(() => import('./dashbase/dashboard/user/investments/investments'));
const UserProfilePage = lazy(() => import('./dashbase/dashboard/user/profile/profile'));

// merchant
const MerchantDashboardPage = lazy(() => import('./dashbase/dashboard/merchant/dashboard/dashboard'));

// // admin
const AdminDashboardPage = lazy(() => import('./dashbase/dashboard/admin/dashboard/dashboard'));
const AdminRequestsPage = lazy(() => import('./dashbase/dashboard/admin/requests/requests'));
const AdminRequestInfoPage = lazy(() => import('./dashbase/dashboard/admin/request-info/request-info-details'));
const AdminRequestInfoDetailsPage = lazy(() => import('./dashbase/dashboard/admin/request-info/request-info-details'));
const AdminInvestmentsPage = lazy(() => import('./dashbase/dashboard/admin/investments/investments'));
const AdminMerchantsPage = lazy(() => import('./dashbase/dashboard/admin/merchants/merchants'));
const AdminDefaultersPage = lazy(() => import('./dashbase/dashboard/admin/defaulters/defaulters'));
const AdminReferralsPage = lazy(() => import('./dashbase/dashboard/admin/referrals/referrals'));
const AdminUsersPage = lazy(() => import('./dashbase/dashboard/admin/users/users'));
const AdminUserInfoPage = lazy(() => import('./dashbase/dashboard/admin/user-info/user-info'));
// const AdminPerformancePage = lazy(() => import('./dashbase/dashboard/admin/performance/performance'));
const AdminPaymentsPage = lazy(() => import('./dashbase/dashboard/admin/payments/payments'));
const AdminReconciliationPage = lazy(() => import('./dashbase/dashboard/admin/reconciliation/reconciliation'));
const AdminCollectiontionPage = lazy(() => import('./dashbase/dashboard/admin/collection/collection'));
const AdminBranchPage = lazy(() => import('./dashbase/dashboard/admin/branch/branch'));
const AdminBranchCreditOfficerPage = lazy(() => import('./dashbase/dashboard/admin/branch/branch-credit-officer'));
const AdminAdminsPage = lazy(() => import('./dashbase/dashboard/admin/admins/admins'));
const AdminTransferRequestsPage = lazy(() => import('./dashbase/dashboard/admin/requests/transfer/TransferRequests'));
const AdminRequestBankStatement = lazy(() => import('./dashbase/dashboard/admin/request-info/bank-statement'));

const LOAN_APPLY_ROUTE = '/dashboard?loan=apply';

const fallbackRender = ({ error, resetErrorBoundary }) => {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: 'red' }}>{error.message}</pre>
            <button type="button" onClick={resetErrorBoundary}>
                Try again
            </button>
        </div>
    );
};

export default function App() {
    const [key, setKey] = useState(null);
    // const { user } = useSelector((state) => state.userSlice);
    // const isAdmin = user?.type === 'admin';
    // const isMerchant = user?.type === 'admin';
    // const isUser = user?.type === 'user' || user?.type === 'default';

    const routes = ['/dashboard', LOAN_APPLY_ROUTE, '/investments', '/profile'];
    let { pathname } = window.location;

    const hasLoanApplyQuery = new URLSearchParams(window.location.search).get('loan') === 'apply';
    if (hasLoanApplyQuery) {
        pathname = LOAN_APPLY_ROUTE;
    }

    // useEffect(() => {
    //     if (isAdmin) {
    //         window.location.assign("/admin/dashboard");
    //     } else {
    //         window.location.assign("/dashboard");
    //     }
    // }, []);

    return (
        <ErrorBoundary
            fallbackRender={fallbackRender}
            onError={(error, info) => {
                // eslint-disable-next-line no-console
                console.log(error, info); // log the error to an error reporting service (sentry, etc.)
            }}
            onReset={() => setKey(null)} // reset the state of your app here
            resetKeys={[key]} // reset the error boundary when `someKey` changes
        >
            <BrowserRouter>
                <ChakraProvider theme={theme}>
                    <Routes>
                        <Route path="/">
                            <Route
                                index
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <HomePage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/loans"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <LoansPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/invest"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <InvestPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/business-management"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <BusinessManagementPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/foodmart"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <FoodmartPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/faq"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <FaqPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/terms"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <TermsPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/privacy"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <PrivacyPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/requirements"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <RequirementsPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/sign-in"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <SignInPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <RegisterPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/forgot"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <ForgotPasswordPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/change-password"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <ChangePasswordPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/reset"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <ResetPasswordPage />
                                    </Suspense>
                                }
                            />

                            {/* user routes */}
                            <Route element={<UserLayout />}>
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

                                <Route
                                    path="*"
                                    element={
                                        <Navigate
                                            to={
                                                routes.includes(pathname) || hasLoanApplyQuery ? pathname : '/dashboard'
                                            }
                                            replace
                                        />
                                    }
                                />
                            </Route>

                            {/* merchant routes */}
                            <Route element={<MerchantLayout />}>
                                <Route
                                    path="/merchant/dashboard"
                                    element={
                                        <Suspense fallback={<Spinner />}>
                                            <MerchantDashboardPage />
                                        </Suspense>
                                    }
                                />
                                <Route path="/merchant" element={<Navigate to="/merchant/dashboard" replace />} />

                                <Route path="*" element={<Navigate to="/merchant/dashboard" replace />} />
                            </Route>

                            {/* admin routes */}
                            <Route element={<AdminLayout />}>
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
                                    path="/admin/requests/bank-statement/:loan_id"
                                    element={
                                        <Suspense fallback={<Spinner />}>
                                            <AdminRequestBankStatement />
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
                                    path="/admin/branch/:id/officer/:officer_id"
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
                                {/* <Route
                                path="/admin/performance"
                                element={
                                    <Suspense fallback={<Spinner />}>
                                        <AdminPerformancePage />
                                    </Suspense>
                                }
                            /> */}
                                <Route
                                    path="/admin/admins"
                                    element={
                                        <Suspense fallback={<Spinner />}>
                                            <AdminAdminsPage />
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
                                <Route
                                    path="/admin/transfer-requests"
                                    element={
                                        <Suspense fallback={<Spinner />}>
                                            <AdminTransferRequestsPage />
                                        </Suspense>
                                    }
                                />
                                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </ChakraProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    );
}

if (document.getElementById('root')) {
    createRoot(document.getElementById('root')).render(
        <Provider store={store}>
            <App />
        </Provider>,
    );
}
