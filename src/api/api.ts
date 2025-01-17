import axios from 'axios';
import type { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

import { LOCAL_SERVER_URL, PRODUCTION_SERVER_URL, NODE_ENV } from '~constants';

type Environment = 'development' | 'production';

class Api {
  ccServer: AxiosInstance;
  role: string | null;

  constructor() {
    this.role = null;
    this.ccServer = axios.create({
      baseURL:
        (NODE_ENV as Environment) === 'development'
          ? LOCAL_SERVER_URL
          : PRODUCTION_SERVER_URL,
    });

    const token = Cookies.get('userToken');

    // Add a request interceptor
    this.ccServer.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }
}

export const api = new Api();
