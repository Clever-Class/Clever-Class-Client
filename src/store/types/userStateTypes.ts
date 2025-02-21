import { User } from '~/types';
import { Subscription } from '~/store/types';

export interface UserState {
  userToken: string | null;
  loading: boolean;
  message: string | null;
  error: string | null;
  user: User | null;
  subscription: Subscription | null;
}
