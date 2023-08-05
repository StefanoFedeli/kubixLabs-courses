import axios from 'axios';
import {useAppStore} from "@/store/app";

const baseUrl = import.meta.env.VITE_APP_API || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: baseUrl,
});

// Add a request interceptor
client.interceptors.request.use(function (config) {
  const appStore = useAppStore();
  const token = appStore.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export const api = {
  async register(data: any) {
    return await client.post('/users/register', data);
  },
  async login(data: LoginData) {
    return await client.post('/users/login', data);
  },
  async getBadges() {
    return await client.get('/badges');
  },
  async claimAllBadges() {
    return await client.post('/badges/all');
  }
}

export default api;

