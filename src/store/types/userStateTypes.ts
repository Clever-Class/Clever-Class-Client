import { User } from '~/types';

export interface UserState {
  userToken: string | null;
  loading: boolean;
  message: string | null;
  error: string | null;
  user: User | null;
}
