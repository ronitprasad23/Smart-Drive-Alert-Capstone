import api from './api';

const login = async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        // Since the login endpoint returns tokens but not full user details (usually),
        // we might need to fetch the profile immediately or just decode/store what we have.
        // For now, let's assume we proceed. We can fetch profile separately.
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

const getProfile = async () => {
    // Assuming there's an endpoint to get the current user's profile
    // Based on urls.py verify: path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    const response = await api.get('/user/profile/');
    return response.data;
};

const authService = {
    login,
    logout,
    getProfile
};

export default authService;
