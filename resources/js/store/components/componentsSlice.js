import { createSlice } from '@reduxjs/toolkit';

// Slice
const slice = createSlice({
    name: 'components',
    initialState: {
        isFetching: false,
        isLoading: false,
        alert: {},
    },
    reducers: {
        IsFetching: (state, { payload }) => {
            state.isFetching = payload;
        },
        IsLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        Alert: (state, { payload }) => {
            state.alert = {
                show: payload.show,
                type: payload.type,
                message: payload.message,
                close: true,
            };
        },
    },
});
export default slice.reducer;

// Actions
const { IsFetching, IsLoading, Alert } = slice.actions;

export const setIsFetching = IsFetching;
export const setIsLoading = IsLoading;
export const setAlert = Alert;
export const closeAlert = () => async (dispatch) => {
    dispatch(setAlert({}));
};
