export const NODE_ENV = import.meta.env.VITE_NODE_ENV as string;
export const PADDLE_TOKEN = import.meta.env.VITE_PADDLE_TOKEN as string;
export const PADDLE_ENVIRONMENT = import.meta.env
  .VITE_PADDLE_ENVIRONMENT as string;

export const SERVER_URL =
  NODE_ENV === 'production'
    ? (import.meta.env.VITE_SERVER_URL as string)
    : (import.meta.env.VITE_LOCAL_SERVER_URL as string) ||
      'http://localhost:8000';

export const DEFAULT_SELECTED_PACKAGE = import.meta.env
  .VITE_DEFAULT_SELECTED_PACKAGE as string;

export const PLAN_ID_FREE = import.meta.env.VITE_PLAN_ID_FREE as string;
export const PLAN_ID_STARTER = import.meta.env.VITE_PLAN_ID_STARTER as string;
export const PLAN_ID_PRO = import.meta.env.VITE_PLAN_ID_PRO as string;
