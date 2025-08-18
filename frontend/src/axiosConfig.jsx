import axios from 'axios';

const axiosInstance = axios.create({
  //http:'http://3.27.185.254:5001',
  baseURL: 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
