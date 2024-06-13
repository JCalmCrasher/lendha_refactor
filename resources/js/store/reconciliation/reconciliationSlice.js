import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { buildQueryParams, successStatusCode } from '../../components/utils/helper';
import { setAlert, setIsFetching } from '../../store/components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'reconciliation',
    initialState: {
        reconciliations: [],
        filteredReconciliations: [],
    },
    reducers: {
        setReconciliation: (state, { payload }) => {
            state.reconciliations = payload;
        },
        setFilteredReconciliation: (state, { payload }) => {
            state.filteredReconciliations = payload;
        },
    },
});

// Actions
const { setReconciliation, setFilteredReconciliation } = slice.actions;

export const getReconciliation = (data) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const params = {};

        const page = data?.page || 1;
        if (page) params.page = page;
        const queryParams = buildQueryParams(params);

        const res = await api.get(`${URL.admin_reconciliation}${queryParams}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setReconciliation(res?.data || []));
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

export const searchReconciliation = (data) => async (dispatch) => {
    const { start_date, end_date, branch_id, officer_id } = data;

    dispatch(setIsFetching(true));

    try {
        const params = {};
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;
        if (branch_id) params.branch_id = branch_id;
        if (officer_id) params.officer_id = officer_id;

        const queryParams = buildQueryParams(params);

        const res = await api.get(`${URL.admin_search_reconciliation}${queryParams}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setReconciliation(res?.data || []));
            dispatch(setFilteredReconciliation(res?.data || []));
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

export default slice.reducer;
