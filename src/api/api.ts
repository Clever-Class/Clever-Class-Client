import axios from 'axios';
import type { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import store from '~store';

import { NODE_ENV, SERVER_URL } from '~constants';

type Environment = 'development' | 'production';

class Api {
  ccServer: AxiosInstance;
  role: string | null;

  constructor() {
    this.role = null;
    this.ccServer = axios.create({
      baseURL: SERVER_URL as Environment,
      withCredentials: false,
    });

    // Add a request interceptor
    this.ccServer.interceptors.request.use(
      (config) => {
        // Try to get token from cookies first
        let token = Cookies.get('userToken');
        console.log('API Interceptor - Token from cookies:', token);
        console.log('NODE_ENV', NODE_ENV);

        // If no token in cookies, try to get from Redux store
        if (!token) {
          const state = store.getState();
          token = state.user.userToken || undefined;
          console.log('API Interceptor - Token from Redux:', token);
        }

        // Set default headers
        config.headers = config.headers || {};

        // Don't set Content-Type for FormData - axios will set it automatically with boundary
        if (!(config.data instanceof FormData)) {
          config.headers['Content-Type'] = 'application/json';
        }

        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Methods'] =
          'GET, POST, PUT, DELETE, OPTIONS';
        config.headers['Access-Control-Allow-Headers'] =
          'Origin, Content-Type, Accept, Authorization, X-Request-With';

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('API Interceptor - Final headers:', config.headers);
        } else {
          console.log('API Interceptor - No token found');
        }

        return config;
      },
      (error) => {
        console.error('API Interceptor - Request error:', error);
        return Promise.reject(error);
      },
    );

    // Add a response interceptor to handle 401 errors
    this.ccServer.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Interceptor - Response error:', error);
        if (error.response?.status === 401) {
          // Clear the token and redirect to login
          Cookies.remove('userToken');
          store.dispatch({ type: 'LOGOUT' });
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }
}

export const api = new Api();
