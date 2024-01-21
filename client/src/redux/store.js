import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlices/userSlice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
})