import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { setAlert, setIsFetching } from '../../store/components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'defaulters',
    initialState: {
        defaulters: null,
    },
    reducers: {
        setDefaulters: (state, { payload }) => {
            state.defaulters = payload;
        },
    },
});
export default slice.reducer;

// Actions
const { setDefaulters } = slice.actions;

const successStatusCode = 200 || 201;

export const getDefaulters = (data) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_defaulters}?page=${data.page}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setDefaulters(res.data.data));
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
