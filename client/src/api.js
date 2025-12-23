import axios from 'axios';

// const API_URL = 'https://student-54b8.onrender.com/api';
const API_URL = 'https://student-2-production.up.railway.app/api';
// const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth Services
export const loginUser = (userData) => api.post('/auth/login', userData);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/me');
export const verifyAdminAccess = (password) => api.post('/auth/admin-access', { password });
export const trackVisit = () => api.post('/auth/track-visit');
export const fetchUsers = () => api.get('/auth/users');
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);

// Content Services
export const fetchContent = () => api.get('/content');
export const createContent = (contentData) => api.post('/content', contentData);
export const updateContent = (id, contentData) => api.put(`/content/${id}`, contentData);
export const deleteContent = (id) => api.delete(`/content/${id}`);

// Notes Services
export const fetchNotes = () => api.get('/notes');
export const fetchAllNotes = () => api.get('/notes/all');
export const createNote = (noteData) => api.post('/notes', noteData);
export const updateNote = (id, noteData) => api.put(`/notes/${id}`, noteData);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// Section Services
export const fetchSections = () => api.get('/sections');
export const createSection = (sectionData) => api.post('/sections', sectionData);
export const deleteSection = (id) => api.delete(`/sections/${id}`);

// Practical Services
export const fetchPracticals = () => api.get('/practicals');
export const createPractical = (practicalData) => api.post('/practicals', practicalData);
export const updatePractical = (id, practicalData) => api.put(`/practicals/${id}`, practicalData);
export const deletePractical = (id) => api.delete(`/practicals/${id}`);

export default api;
