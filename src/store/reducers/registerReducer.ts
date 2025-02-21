import { REMOVE_PRICING_PLAN, SELECT_PRICING_PLAN } from '~constants';
import { RegisterStateType } from '~store/types';

export const registerReducer = (state = {}, action: any): RegisterStateType => {
  switch (action.type) {
    case SELECT_PRICING_PLAN:
      return { ...state, selectedPackage: action.payload };
    case REMOVE_PRICING_PLAN:
      return { ...state, selectedPackage: null };
    default:
      return state;
  }
};
