// utils/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  res => res,
  error => Promise.reject(error?.response?.data || error)
);

export default apiClient;
