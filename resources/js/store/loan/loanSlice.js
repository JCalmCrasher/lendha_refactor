import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { setAlert, setIsFetching, setIsLoading } from '../../store/components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'loan',
    initialState: {
        loanPurposes: null,
        adminLoanRequests: null,
        adminLoanDetails: null,
        subAdminList: null,
        applyLoanInfo: {},
        businessPictures: [],
    },
    reducers: {
        setApplyLoanInfo: (state, action) => {
            state.applyLoanInfo = action.payload;
        },
        setLoanPurposes: (state, { payload }) => {
            state.loanPurposes = payload;
        },
        setAdminLoanRequests: (state, { payload }) => {
            state.adminLoanRequests = payload;
        },
        setAdminLoanDetails: (state, { payload }) => {
            state.adminLoanDetails = payload;
        },
        setSubAdminList: (state, { payload }) => {
            state.subAdminList = payload;
        },
        setBusinessPictures: (state, { payload }) => {
            state.businessPictures = payload;
        },
    },
});
export default slice.reducer;

// Actions
const {
    setLoanPurposes,
    setAdminLoanRequests,
    setAdminLoanDetails,
    setSubAdminList,
    setApplyLoanInfo,
    setBusinessPictures: setBusinessImages,
} = slice.actions;

const successStatusCode = 200 || 201;

export const getBusinessPictures = (id) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`/admin/get_user/${id}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setBusinessImages(res?.data?.data?.business?.business_pictures || []));
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

export const postApplyLoanInfo = (data) => async (dispatch) => {
    dispatch(setApplyLoanInfo(data));
};

export const getLoanPurposes = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.loan_purposes}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setLoanPurposes(res.data.data));
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

export const postNewLoanApplication = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_new_loan}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            // dispatch(
            //   setAlert({
            //     show: true,
            //     type: "success",
            //     message: "New loan application successful"
            //   })
            // );
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

export const getAdminLoanRequests = (data) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_loans}?page=${data.page}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setAdminLoanRequests(res.data.data));
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

export const postNewLoanInterest = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_new_loan_interest}`, {
            ...data,
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Loan interest added successfully',
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

export const postUpdateLoanInterest = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.put(`${URL.admin_new_loan_interest}`, {
            ...data,
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Loan interest updated successfully',
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

export const postAutoDenyLoans = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_auto_deny}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Auto deny loans successful',
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

export const getSearchLoans = (data) => async (dispatch) => {
    const { page, searchTerm, status, startDate, endDate, date_filter } = data;

    dispatch(setIsFetching(true));
    try {
        let res = null;
        let dateFilter;
        if (date_filter !== 'custom') {
            dateFilter = `&date_filter=${date_filter}`;
        } else if (startDate && endDate) {
            dateFilter = `&start_date=${startDate}&end_date=${endDate}&date_filter=${date_filter}`;
        } else {
            dateFilter = '';
        }

        res = await api.get(
            `${URL.admin_search_loans}?page=${page}${
                searchTerm && `&email=${searchTerm}`
            }${status && `&status=${status}`}${dateFilter}`,
        );
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setAdminLoanRequests(res.data.data));
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

export const getLoanDetails = (loan_id) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const { data, status } = await api.get(`${URL.admin_loan_detail}${loan_id}`);
        const res = {
            data,
            status,
        };

        if (status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setAdminLoanDetails(res.data.data));
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

export const getSubAdminList = (loan_id) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_get_subadmin}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setSubAdminList(res.data.data));
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

export const postAdminUpdateLoan = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_update_loan}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Loan information updated successfully',
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

export const postAutoDebit = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_auto_debit}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: res?.data?.message === 'failed' ? 'error' : 'success',
                    message: res?.data?.data?.message ? res?.data?.data?.message : 'Auto debit attempted',
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

export const postLoanStatus = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_loan_status}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Loan status updated successfully',
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

export const postLoanRepayments = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.put(`${URL.admin_loan_repayment}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Loan payment updated successfully',
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

export const postModifyLoanPurpose = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_modify_loan_purpose}`, {
            ...data,
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Loan purpose updated successfully',
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
