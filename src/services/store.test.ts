import store, { rootReducer, RootState } from './store';

describe('Конфигурирование стора', () => {
  it('Проверяем, что store создан и содержит правильные редюсеры', () => {
    expect(store.getState()).toEqual({
      user: expect.any(Object),
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      orders: expect.any(Object)
    });
  });

  it('Проверяем начальное состояние каждого слайса', () => {
    const initialState = store.getState();

    expect(initialState.user).toEqual(
      userAuthReducer(undefined, { type: 'unknown' })
    );
    expect(initialState.ingredients).toEqual(
      ingredientsReducer(undefined, { type: 'unknown' })
    );
    expect(initialState.burgerConstructor).toEqual(
      burgerConstructorReducer(undefined, { type: 'unknown' })
    );
    expect(initialState.orders).toEqual(
      orderConfigReducer(undefined, { type: 'unknown' })
    );
  });

  it('Проверяем rootReducer', () => {
    const testAction = { type: 'TEST_ACTION' };
    const state = rootReducer(undefined, testAction);

    expect(state).toEqual({
      user: expect.any(Object),
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      orders: expect.any(Object)
    });
  });

  it('Проверяем тип RootState на соответствие состояния стора', () => {
    const state: RootState = store.getState();

    expect(state).toEqual({
      user: expect.any(Object),
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      orders: expect.any(Object)
    });
  });
});

// Моки для редюсеров, так как мы их импортируем для проверки initialState
jest.mock('../slices/user-auth-slice', () => ({
  __esModule: true,
  default: jest.fn(
    (state = { user: null, isAuthChecked: false }, action) => state
  )
}));

jest.mock('../slices/ingredients-slice', () => ({
  __esModule: true,
  default: jest.fn(
    (state = { ingredients: [], loading: false, error: null }, action) => state
  )
}));

jest.mock('../slices/burger-constructor-slice', () => ({
  __esModule: true,
  default: jest.fn((state = { bun: null, ingredients: [] }, action) => state)
}));

jest.mock('../slices/orders-config-slice', () => ({
  __esModule: true,
  default: jest.fn(
    (state = { orders: [], loading: false, error: null }, action) => state
  )
}));

// Импортируем после моков, чтобы использовать моковые версии
import userAuthReducer from '../slices/user-auth-slice';
import ingredientsReducer from '../slices/ingredients-slice';
import burgerConstructorReducer from '../slices/burger-constructor-slice';
import orderConfigReducer from '../slices/orders-config-slice';
