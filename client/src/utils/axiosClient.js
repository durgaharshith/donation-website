import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Include credentials for CORS requests 
})

export default axiosClient;