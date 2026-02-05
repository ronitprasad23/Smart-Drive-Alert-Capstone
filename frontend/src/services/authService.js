import api from './api';

const login = async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

const getProfile = async () => {

    const response = await api.get('/user/profile/');
    return response.data;
};

const authService = {
    login,
    logout,
    getProfile
};

export default authService;