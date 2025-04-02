import { createSlice } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { RootState } from '../services/store';

const createConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({ ...ingredient, id });

interface ConstructorState {
  constructorElements: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: ConstructorState = {
  constructorElements: {
    bun: null,
    ingredients: []
  }
};

const burgerConstructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBurgerBun: (
      state,
      { payload }: { payload: { ingredient: TIngredient; id: string } }
    ) => {
      state.constructorElements.bun = createConstructorIngredient(
        payload.ingredient,
        `${payload.id}-top`
      );
    },
    resetBurgerBun: (state) => {
      state.constructorElements.bun = null;
    },
    addTopping: (
      state,
      { payload }: { payload: { ingredient: TIngredient; id: string } }
    ) => {
      state.constructorElements.ingredients.push(
        createConstructorIngredient(payload.ingredient, payload.id)
      );
    },
    setSauce: (
      state,
      { payload }: { payload: { ingredient: TIngredient; id: string } }
    ) => {
      state.constructorElements.ingredients.splice(
        Math.floor(state.constructorElements.ingredients.length / 2),
        0,
        createConstructorIngredient(payload.ingredient, payload.id)
      );
    },
    removeTopping: (state, { payload }: { payload: number }) => {
      state.constructorElements.ingredients.splice(payload, 1);
    },
    clearConstructor: (state) => {
      state.constructorElements = { bun: null, ingredients: [] };
    },
    reorderToppingUp: (state, { payload }: { payload: number }) => {
      if (
        payload < 1 ||
        payload >= state.constructorElements.ingredients.length
      ) {
        return;
      }
      const ingredients = state.constructorElements.ingredients;
      [ingredients[payload - 1], ingredients[payload]] = [
        ingredients[payload],
        ingredients[payload - 1]
      ];
    },
    reorderToppingDown: (state, { payload }: { payload: number }) => {
      if (
        payload < 0 ||
        payload >= state.constructorElements.ingredients.length - 1
      ) {
        return;
      }
      const ingredients = state.constructorElements.ingredients;
      [ingredients[payload], ingredients[payload + 1]] = [
        ingredients[payload + 1],
        ingredients[payload]
      ];
    }
  }
});

export const getConstructorElements = (state: RootState) =>
  state.burgerConstructor.constructorElements;

export const {
  setBurgerBun,
  resetBurgerBun,
  addTopping,
  setSauce,
  removeTopping,
  clearConstructor,
  reorderToppingUp,
  reorderToppingDown
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
