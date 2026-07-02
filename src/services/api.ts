import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:3011' : 'http://localhost:3011';

const api = axios.create({
  baseURL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
