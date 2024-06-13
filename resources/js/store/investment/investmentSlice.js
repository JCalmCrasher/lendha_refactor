import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { setAlert, setIsFetching, setIsLoading } from '../../store/components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'investment',
    initialState: {
        investment_plans: [],
        userInvestments: null,
        adminInvestors: null,
    },
    reducers: {
        setInvestmentPlans: (state, { payload }) => {
            state.investment_plans = payload;
        },
        setUserInvestments: (state, { payload }) => {
            state.userInvestments = payload;
        },
        setAdminInvestors: (state, { payload }) => {
            state.adminInvestors = payload;
        },
    },
});
export default slice.reducer;

// Actions
const { setInvestmentPlans, setUserInvestments, setAdminInvestors } = slice.actions;

const successStatusCode = 200 || 201;

export const getInvestmentPlans = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.investment_plans}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setInvestmentPlans(res.data.data));
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

export const getUserInvestments = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.user_investments}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setUserInvestments(res.data.data));
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

export const postUserInvestment = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.user_invest}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'New investment successful',
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

export const getAdminInvestors = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_investors}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setAdminInvestors(res.data.data));
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

export const postAdminNewInvestmentPackage = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_add_investment_package}`, {
            ...data,
        });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'New investment package added successfully',
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

export const postAdminNewInvestor = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_new_investor}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'New user investment successful',
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
