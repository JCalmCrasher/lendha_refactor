import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { setAlert, setIsFetching } from '../../store/components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'referrals',
    initialState: {
        referrals: null,
    },
    reducers: {
        setReferrals: (state, { payload }) => {
            state.referrals = payload;
        },
    },
});
export default slice.reducer;

// Actions
const { setReferrals } = slice.actions;

const successStatusCode = 200 || 201;

export const getReferrals = (data) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_referrals}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setReferrals(res.data.data));
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
