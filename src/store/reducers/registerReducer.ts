import { createSlice } from '@reduxjs/toolkit';
import { RegisterState } from '~store/types';
import { REMOVE_PRICING_PLAN, SELECT_PRICING_PLAN } from '~constants';

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
  selectedPackage: null,
  message: null,
};

export const registerReducer = (
  state = initialState,
  action: any,
): RegisterState => {
  switch (action.type) {
    case SELECT_PRICING_PLAN:
      return { ...state, selectedPackage: action.payload };
    case REMOVE_PRICING_PLAN:
      return { ...state, selectedPackage: null };
    default:
      return state;
  }
};
