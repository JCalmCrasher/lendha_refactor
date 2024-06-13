import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { setAlert, setIsFetching } from '../../store/components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'merchants',
    initialState: {
        merchants: null,
        merchantLoans: null,
    },
    reducers: {
        setMerchants: (state, { payload }) => {
            state.merchants = payload;
        },
        setMerchantLoans: (state, { payload }) => {
            state.merchantLoans = payload;
        },
    },
});
export default slice.reducer;

// Actions
const { setMerchants, setMerchantLoans } = slice.actions;

const successStatusCode = 200 || 201;

export const getMerchants = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_merchants}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setMerchants(res.data.data));
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

export const getMerchantLoans = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.merchant_loans}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setMerchantLoans(res.data.data));
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
