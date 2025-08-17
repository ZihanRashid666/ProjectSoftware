import axios from 'axios';

const axiosInstance = axios.create({
  http:'http://3.27.185.254:3000',
  baseURL: 'http://3.27.185.254:3000',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
