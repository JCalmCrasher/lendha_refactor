import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { buildQueryParams, useLocalStorage } from '../../components/utils/helper';
import { setAlert, setIsFetching, setIsLoading } from '../../store/components/componentsSlice';

const initialUser = useLocalStorage.get('user');

// Slice
const slice = createSlice({
    name: 'user',
    initialState: {
        user: initialUser,
        userDashboardDetails: null,
        isBusinessRegistered: false,
        referralChannels: [],
        adminDashboardDetails: null,
        bankAccountList: [],
        notificationList: [],
        bankAccountName: {},
        paymentReceipts: [],
        paymentAccount: {},
        adminUsers: null,
        privacyPolicy: true,
    },
    reducers: {
        loginSuccess: (state, { payload }) => {
            useLocalStorage.set('tok', payload);
        },
        logoutSuccess: (state) => {
            state.user = null;
            useLocalStorage.clear();
            window.location.reload();
        },
        setIsBusinessRegistered: (state, { payload }) => {
            state.isBusinessRegistered = payload;
        },
        setUserDetails: (state, { payload }) => {
            state.user = payload;
            useLocalStorage.set('user', payload);
        },
        setUserDashboardDetails: (state, { payload }) => {
            state.userDashboardDetails = payload;
        },
        setReferralChannels: (state, { payload }) => {
            state.referralChannels = payload;
        },
        setAdminDashboardDetails: (state, { payload }) => {
            state.adminDashboardDetails = payload;
        },
        setBankAccountList: (state, { payload }) => {
            state.bankAccountList = payload;
        },
        setBankAccountName: (state, { payload }) => {
            state.bankAccountName = payload;
        },
        setAdminUsers: (state, { payload }) => {
            state.adminUsers = payload;
        },
        setNotificationList: (state, { payload }) => {
            state.notificationList = payload;
        },
        setShowPrivacyPolicy: (state, { payload }) => {
            state.privacyPolicy = payload;
        },
        setPaymentReceipts: (state, { payload }) => {
            state.paymentReceipts = payload;
        },
        setPaymentAccount: (state, { payload }) => {
            state.paymentAccount = payload;
        },
    },
});
export default slice.reducer;

// Actions
export const {
    loginSuccess,
    logoutSuccess,
    setUserDetails,
    setReferralChannels,
    setUserDashboardDetails,
    setAdminDashboardDetails,
    setBankAccountList,
    setBankAccountName,
    setAdminUsers,
    setIsBusinessRegistered,
    setNotificationList,
    setShowPrivacyPolicy,
    setPaymentReceipts,
    setPaymentAccount,
} = slice.actions;

const successStatusCode = 200 || 201;

export const getNotifications = () => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.get(`${URL.notifications}`);
        if (res.status === successStatusCode) {
            const notifications = res.data.data;
            const notificationsList = notifications.map((n) => ({
                id: n.id,
                title: n.data.title,
                body: n.data.body,
                time: n.data.time,
            }));
            dispatch(setIsLoading(false));
            dispatch(setNotificationList(notificationsList));
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const markAllNotificationAsRead = () => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.get(`${URL.notifications}/read`);
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const businessRegistered = (isRegistered) => async (dispatch) => {
    dispatch(setIsBusinessRegistered(isRegistered));
};

export const loginUser =
    ({ email, password }) =>
    async (dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const res = await api.post(`${URL.login}`, {
                email,
                password,
            });
            if (res.status === successStatusCode) {
                dispatch(loginSuccess(res.data.access_token));
                return res;
            }
        } catch (err) {
            const error = err.response?.data;
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'error',
                    message: error?.message ? error?.message : error?.error || 'Something went wrong',
                }),
            );
            if (error?.error) return error?.error;
        }
    };

export const forgotPassword =
    ({ email }) =>
    async (dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const res = await api.post(`${URL.user_forgot_password}`, {
                email,
            });
            if (res.status === successStatusCode) {
                dispatch(setIsLoading(false));
                dispatch(
                    setAlert({
                        show: true,
                        type: 'success',
                        message: res?.data?.message || res?.data?.status,
                    }),
                );
            }
        } catch (err) {
            const error = err.response?.data;
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'error',
                    message: error?.message || 'Something went wrong',
                }),
            );
        }
    };

export const getResetToken = (data) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.user_reset_token}${data.token}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const resetPassword = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_reset_password}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: res?.data?.message,
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const resendVerificationMail = (email) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.get(`${URL.user_resend_verification}?email=${email}`);
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Success! Verifcation mail sent to your email',
                }),
            );
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const registerUser = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.signup}`, {
            ...data,
        });
        if (res.status === 201) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Please check your email to verify your email address',
                }),
            );
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.errors ? JSON.stringify(error?.errors) : error?.message || 'Something went wrong',
            }),
        );
    }
};

export const logoutUser = () => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.logout}`);
        console.log(res);
        if (res.status === successStatusCode) {
            dispatch(logoutSuccess());
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getUserDetails = (token) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.user}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: res.data.message || 'Authentication successful',
                }),
            );
            setTimeout(() => {
                dispatch(setUserDetails(res.data));
            }, 1000);
            clearTimeout();
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getUserDashboardDetails = () => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const { data, status } = await api.get(`${URL.user_dashboard}`);
        const res = {
            data,
            status,
        };

        if (status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(setUserDashboardDetails(res.data.data));
            dispatch(setUserDetails(res.data.data.user));
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getAdminDashboardDetails = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_dashboard}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setAdminDashboardDetails(res.data.data));
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getReferralChannels = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.referral_channel}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            const refChannels = res.data.data.map(({ id: value, name }) => ({
                value,
                name,
            }));

            setTimeout(() => {
                dispatch(setReferralChannels(refChannels));
            }, 1000);
            clearTimeout();
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const updateUserProfile = (data) => async (dispatch) => {
    try {
        const res = await api.post(`${URL.admin_update_user_profile}`, {
            ...data,
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: res.data.message,
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postUserEditAccount = (data) => async (dispatch) => {
    try {
        const res = await api.post(`${URL.user_password}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: res.data.message,
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditBusiness = (data) => async (dispatch) => {
    try {
        const res = await api.post(`${URL.business_onboarding}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: res.data.message,
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postBusinessRegStatusInfo = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));

    try {
        const res = await api.post(`${URL.user_business_reg_status}`, data, {
            headers: { 'Content-Type': `multipart/form-data` },
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Business Status Info updated successfully',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postCheckCACValidity = (payload) => async (dispatch) => {
    dispatch(setIsLoading(true));

    try {
        const res = await api.post(`${URL.user_business_cac_check}`, payload);
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            return res;
        }
    } catch (err) {
        const error = err?.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditGuarantor = (payload) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        // const res = await api.post(`${URL.user_next_of_kin}`, { ...payload });
        const { data, status } = await api.post(`${URL.user_guarantor}`, payload, {
            headers: { 'Content-Type': `multipart/form-data` },
        });

        const res = {
            data,
            status,
        };

        if (status === 200 || status === 201) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Guarantor update successful',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err?.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditNok = (payload) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const { data, status } = await api.post(`${URL.user_next_of_kin}`, payload);

        const res = {
            data,
            status,
        };

        if (status === 200 || status === 201) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Next of Kin update successful',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err?.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getBanksList = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const { data, status } = await api.get(`${URL.bank_list}`);
        if (status === successStatusCode) {
            const list = data?.data?.list;
            const banksList = list.map((item) => ({
                name: item.name,
                value: item.code,
            }));
            dispatch(setIsFetching(false));
            dispatch(setBankAccountList(banksList));
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getBankAccountName = (bankCode, accountNumber) => async (dispatch) => {
    dispatch(
        setBankAccountName({
            fetching: true,
            value: '',
        }),
    );
    try {
        const res = await api.get(`/bank/account_name/bank/${bankCode}/account/${accountNumber}`);
        if (res.status === successStatusCode) {
            dispatch(
                setBankAccountName({
                    fetching: false,
                    value: res.data.data.name,
                }),
            );
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setBankAccountName({
                fetching: false,
                value: '',
            }),
        );
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postAddBusinessManagementWaitingList = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.businessWaitingList}`, {
            email: data.email,
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Email added to waiting list.',
                }),
            );
            return res;
        }
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: res.data.message || 'Something went wrong',
            }),
        );
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditBankAccount = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_bank}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Bank account update successful',
                }),
            );
            return res;
        }
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: res.data.message || 'Something went wrong',
            }),
        );
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditEmployment = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_employment}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Employment update successful',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditDocuments = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    const formData = new FormData();
    formData.append('user_file', data.file);

    try {
        const res = await api.post(`${URL.user_documents + data.path}`, formData, {
            headers: { 'Content-Type': `multipart/form-data` },
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Document update successful',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditSocialHandles = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_social_handles}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Social handles update successful',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditAddress = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_address}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Address update successful',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postEditCard = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_card}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Card update successful',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getAdminUsers = (data) => async (dispatch) => {
    const { page } = data;
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_users}?page=${page}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setAdminUsers(res.data.data));
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getOnlyAdminUsers = (data) => async (dispatch) => {
    const { page, filters } = data;
    dispatch(setIsFetching(true));
    try {
        const params = {};
        if (page) params.page = page;
        const queryParams = buildQueryParams(params);

        const res = await api.get(`${URL.admin_users}${queryParams}${filters}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setAdminUsers(res.data.data));
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getSearchAdminUsers = (data) => async (dispatch) => {
    const { page, searchTerm, status } = data;
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(
            `${URL.admin_search_user}?page=${page}${
                searchTerm && `&email=${searchTerm}`
            }${status && `&status=${status}`}`,
        );
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));

            dispatch(setAdminUsers(res.data.data));
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getSearchAdmin = (data) => async (dispatch) => {
    const { filters } = data;
    dispatch(setIsFetching(true));
    try {
        const params = {};
        if (data?.start_date) params.start_date = data?.start_date;
        if (data?.end_date) params.end_date = data?.end_date;
        if (data?.status) params.status = data?.status;
        if (data?.searchTerm) params.searchTerm = data?.searchTerm;
        if (data?.page) params.page = data?.page;
        if (data?.email) params.email = data?.email;

        const queryParams = buildQueryParams(params);
        let filterQuery = '';
        if (filters) {
            filterQuery = queryParams ? `&${filters}` : `?${filters}`;
        }

        const res = await api.get(`${URL.admin_users}${queryParams}${filterQuery}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));

            dispatch(setAdminUsers(res.data.data));
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postAdminSuspendUser = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.put(`${URL.admin_suspend_user}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'User suspension status updated successfully',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getUserProfileInfo = (user_id) => async (dispatch) => {
    dispatch(setIsFetching(true));

    try {
        const res = await api.get(`${URL.admin_user_info}${user_id}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            return res.data.data;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postAdminDeleteUser = (data) => async (dispatch) => {
    const { id } = data;
    dispatch(setIsLoading(true));
    try {
        const res = await api.delete(`${URL.admin_delete_user}${id}`);
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'User account deleted successfully',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postUploadPaymentReceipt = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.upload_payment_receipt}`, data, {
            headers: { 'Content-Type': `multipart/form-data` },
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: res?.data?.message || res?.message || 'Payment receipt uploaded successfully',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getPaymentReceipts = (data) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.payment_receipts(data.id)}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setPaymentReceipts(res?.data?.data));
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsFetching(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.message || 'Something went wrong',
            }),
        );
    }
};

export const getPaymentAccount = (id) => async (dispatch) => {
    if (id) {
        dispatch(setIsFetching(true));
        try {
            const res = await api.get(`${URL.admin_payment_account}?user_id=${id}`);
            if (res.status === successStatusCode) {
                dispatch(setIsFetching(false));
                dispatch(setPaymentAccount(res?.data?.data || []));
            }
        } catch (err) {
            const error = err.response?.data;
            dispatch(setIsFetching(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'error',
                    message: error?.message || 'Something went wrong',
                }),
            );
        }
    }
};

export const contactUs = (data) => async (dispatch) => {
    try {
        const res = await api.post(`${URL.contactUs}`, {
            ...data,
        });
        if (res.status === 201) {
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Your messge was sent',
                }),
            );
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.errors ? JSON.stringify(error?.errors) : error?.message || 'Something went wrong',
            }),
        );
    }
};

export const postBankStatement = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_bank_statement}`, {
            code: data.auth_code,
        });
        if (res.status === 201) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: res?.data?.message || 'Bank statement uploaded successfully',
                }),
            );
            return res;
        }
    } catch (err) {
        const error = err.response?.data;
        dispatch(setIsLoading(false));
        dispatch(
            setAlert({
                show: true,
                type: 'error',
                message: error?.errors ? JSON.stringify(error?.errors) : error?.message || 'Something went wrong',
            }),
        );
    }
};
