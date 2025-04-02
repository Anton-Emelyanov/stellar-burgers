import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userAuthReducer from '../slices/user-auth-slice';
import ingredientsReducer from '../slices/ingredients-slice';
import burgerConstructorReducer from '../slices/burger-constructor-slice';
import orderConfigReducer from '../slices/orders-config-slice';

export const rootReducer = combineReducers({
  user: userAuthReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: orderConfigReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
