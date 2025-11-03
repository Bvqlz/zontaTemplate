import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, 
});

// request interceptor 
// what this does is that before any request is sent, it will attach the token if it exists
// config represents the request being sent
// an error occurs when setting up the request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// response interceptor
// response represents the response received from the server
// error occurs during the response should an error occur, such as 401 unauthorized
// we want to handle that globally here
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            // if unauthorize, we want a user to login again
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

