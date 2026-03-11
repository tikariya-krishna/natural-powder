import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../firebase/client.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Always attach a fresh Firebase ID token when available
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth(firebaseApp);
    const currentUser = auth.currentUser;

    if (currentUser) {
      const idToken = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    } else if (config.headers.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

