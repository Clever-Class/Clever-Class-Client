import axios from 'axios';
import type { AxiosInstance } from 'axios';

import { LOCAL_SERVER_URL, PRODUCTION_SERVER_URL, NODE_ENV } from '~constants';

type Environment = 'development' | 'production';

class Api {
  ccServer: AxiosInstance;

  constructor() {
    this.ccServer = axios.create({
      baseURL:
        (NODE_ENV as Environment) === 'development'
          ? LOCAL_SERVER_URL
          : PRODUCTION_SERVER_URL,
    });
  }
}

export const api = new Api();
