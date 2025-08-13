import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
//import  AuthSlice from './reducers/auth';
import cartReducer from './reducers/cartSlice';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedCartReducer  = persistReducer(persistConfig, cartReducer);


export const store = configureStore({
  reducer: {
  cart: persistedCartReducer,  
},
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      //{
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

export const persistorStore = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
