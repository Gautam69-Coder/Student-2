import axios from 'axios';

// const API_URL = window.location.hostname === 'localhost'
//     ? 'http://localhost:5001/api'
//     : 'https://student-2-3ow8.onrender.com/api';

const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5001/api'
    : 'https://student-2-temprory.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Read JWT from localStorage (used in cross-origin environments where cookies may be blocked)
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response || error.code === 'ERR_NETWORK') {
            // Trigger a custom event for server offline
            window.dispatchEvent(new CustomEvent('server-offline'));
        }
        return Promise.reject(error);
    }
);

// Auth Services
export const loginUser = (userData) => api.post('/auth/login', userData);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/verify');
export const verifyAdminAccess = (password) => api.post('/auth/admin-access', { password });
export const trackVisit = () => api.post('/auth/track-visit');
export const fetchUsers = () => api.get('/auth/users');
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);
export const updateUserRole = (id, role) => api.put(`/auth/users/${id}/role`, { role });
export const logoutUser = () => api.post('/auth/logout');
export const userProfileUpdate = (field) => api.post('/auth/update-profile', { field })
export const googleLogin = (token) => api.post('/auth/google', { token });

// Content Services
export const fetchContent = () => api.get('/content');
export const createContent = (contentData) => api.post('/content', contentData);
export const updateContent = (id, contentData) => api.put(`/content/${id}`, contentData);
export const deleteContent = (id) => api.delete(`/content/${id}`);

// Notes Services
export const fetchNotes = () => api.get('/notes');
export const fetchNotesPaginated = (page = 1, limit = 10) => api.get(`/notes?page=${page}&limit=${limit}`);
export const fetchAllNotes = () => api.get('/notes/all');
export const createNoteFile = (noteData) => api.post('/notes/file', noteData, {
    headers: { "Content-Type": "multipart/form-data" }
})
export const createNoteText = (noteData) => api.post('/notes/text', noteData);

export const updateNoteText = (noteData) => api.put(`/notes/text`, noteData);
export const updateNoteFile = (noteData) => api.put('/notes/file', noteData, {
    headers: { "Content-Type": "multipart/form-data" }
})

export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const makeNotePublic = (id) => api.put(`/notes/public/${id}`);

// Section Services
export const fetchSections = () => api.get('/sections');
export const createSection = (sectionData) => api.post('/sections', { name: sectionData });
export const deleteSection = (id) => api.delete(`/sections/${id}`);

// Practical Services
export const fetchPracticals = () => api.get('/practicals');
export const createPractical = (practicalData) => api.post('/practicals', practicalData, {
    headers: { "Content-Type": "multipart/form-data" }
});
export const updatePractical = (id, practicalData) => api.put(`/practicals/${id}`, practicalData, {
    headers: { "Content-Type": "multipart/form-data" }
});
export const deletePractical = (id) => api.delete(`/practicals/${id}`);

// Feedback Services
export const submitFeedback = (feedbackData) => api.post('/feedback', feedbackData);
export const fetchAllFeedback = () => api.get('/feedback');
export const updateFeedbackStatus = (id, status) => api.patch(`/feedback/${id}`, { status });

// Notification Services
export const sendNotification = (formData) => api.post('/notifications', formData);
export const fetchNotifications = () => api.get('/notifications');
export const notificationStatusUpdate = (data) => api.post("/notifications/notification-status", data);
// Email Services
export const sendEmail = (emailData) => api.post('/email/send', emailData);

// Bookmark Services
export const toggleBookmark = (id) => api.put(`/auth/bookmark/${id}`);
export const fetchBookmarks = () => api.get('/auth/bookmarks');

// Community Services
export const fetchCommunityPosts = (page = 1, limit = 20) => api.get('/community', { params: { page, limit } });
export const createCommunityPost = (data) => api.post('/community', data);
export const toggleCommunityLike = (id) => api.post(`/community/${id}/like`);

// Tracking Api
export const sendTrackerHome = (section) => api.post('/hometracking', { section: section })
export const getTrackerData = () => api.get('/trackingData')

// Coding Practice Tracks
export const fetchCodingPractices = () => api.get('/coding-practices');
export const updateProblemStatus = (data) => api.put('/coding-practices/update-problem-status', { data });
export const fetchUserProgress = () => api.get('/coding-practices/user-progress')
export const addCodingPracticeTrack = (data) => api.post('/coding-practices/track', data);
export const updateCodingPracticeTrack = (id, data) => api.put(`/coding-practices/track/${id}`, data);
export const deleteCodingPracticeTrack = (id) => api.delete(`/coding-practices/track/${id}`);
export const addCodingPracticeProblem = (data) => api.post('/coding-practices/problem', data);
export const updateCodingPracticeProblem = (trackId, problemId, data) => api.put(`/coding-practices/track/${trackId}/problem/${problemId}`, data);
export const deleteCodingPracticeProblem = (trackId, problemId) => api.delete(`/coding-practices/track/${trackId}/problem/${problemId}`);

// Dashboard stats
export const fetchDashboardStats = () => api.get('/stats/dashboard')

//AI Assistant
export const aiAssistant = (data) => api.post('/aiassistant', { message: data })
export const aiCodeHelper = (context) => api.post('/aicodehelper', { context })
export const aiChatBot = (data) => api.post('/aichatbot', { message: data })
export const aiChatBotDeleteConversation = (data) => api.post('/aichatbot/delete', { deleteId: data })


//AI code Checker 
export const codeChecker = (data) => api.post('/code-checker', { data })

// Save User AI Api Key 
export const saveApiKey = (data) => api.post('/save-apikey', { data })



export default api;
