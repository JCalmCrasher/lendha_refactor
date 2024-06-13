import axios from 'axios';

import { auth } from '../components/utils/auth';

export const URL = {
    baseURL: import.meta.env.VITE_API_URL,
    paystack_key:
        import.meta.env.MODE !== 'production'
            ? 'pk_test_1d78af5ebaa724bd3ec5a78b662cbd6d3c27b3c5'
            : import.meta.env.VITE_PAYSTACK_LENDHA_PUBLIC_KEY,
    login: '/auth/login',
    user_forgot_password: '/password/create',
    user_reset_token: '/password/find/',
    user_reset_password: '/password/reset',
    user_resend_verification: '/email/resend',
    referral_channel: '/referral_channel',
    signup: '/auth/signup',
    logout: '/auth/logout',
    user: '/auth/user',
    businessWaitingList: 'business_management_waiting_list',
    contactUs: '/contactus/send',
    user_dashboard: '/user/dashboard',
    user_password: '/auth/password',
    user_guarantor: '/user/onboarding/guarantor',
    user_guarantor_video: '/user/onboarding/guarantor_video',
    user_next_of_kin: '/user/onboarding/next_of_kin',
    bank_list: '/bank/list',
    business_onboarding: '/user/onboarding/business',
    user_bank: '/user/onboarding/bank',
    user_employment: '/user/onboarding/employment',
    user_documents: '/user/onboarding/documents/',
    user_business_reg_status: '/user/onboarding/documents/business_registration',
    user_social_handles: '/user/onboarding/social_media_handles',
    user_address: '/user/onboarding/home_address',
    user_card: '/user/onboarding/card',
    user_business_cac_check: '/user/onboarding/cac',
    user_bank_statement: '/user/loan/bank-statement',

    loan_purposes: '/loan_interests',
    investment_plans: '/investment_plans',
    user_new_loan: '/user/loan',
    user_invest: '/user/invest',
    user_investments: '/user/investments',
    admin_dashboard: '/admin/dashboard',
    admin_update_user_profile: '/admin/edit_customer_profile',
    admin_loans: '/admin/loans',
    admin_new_loan_interest: '/admin/loan_interest',
    admin_auto_deny: '/admin/auto_deny',
    admin_auto_debit: '/admin/auto_debit',
    admin_search_loans: '/admin/search/loan',
    admin_loan_detail: '/admin/loan/',
    admin_update_loan: '/admin/loan_detail',
    admin_loan_status: '/admin/loan_status',
    admin_loan_repayment: '/admin/update_loan_payments',
    admin_modify_loan_purpose: '/admin/modify_user_loan_purpose',
    admin_investors: '/admin/investors',
    admin_new_investor: '/admin/investment_payment',
    admin_merchants: '/merchant/loans',
    admin_defaulters: '/admin/defaulters',
    admin_referrals: '/admin/referrals',
    admin_branches: '/admin/branch',
    admin_users: '/admin/users',
    admin_user_info: 'admin/get_user/',
    admin_search_user: '/admin/search/users',
    admin_suspend_user: '/admin/suspend_user',
    admin_delete_user: '/admin/user/',
    admin_get_subadmin: '/admin/subadmins',
    admin_add_investment_package: '/admin/investment_plan',
    admin_roles: '/admin/user-types',
    admin_transfer_requests: '/admin/user-transfers',
    admin_review_transfer_request: (user_transfer_id) => `/admin/user-transfers/${user_transfer_id}/review`,

    merchant_loans: '/merchant/loans',

    notifications: '/notifications/all',

    upload_payment_receipt: '/admin/payment_receipt',
    payment_receipts: (id) => `admin/payment_receipt?loan_id=${id}`,

    admin_reconciliation: '/admin/reconcilliation',
    admin_search_reconciliation: '/admin/reconcilliation/filter',

    admin_collections: '/admin/collections',
    admin_search_collections: '/admin/collections/filter',

    admin_payment_account: '/user/account',
};

const isProd = import.meta.env.MODE === 'production';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tok');
        if (token) {
            const tok = token.slice(1, -1);
            config.headers.Authorization = `Bearer ${tok}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status == 401) {
            if (!error.response?.data?.message?.includes('Please change your password') && auth.isAuthenticated) {
                localStorage.removeItem('tok');
                localStorage.removeItem('user');
                auth.isAuthenticated = false;

                setTimeout(() => {
                    window.location.assign('/change-password');
                }, 4000);
            }
        }
        return Promise.reject(error);
    },
);

export default api;
