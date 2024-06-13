import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { buildQueryParams, successStatusCode } from '../../components/utils/helper';
import { setAlert, setIsFetching } from '../../store/components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'collections',
    initialState: {
        collections: [],
        filteredCollections: [],
    },
    reducers: {
        setCollections: (state, { payload }) => {
            state.collections = payload;
        },
        setFilteredCollections: (state, { payload }) => {
            state.filteredCollections = payload;
        },
    },
});

// Actions
const { setCollections, setFilteredCollections } = slice.actions;

export const getCollections = (data) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const params = {};

        const page = data?.page || 1;
        if (page) params.page = page;
        const queryParams = buildQueryParams(params);

        const res = await api.get(`${URL.admin_collections}${queryParams}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setCollections(res?.data || []));
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

export const searchCollections = (data) => async (dispatch) => {
    const { start_date, end_date, officer_id, branch_id, page } = data;

    dispatch(setIsFetching(true));

    try {
        const params = {};
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;
        if (officer_id) params.officer_id = officer_id;
        if (branch_id) params.branch_id = branch_id;
        if (page) params.page = page;

        const queryParams = buildQueryParams(params);

        const res = await api.get(`${URL.admin_search_collections}${queryParams}`);
        if (res.status === successStatusCode) {
            dispatch(setIsFetching(false));
            dispatch(setCollections(res?.data || []));
            dispatch(setFilteredCollections(res?.data || []));
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
