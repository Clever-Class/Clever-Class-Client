/* eslint-disable @typescript-eslint/lines-between-class-members */

import axios from 'axios';
import type { AxiosInstance } from 'axios';

import { LOCAL_SERVER_URL, RENDER_SERVER_URL, NODE_ENV } from '~constants';

class Api {
    ccServer: AxiosInstance;

    constructor() {
        this.ccServer = axios.create({
            baseURL:
                NODE_ENV === 'development'
                    ? LOCAL_SERVER_URL
                    : RENDER_SERVER_URL,
        });
    }
}

export const api = new Api();
