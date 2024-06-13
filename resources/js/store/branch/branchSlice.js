import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { successStatusCode } from '../../components/utils/helper';
import { setAlert, setIsFetching } from '../../store/components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'branch',
    initialState: {
        branches: [],
        branch: {},
        creditOfficer: {},
        performance: {},
    },
    reducers: {
        setBranch: (state, { payload }) => {
            state.branch = payload;
        },
        setBranches: (state, { payload }) => {
            state.branches = payload;
        },
        setCreditOfficer: (state, { payload }) => {
            state.creditOfficer = payload;
        },
        setPerformance: (state, { payload }) => {
            state.performance = payload;
        },
    },
});
export default slice.reducer;

// Actions
export const { setBranch, setBranches, setCreditOfficer, setPerformance } = slice.actions;

export const getBranch = (id) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_branches}/${id}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setBranch(res?.data));
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

export const getBranches = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(URL.admin_branches);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setBranches(res?.data));
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

export const getOfficerPerformance =
    ({ branch_id, officer_id }) =>
    async (dispatch) => {
        dispatch(setIsFetching(true));
        try {
            const res = await api.get(`${URL.admin_branches}/${branch_id}/officer/${officer_id}`);
            if (res.status === successStatusCode) {
                dispatch(setIsFetching(false));
                dispatch(setPerformance(res?.data?.data));
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
