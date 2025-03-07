import { RegisterStateType } from './registerStateTypes';
import { UserState } from './userStateTypes';
import { User } from '~/types/user/user.types';

export interface RootStateType {
  user: UserState;
  register: RegisterStateType;
}
