import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Force dark theme only (remove white/light theme)
    darkMode: true,
    sidebarOpen: false,
    modals: {
        auth: false,
        upload: false,
        practicalUpload: false,
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setModalOpen: (state, action) => {
            const { modalName, isOpen } = action.payload;
            if (state.modals.hasOwnProperty(modalName)) {
                state.modals[modalName] = isOpen;
            }
        },
    },
});

export const { toggleDarkMode, toggleSidebar, setModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
