import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
    baseURL: 'https://haohoang-backend-quiz.onrender.com/v1/api',
    withCredentials: true
},
);

// instance.defaults.withCredentials = true;

instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwt')}`;

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const status = error && error.response && error.response.status || 500;
    switch (status) {
        // authentication (token ralated issues)
        case 401: {
            if (window.location.pathname !== '/' &&
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/register'
            ) {
                toast.error('Unauthorized the user. Please login...');
            }
            return error.response.DT;
        }

        // forbidden (permission ralated issues)
        case 403: {
            toast.error(`You dont permission to access this resource...`);
            return Promise.reject(error)
        }

        default: {
            return Promise.reject(error)
        }
    }

    // let res = {}
    // if (error.response) {
    //     // Request made and server responded
    //     res.DT = error.response.DT;
    //     res.status = error.response.status;
    //     res.headers = error.response.headers;
    // } else if (error.request) {
    //     // The request was made but no response was received
    //     console.log(error.request);
    // } else {
    //     // Something happened in setting up the request that triggered an Error
    //     console.log('Error', error.message);
    // }
    // return res;
    // return Promise.reject(error);

});

export default instance;