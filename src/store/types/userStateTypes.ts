export interface UserState {
  userToken: string | null;
  loading: boolean;
  message: string | null;
  error: string | null;
  user?: {
    id: string;
    email: string;
    country: string;
  };
}
