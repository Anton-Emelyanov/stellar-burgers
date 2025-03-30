import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '@api';
import { IOrderState } from '@utils-types';
import { RootState } from '../services/store';

export const getFeedsAsync = createAsyncThunk('orders/getFeeds', getFeedsApi);

export const getOrdersAsync = createAsyncThunk(
  'orders/getOrders',
  getOrdersApi
);

export const orderBurgerAsync = createAsyncThunk(
  'orders/orderBurger',
  orderBurgerApi
);

export const getOrderByNumberAsync = createAsyncThunk(
  'orders/getOrderByNumber',
  getOrderByNumberApi
);

const initialState: IOrderState = {
  isFetching: false,
  orderList: [],
  orderNumber: null,
  feedsResponse: null,
  errorMessage: null,
  successfulOrder: null,
  isOrderSuccessful: null,
  isOrderProcessing: false
};

const handleError = (state: IOrderState, action: any) => {
  state.errorMessage = action.error?.message ?? 'Ошибка';
};

const setIsFetching = (state: IOrderState, value: boolean) => {
  state.isFetching = value;
};

const setIsOrderProcessing = (state: IOrderState, value: boolean) => {
  state.isOrderProcessing = value;
};

const orderConfigSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.successfulOrder = null;
    },
    stopOrderLoading: (state) => {
      state.isOrderProcessing = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getOrdersAsync.pending, (state) => {
      setIsFetching(state, true);
    });
    builder.addCase(getOrdersAsync.rejected, (state, action) => {
      setIsFetching(state, false);
      handleError(state, action);
    });
    builder.addCase(getOrdersAsync.fulfilled, (state, { payload }) => {
      setIsFetching(state, false);
      state.orderList = payload;
    });
    builder.addCase(getFeedsAsync.pending, (state) => {
      setIsFetching(state, true);
    });
    builder.addCase(getFeedsAsync.rejected, (state, action) => {
      setIsFetching(state, false);
      handleError(state, action);
    });
    builder.addCase(getFeedsAsync.fulfilled, (state, { payload }) => {
      setIsFetching(state, false);
      state.feedsResponse = payload;
    });
    builder.addCase(orderBurgerAsync.pending, (state) => {
      setIsOrderProcessing(state, true);
      state.isOrderSuccessful = null;
    });
    builder.addCase(orderBurgerAsync.rejected, (state, action) => {
      setIsOrderProcessing(state, false);
      state.isOrderSuccessful = false;
      handleError(state, action);
    });
    builder.addCase(orderBurgerAsync.fulfilled, (state, action) => {
      state.successfulOrder = action.payload.order;
      state.isOrderSuccessful = true;
      setIsOrderProcessing(state, false);
    });
    builder.addCase(getOrderByNumberAsync.pending, (state) => {
      setIsOrderProcessing(state, true);
      state.orderNumber = null;
    });
    builder.addCase(getOrderByNumberAsync.rejected, (state, action) => {
      setIsOrderProcessing(state, false);
      handleError(state, action);
    });
    builder.addCase(getOrderByNumberAsync.fulfilled, (state, action) => {
      setIsOrderProcessing(state, false);
      state.orderNumber = action.payload.orders[0];
    });
  }
});

export const getOrdersList = (state: RootState) => state.orders.orderList;
export const getOrderNumber = (state: RootState) => state.orders.orderNumber;
export const getOrderLoadingStatus = (state: RootState) =>
  state.orders.isOrderProcessing;
export const getSuccessfulOrder = (state: RootState) =>
  state.orders.successfulOrder;
export const getIsOrderSuccessful = (state: RootState) =>
  state.orders.isOrderSuccessful;
export const getFeedResponse = (state: RootState) => state.orders.feedsResponse;
export const getOrdersLoadingState = (state: RootState) =>
  state.orders.isFetching;
export const getOrderErrorMessage = (state: RootState) =>
  state.orders.errorMessage;
export const { resetOrderState, stopOrderLoading } = orderConfigSlice.actions;
export default orderConfigSlice.reducer;
