import { createSlice } from '@reduxjs/toolkit';

import api, { URL } from '../../api';
import { useLocalStorage } from '../../components/utils/helper';
import { setAlert, setIsFetching, setIsLoading } from '../components/componentsSlice';

// Slice
const slice = createSlice({
    name: 'admin',
    initialState: {
        roles: [],
        transferRequests: [],
    },
    reducers: {
        setRoles: (state, action) => {
            state.roles = action.payload;
        },
        setTransferRequests: (state, action) => {
            state.transferRequests = action.payload;
        },
    },
});
export default slice.reducer;

// Actions
export const { setRoles, setTransferRequests } = slice.actions;

const successStatusCode = 200 || 201;

export const getRoles = () => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.get(`${URL.admin_roles}`);
        if (res.status === successStatusCode) {
            const roles = res.data;
            dispatch(setIsLoading(false));
            dispatch(setRoles(roles));
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

export const getTransferRequests = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.get(`${URL.admin_transfer_requests}`);
        if (res.status === successStatusCode) {
            const requests = res?.data?.data;

            dispatch(setIsFetching(false));
            dispatch(setTransferRequests(requests));
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

export const reviewCustomerTransferRequest = (data) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const res = await api.patch(`${URL.admin_review_transfer_request(data.user_transfer_id)}`, {
            status: data?.status,
            denial_reason: data?.denial_reason,
        });
        if (res.status === successStatusCode) {
            const requests = res?.data?.data;

            dispatch(setIsFetching(false));
            dispatch(setTransferRequests(requests));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: res?.data?.message || 'Transfer request reviewed successfully',
                }),
            );
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

export const postAdminTeamMember = (data) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await api.post(`${URL.admin_users}`, { ...data });
        if (res.status === successStatusCode) {
            dispatch(setIsLoading(false));
            dispatch(
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Admin added successfully',
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
