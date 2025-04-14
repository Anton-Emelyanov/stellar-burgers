import orderConfigSlice, {
  getOrdersList,
  getOrderNumber,
  getOrderLoadingStatus,
  getSuccessfulOrder,
  getIsOrderSuccessful,
  getFeedResponse,
  getOrdersLoadingState,
  getOrderErrorMessage,
  resetOrderState,
  stopOrderLoading,
  getFeedsAsync,
  getOrdersAsync,
  orderBurgerAsync,
  getOrderByNumberAsync,
  initialState
} from './orders-config-slice';

import { IOrderState, TOrder } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done',
  name: 'Order 1',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  number: 1
};

type TFeedsResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const mockFeedsResponse: TFeedsResponse = {
  success: true,
  orders: [mockOrder],
  total: 10,
  totalToday: 5
};

describe('Слайс заказов (orderConfigSlice)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(orderConfigSlice(undefined, { type: '' })).toEqual(initialState);
  });

  describe('синхронные экшены', () => {
    it('должен обрабатывать resetOrderState', () => {
      const stateWithOrder = {
        ...initialState,
        successfulOrder: mockOrder
      };
      const action = resetOrderState();
      const state = orderConfigSlice(stateWithOrder, action);
      expect(state.successfulOrder).toBeNull();
    });

    it('должен обрабатывать stopOrderLoading', () => {
      const stateWithLoading = {
        ...initialState,
        isOrderProcessing: true
      };
      const action = stopOrderLoading();
      const state = orderConfigSlice(stateWithLoading, action);
      expect(state.isOrderProcessing).toBe(false);
    });
    it('getFeedsAsync должен вызывать getFeedsApi', async () => {
      (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedsResponse);
      const dispatch = jest.fn();
      await getFeedsAsync()(dispatch, () => ({}), undefined);
      expect(getFeedsApi).toHaveBeenCalled();
    });
    it('должен обрабатывать ошибку API в getOrdersAsync', async () => {
      (getOrdersApi as jest.Mock).mockRejectedValue(new Error('API Error'));
      const dispatch = jest.fn();
      await getOrdersAsync()(dispatch, () => ({}), undefined);
      expect(dispatch.mock.calls[1][0].type).toBe(getOrdersAsync.rejected.type);
    });
  });

  describe('асинхронные экшены', () => {
    describe('getOrdersAsync', () => {
      it('должен обрабатывать pending состояние', () => {
        const action = { type: getOrdersAsync.pending.type };
        const state = orderConfigSlice(initialState, action);
        expect(state.isFetching).toBe(true);
      });

      it('должен обрабатывать fulfilled состояние', () => {
        const action = {
          type: getOrdersAsync.fulfilled.type,
          payload: [mockOrder]
        };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          orderList: [mockOrder],
          isFetching: false
        });
      });

      it('должен обрабатывать rejected состояние', () => {
        const action = {
          type: getOrdersAsync.rejected.type,
          error: { message: 'Ошибка загрузки заказов' }
        };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          isFetching: false,
          errorMessage: 'Ошибка загрузки заказов'
        });
      });
    });

    describe('getFeedsAsync', () => {
      it('должен обрабатывать pending состояние', () => {
        const action = { type: getFeedsAsync.pending.type };
        const state = orderConfigSlice(initialState, action);
        expect(state.isFetching).toBe(true);
      });

      it('должен обрабатывать fulfilled состояние', () => {
        const action = {
          type: getFeedsAsync.fulfilled.type,
          payload: mockFeedsResponse
        };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          feedsResponse: mockFeedsResponse,
          isFetching: false
        });
      });

      it('должен обрабатывать rejected состояние', () => {
        const action = {
          type: getFeedsAsync.rejected.type,
          error: { message: 'Ошибка загрузки ленты заказов' }
        };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          isFetching: false,
          errorMessage: 'Ошибка загрузки ленты заказов'
        });
      });
    });

    describe('orderBurgerAsync', () => {
      it('должен обрабатывать pending состояние', () => {
        const action = { type: orderBurgerAsync.pending.type };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          isOrderProcessing: true,
          isOrderSuccessful: null
        });
      });

      it('должен обрабатывать fulfilled состояние', () => {
        const action = {
          type: orderBurgerAsync.fulfilled.type,
          payload: { order: mockOrder }
        };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          successfulOrder: mockOrder,
          isOrderSuccessful: true,
          isOrderProcessing: false
        });
      });

      it('должен обрабатывать rejected состояние', () => {
        const action = {
          type: orderBurgerAsync.rejected.type,
          error: { message: 'Ошибка создания заказа' }
        };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          isOrderProcessing: false,
          isOrderSuccessful: false,
          errorMessage: 'Ошибка создания заказа'
        });
      });
    });

    describe('getOrderByNumberAsync', () => {
      it('должен обрабатывать pending состояние', () => {
        const action = { type: getOrderByNumberAsync.pending.type };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          isOrderProcessing: true,
          orderNumber: null
        });
      });

      it('должен обрабатывать fulfilled состояние', () => {
        const action = {
          type: getOrderByNumberAsync.fulfilled.type,
          payload: { orders: [mockOrder] }
        };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          isOrderProcessing: false,
          orderNumber: mockOrder
        });
      });

      it('должен обрабатывать rejected состояние', () => {
        const action = {
          type: getOrderByNumberAsync.rejected.type,
          error: { message: 'Ошибка поиска заказа' }
        };
        const state = orderConfigSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          isOrderProcessing: false,
          errorMessage: 'Ошибка поиска заказа'
        });
      });
    });
  });

  describe('селекторы', () => {
    const mockState = {
      orders: {
        isFetching: true,
        orderList: [mockOrder],
        orderNumber: mockOrder,
        feedsResponse: mockFeedsResponse,
        errorMessage: null,
        successfulOrder: mockOrder,
        isOrderSuccessful: true,
        isOrderProcessing: false
      }
    };

    it('getOrdersList должен возвращать список заказов', () => {
      expect(getOrdersList(mockState as any)).toEqual([mockOrder]);
    });

    it('getOrderNumber должен возвращать номер заказа', () => {
      expect(getOrderNumber(mockState as any)).toEqual(mockOrder);
    });

    it('getOrderLoadingStatus должен возвращать статус загрузки заказа', () => {
      expect(getOrderLoadingStatus(mockState as any)).toBe(false);
    });

    it('getSuccessfulOrder должен возвращать успешный заказ', () => {
      expect(getSuccessfulOrder(mockState as any)).toEqual(mockOrder);
    });

    it('getIsOrderSuccessful должен возвращать статус успешности заказа', () => {
      expect(getIsOrderSuccessful(mockState as any)).toBe(true);
    });

    it('getFeedResponse должен возвращать ответ ленты заказов', () => {
      expect(getFeedResponse(mockState as any)).toEqual(mockFeedsResponse);
    });

    it('getOrdersLoadingState должен возвращать статус загрузки', () => {
      expect(getOrdersLoadingState(mockState as any)).toBe(true);
    });

    it('getOrderErrorMessage должен возвращать сообщение об ошибке', () => {
      expect(getOrderErrorMessage(mockState as any)).toBeNull();
    });
  });
});
