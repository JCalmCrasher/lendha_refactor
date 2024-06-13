import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import adminSlice from './admin/adminSlice';
import branchSlice from './branch/branchSlice';
import collectionSlice from './collection/collectionSlice';
import componentsSlice from './components/componentsSlice';
import defaultersSlice from './defaulters/defaultersSlice';
import investmentSlice from './investment/investmentSlice';
import loanSlice from './loan/loanSlice';
import merchantsSlice from './merchants/merchantsSlice';
import reconciliationSlice from './reconciliation/reconciliationSlice';
import referralsSlice from './referrals/referralsSlice';
import userSlice from './user/userSlice';

const reducer = combineReducers({
    // add all reducers here
    componentsSlice,
    userSlice,
    adminSlice,
    loanSlice,
    investmentSlice,
    merchantsSlice,
    defaultersSlice,
    reconciliationSlice,
    collectionSlice,
    branchSlice,
    referralsSlice,
});
const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
