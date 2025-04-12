import burgerConstructorSlice, {
  getConstructorElements,
  setBurgerBun,
  resetBurgerBun,
  addTopping,
  setSauce,
  removeTopping,
  clearConstructor,
  reorderToppingUp,
  reorderToppingDown
} from './burger-constructor-slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('Проверяем Бургер конструктор', () => {
  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: 'image-url',
    image_mobile: 'mobile-image-url',
    image_large: 'large-image-url'
  };

  const mockConstructorIngredient: TConstructorIngredient = {
    ...mockIngredient,
    id: '1'
  };

  const initialState = {
    constructorElements: {
      bun: null,
      ingredients: []
    }
  };

  it('должен вернуть исходное состояние', () => {
    expect(burgerConstructorSlice(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  describe('actions', () => {
    it('должен обрабатывать setBurgerBun', () => {
      const action = setBurgerBun({
        ingredient: mockIngredient,
        id: '1'
      });
      const result = burgerConstructorSlice(initialState, action);

      expect(result.constructorElements.bun).toEqual({
        ...mockIngredient,
        id: '1-top'
      });
    });

    it('должен обрабатывать resetBurgerBun', () => {
      const stateWithBun = {
        constructorElements: {
          bun: mockConstructorIngredient,
          ingredients: []
        }
      };
      const result = burgerConstructorSlice(stateWithBun, resetBurgerBun());

      expect(result.constructorElements.bun).toBeNull();
    });

    it('должен обрабатывать addTopping', () => {
      const action = addTopping({
        ingredient: mockIngredient,
        id: '1'
      });
      const result = burgerConstructorSlice(initialState, action);

      expect(result.constructorElements.ingredients).toEqual([
        mockConstructorIngredient
      ]);
    });

    it('должен обрабатывать setSauce', () => {
      const stateWithIngredients = {
        constructorElements: {
          bun: null,
          ingredients: [
            { ...mockConstructorIngredient, id: '1' },
            { ...mockConstructorIngredient, id: '2' }
          ]
        }
      };
      const newSauce = { ...mockIngredient, _id: '3', type: 'sauce' };
      const action = setSauce({
        ingredient: newSauce,
        id: '3'
      });
      const result = burgerConstructorSlice(stateWithIngredients, action);

      expect(result.constructorElements.ingredients).toEqual([
        { ...mockConstructorIngredient, id: '1' },
        { ...newSauce, id: '3' },
        { ...mockConstructorIngredient, id: '2' }
      ]);
    });

    it('должен обрабатыватьremoveTopping', () => {
      const stateWithIngredients = {
        constructorElements: {
          bun: null,
          ingredients: [
            { ...mockConstructorIngredient, id: '1' },
            { ...mockConstructorIngredient, id: '2' }
          ]
        }
      };
      const action = removeTopping(0);
      const result = burgerConstructorSlice(stateWithIngredients, action);

      expect(result.constructorElements.ingredients).toEqual([
        { ...mockConstructorIngredient, id: '2' }
      ]);
    });

    it('должен обрабатывать clearConstructor', () => {
      const stateWithItems = {
        constructorElements: {
          bun: mockConstructorIngredient,
          ingredients: [
            { ...mockConstructorIngredient, id: '1' },
            { ...mockConstructorIngredient, id: '2' }
          ]
        }
      };
      const result = burgerConstructorSlice(stateWithItems, clearConstructor());

      expect(result).toEqual(initialState);
    });

    describe('повторный заказ ToppingUp', () => {
      it('должен переместить ингредиент вверх, когда это возможно', () => {
        const stateWithIngredients = {
          constructorElements: {
            bun: null,
            ingredients: [
              { ...mockConstructorIngredient, id: '1' },
              { ...mockConstructorIngredient, id: '2' }
            ]
          }
        };
        const action = reorderToppingUp(1);
        const result = burgerConstructorSlice(stateWithIngredients, action);

        expect(result.constructorElements.ingredients).toEqual([
          { ...mockConstructorIngredient, id: '2' },
          { ...mockConstructorIngredient, id: '1' }
        ]);
      });

      it('не должен передвигать первый ингредиент вверх', () => {
        const stateWithIngredients = {
          constructorElements: {
            bun: null,
            ingredients: [
              { ...mockConstructorIngredient, id: '1' },
              { ...mockConstructorIngredient, id: '2' }
            ]
          }
        };
        const action = reorderToppingUp(0);
        const result = burgerConstructorSlice(stateWithIngredients, action);

        expect(result.constructorElements.ingredients).toEqual([
          { ...mockConstructorIngredient, id: '1' },
          { ...mockConstructorIngredient, id: '2' }
        ]);
      });
    });

    describe('повторный заказ ToppingDown', () => {
      it('должен переместить ингредиент вниз, когда это возможно', () => {
        const stateWithIngredients = {
          constructorElements: {
            bun: null,
            ingredients: [
              { ...mockConstructorIngredient, id: '1' },
              { ...mockConstructorIngredient, id: '2' }
            ]
          }
        };
        const action = reorderToppingDown(0);
        const result = burgerConstructorSlice(stateWithIngredients, action);

        expect(result.constructorElements.ingredients).toEqual([
          { ...mockConstructorIngredient, id: '2' },
          { ...mockConstructorIngredient, id: '1' }
        ]);
      });

      it('не должен перемещать последний ингредиент вниз', () => {
        const stateWithIngredients = {
          constructorElements: {
            bun: null,
            ingredients: [
              { ...mockConstructorIngredient, id: '1' },
              { ...mockConstructorIngredient, id: '2' }
            ]
          }
        };
        const action = reorderToppingDown(1);
        const result = burgerConstructorSlice(stateWithIngredients, action);

        expect(result.constructorElements.ingredients).toEqual([
          { ...mockConstructorIngredient, id: '1' },
          { ...mockConstructorIngredient, id: '2' }
        ]);
      });
    });
  });

  describe('селекторы', () => {
    it('должен выбрать элементы конструктора', () => {
      const mockState = {
        burgerConstructor: {
          constructorElements: {
            bun: mockConstructorIngredient,
            ingredients: [mockConstructorIngredient]
          }
        }
      };

      expect(getConstructorElements(mockState as any)).toEqual(
        mockState.burgerConstructor.constructorElements
      );
    });
  });
});
