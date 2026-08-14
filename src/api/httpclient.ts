import axios from 'axios';
import { Platform } from 'react-native';
import { ClearLocalStorage, GetLocalStorage } from '../utils/SecureStorage';

// Base URL setup:
// 1. Production / Cloudflare Tunnel: 'https://patron.service.cloudflaredb.xyz'
// 2. Local Android Emulator: 'http://10.0.2.2:3000' (or your backend port)
// 3. Local Physical Device (same Wi-Fi): 'http://<YOUR_COMPUTER_IP>:3000' (e.g., 'http://10.60.124.31:3000')
const DEFAULT_URL = 'https://patron.service.cloudflaredb.xyz';
const baseURL = DEFAULT_URL;

const Axios = axios.create({
  baseURL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

Axios.interceptors.request.use(
  async (config) => {
    const token = await GetLocalStorage('t_s_tk');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await ClearLocalStorage();
      return error?.response;
    } else if (error.response && (error.response.status === 400 || error.response.status === 403)) {
      console.log(`HTTP ${error.response.status} Response:`, error.response.data);
      return error?.response;
    } else {
      console.log(`❌ Network/Server connection failure targeting base URL [${baseURL}]:`, error.message || error);
      return Promise.reject(error);
    }
  }
);

class HttpClient {
  async get(url: string, params?: any) {
    try {
      const response = await Axios.get(url, { params });
      console.log(`http data get: ${url}`, response.data);
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [GET ${baseURL}${url}]:`, error.message, error.code ? `(${error.code})` : '');
      return null;
    }
  }

  async post(url: string, data?: any, params?: any) {
    try {
      const response = await Axios.post(url, data, { params });
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [POST ${baseURL}${url}]:`, error.message, error.code ? `(${error.code})` : '');
      return null;
    }
  }

  async put(url: string, data?: any) {
    try {
      const response = await Axios.put(url, data);
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [PUT ${baseURL}${url}]:`, error.message, error.code ? `(${error.code})` : '');
      return null;
    }
  }

  async patch(url: string, data?: any) {
    try {
      const response = await Axios.patch(url, data);
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [PATCH ${baseURL}${url}]:`, error.message, error.code ? `(${error.code})` : '');
      return null;
    }
  }

  async delete(url: string, params?: any) {
    try {
      const response = await Axios.delete(url, { params });
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [DELETE ${baseURL}${url}]:`, error.message, error.code ? `(${error.code})` : '');
      return null;
    }
  }
}

export default new HttpClient();
export { baseURL };