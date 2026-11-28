import { createSlice } from '@reduxjs/toolkit';

const getInitialDarkMode = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('studenthub_theme') === 'dark';
};

const initialState = {
    darkMode: getInitialDarkMode(),
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
            localStorage.setItem('studenthub_theme', state.darkMode ? 'dark' : 'light');
        },
        setDarkMode: (state, action) => {
            state.darkMode = Boolean(action.payload);
            localStorage.setItem('studenthub_theme', state.darkMode ? 'dark' : 'light');
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setModalOpen: (state, action) => {
            const { modalName, isOpen } = action.payload;
            if (Object.prototype.hasOwnProperty.call(state.modals, modalName)) {
                state.modals[modalName] = isOpen;
            }
        },
    },
});

export const { toggleDarkMode, setDarkMode, toggleSidebar, setModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
