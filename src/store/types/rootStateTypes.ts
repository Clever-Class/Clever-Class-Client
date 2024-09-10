import { RegisterStateType } from './registerStateTypes';
import { UserState } from './userStateTypes';

export interface RootStateType {
  user: UserState;
  register: RegisterStateType;
}
