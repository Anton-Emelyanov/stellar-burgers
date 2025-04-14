import ingredientsSlice, {
  getIngredientsAsync,
  getIngredientsLoadingState,
  getAllComponents,
  IngredientsState,
  initialState
} from './ingredients-slice';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: 'image-url',
    image_mobile: 'mobile-image-url',
    image_large: 'large-image-url'
  },
  {
    _id: '2',
    name: 'Соус',
    type: 'sauce',
    proteins: 5,
    fat: 10,
    carbohydrates: 20,
    calories: 150,
    price: 75,
    image: 'image-url-2',
    image_mobile: 'mobile-image-url-2',
    image_large: 'large-image-url-2'
  }
];

describe('Слайс ингредиентов', () => {
  it('должен возвращать начальное состояние', () => {
    expect(ingredientsSlice(undefined, { type: '' })).toEqual(initialState);
  });

  describe('асинхронный thunk getIngredientsAsync', () => {
    it('должен обрабатывать состояние pending (загрузка)', () => {
      const action = { type: getIngredientsAsync.pending.type };
      const state = ingredientsSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isFetching: true
      });
    });

    it('должен обрабатывать состояние fulfilled (успешная загрузка)', () => {
      const action = {
        type: getIngredientsAsync.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice(initialState, action);

      expect(state).toEqual({
        isFetching: false,
        components: mockIngredients,
        errorMessage: null
      });
    });

    it('должен обрабатывать состояние rejected (ошибка загрузки)', () => {
      const error = new Error('Ошибка сети');
      const action = {
        type: getIngredientsAsync.rejected.type,
        error: { message: 'Ошибка сети' }
      };
      const state = ingredientsSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isFetching: false,
        errorMessage: 'Ошибка сети'
      });
    });

    it('должен вызывать getIngredientsApi и dispatch правильные экшены', async () => {
      (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const thunk = getIngredientsAsync();

      await thunk(dispatch, getState, undefined);

      expect(dispatch.mock.calls.map((call) => call[0].type)).toEqual([
        getIngredientsAsync.pending.type,
        getIngredientsAsync.fulfilled.type
      ]);

      expect(getIngredientsApi).toHaveBeenCalled();
    });

    it('должен корректно обрабатывать ошибку API', async () => {
      const errorMessage = 'Ошибка сети';
      (getIngredientsApi as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const dispatch = jest.fn();
      const getState = jest.fn();
      const thunk = getIngredientsAsync();

      await thunk(dispatch, getState, undefined);

      expect(dispatch.mock.calls.map((call) => call[0].type)).toEqual([
        getIngredientsAsync.pending.type,
        getIngredientsAsync.rejected.type
      ]);

      const rejectedAction = dispatch.mock.calls[1][0];
      expect(rejectedAction.error.message).toEqual(errorMessage);
    });
  });

  describe('селекторы', () => {
    it('должен возвращать состояние загрузки', () => {
      const mockState = {
        ingredients: {
          isFetching: true,
          components: [],
          errorMessage: null
        }
      };

      expect(getIngredientsLoadingState(mockState as any)).toBe(true);
    });

    it('должен возвращать все компоненты', () => {
      const mockState = {
        ingredients: {
          isFetching: false,
          components: mockIngredients,
          errorMessage: null
        }
      };

      expect(getAllComponents(mockState as any)).toEqual(mockIngredients);
    });
  });
});
