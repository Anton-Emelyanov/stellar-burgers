import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '../utils/cookie';
import { IAuthStatus } from '@utils-types';
import { RootState } from '../services/store';

import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

export const registerAsync = createAsyncThunk(
  'users/registerUser',
  async ({ email, name, password }: TRegisterData) => {
    const data = await registerUserApi({ email, name, password });
    if (data.success) {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    }
    return null;
  }
);

export const loginAsync = createAsyncThunk(
  'users/loginUser',
  async ({ email, password }: TLoginData) => {
    const data = await loginUserApi({ email, password });
    if (data.success) {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    }
    return null;
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'users/forgotPassword',
  forgotPasswordApi
);

export const resetPasswordAsync = createAsyncThunk(
  'users/resetPassword',
  resetPasswordApi
);

export const fetchUserAsync = createAsyncThunk('user/getUser', getUserApi);

export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  updateUserApi
);

export const logoutAsync = createAsyncThunk('user/logoutUser', async () => {
  const res = await logoutApi();
  if (res.success) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return res;
});

const initialState: IAuthStatus = {
  isInitialized: false,
  isFetching: false,
  user: null,
  errorMessage: null,
  isAuthenticated: false
};

export const userAuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInitialized = true;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state: IAuthStatus) => {
      state.isFetching = true;
      state.errorMessage = null;
    };

    const handleRejected = (state: IAuthStatus, action: any) => {
      state.isFetching = false;
      state.errorMessage = action.error?.message ?? 'Ошибка';
    };

    const handleFulfilledWithAuth = (state: IAuthStatus, { payload }: any) => {
      state.isFetching = false;
      state.isInitialized = true;
      state.errorMessage = null;
      state.user = payload?.user || null;
      state.isAuthenticated = true;
    };

    const handleFulfilledWithoutAuth = (state: IAuthStatus) => {
      state.isFetching = false;
      state.errorMessage = null;
    };

    builder
      .addCase(loginAsync.pending, handlePending)
      .addCase(loginAsync.rejected, handleRejected)
      .addCase(loginAsync.fulfilled, handleFulfilledWithAuth);

    builder
      .addCase(registerAsync.pending, handlePending)
      .addCase(registerAsync.rejected, handleRejected)
      .addCase(registerAsync.fulfilled, handleFulfilledWithAuth);

    builder
      .addCase(fetchUserAsync.pending, handlePending)
      .addCase(fetchUserAsync.rejected, handleRejected)
      .addCase(fetchUserAsync.fulfilled, handleFulfilledWithAuth);

    builder
      .addCase(updateUserAsync.fulfilled, (state, { payload }) => {
        state.user = payload?.user;
        state.errorMessage = null;
      })
      .addCase(updateUserAsync.rejected, handleRejected);

    builder
      .addCase(forgotPasswordAsync.pending, handlePending)
      .addCase(forgotPasswordAsync.rejected, handleRejected)
      .addCase(forgotPasswordAsync.fulfilled, handleFulfilledWithoutAuth);

    builder
      .addCase(resetPasswordAsync.pending, handlePending)
      .addCase(resetPasswordAsync.rejected, handleRejected)
      .addCase(resetPasswordAsync.fulfilled, handleFulfilledWithoutAuth);

    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.errorMessage = null;
      state.isAuthenticated = false;
    });
  }
});

export const { init } = userAuthSlice.actions;
export const getUser = (state: RootState) => state.user.user;
export const getUserError = (state: RootState) => state.user.errorMessage;
export const isUserLoading = (state: RootState) => state.user.isFetching;
export const isLoggedIn = (state: RootState) => state.user.isAuthenticated;
export default userAuthSlice.reducer;
