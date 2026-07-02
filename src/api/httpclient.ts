import axios from 'axios';
import { Platform } from 'react-native';
import { ClearLocalStorage, GetLocalStorage } from '../utils/SecureStorage';

// const baseURL = Platform.OS === 'android' ? 'http://192.168.1.24:3000' : 'http://localhost:3000';
const baseURL = Platform.OS === 'android' ? 'http://192.168.1.13:3000' : 'http://192.168.1.13:3000';


const Axios = axios.create({
  baseURL,
  timeout: 500000,
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
      return error?.response;
    } else {
      return Promise.reject(error);  // ← FIXED
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
      console.log(`❌ http error [GET ${url}]:`, error.message);  // ← shows real error
      return null;
    }
  }

  async post(url: string, data?: any, params?: any) {
    try {
      const response = await Axios.post(url, data, { params });
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [POST ${url}]:`, error.message);
      return null;
    }
  }

  async put(url: string, data?: any) {
    try {
      const response = await Axios.put(url, data);
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [PUT ${url}]:`, error.message);
      return null;
    }
  }

  async patch(url: string, data?: any) {   // ✅ ADD THIS
    try {
      const response = await Axios.patch(url, data);
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [PATCH ${url}]:`, error.message);
      return null;
    }
  }

  async delete(url: string, params?: any) {
    try {
      const response = await Axios.delete(url, { params });
      return response.data;
    } catch (error: any) {
      console.log(`❌ http error [DELETE ${url}]:`, error.message);
      return null;
    }
  }
}

export default new HttpClient();
export { baseURL };