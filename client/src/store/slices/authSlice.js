import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: !!localStorage.getItem('isAuthenticated'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            localStorage.removeItem('isAuthenticated');
            // BUG-18 fix: Token is purely cookie-based, no need to clear 'token' from localStorage
        },
    },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
