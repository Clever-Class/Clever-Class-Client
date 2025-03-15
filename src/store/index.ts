import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers, Reducer } from 'redux';
import { registerReducer, userReducer } from './reducers';
import type { RootState } from '~types';

const rootReducer = combineReducers({
  user: userReducer as Reducer<RootState['user']>,
  register: registerReducer as Reducer<RootState['register']>,
});

const persistConfig = {
  key: 'root',
  storage,
  // You can add blacklist or whitelist here if needed
  whitelist: ['user', 'register'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

export type { RootState };
export type AppDispatch = typeof store.dispatch;
