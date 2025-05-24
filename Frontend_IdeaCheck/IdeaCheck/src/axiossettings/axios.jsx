import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://87.228.89.66/api',
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    console.log("Используемый токен:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default instance;
