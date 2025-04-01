import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import {
  IComponentsState,
  TIngredient,
  TConstructorIngredient
} from '@utils-types';
import { RootState } from '../services/store';

export const getIngredientsAsync = createAsyncThunk(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);

const createConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({ ...ingredient, id });

const initialState: IComponentsState = {
  isFetching: false,
  components: [],
  errorMessage: null,
  constructorElements: {
    bun: null,
    ingredients: []
  }
};

const burgerConstructorSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setBurgerBun: (
      state,
      { payload }: { payload: { ingredient: TIngredient; id: string } }
    ) => {
      const bun1 = createConstructorIngredient(
        payload.ingredient,
        `${payload.id}-top`
      );
      const bun2 = createConstructorIngredient(
        payload.ingredient,
        `${payload.id}-bottom`
      );

      state.constructorElements.bun = bun1;
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
        return; // Выходим, если индекс недопустим
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
        return; // Выходим, если индекс недопустим
      }
      const ingredients = state.constructorElements.ingredients;
      [ingredients[payload], ingredients[payload + 1]] = [
        ingredients[payload + 1],
        ingredients[payload]
      ];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsAsync.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getIngredientsAsync.rejected, (state, action) => {
      state.isFetching = false;
      state.errorMessage = action.error?.message ?? 'Unknown error';
    });
    builder.addCase(getIngredientsAsync.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.components = payload;
    });
  }
});

export const getIngredientsLoadingState = (state: RootState) =>
  state.toppings.isFetching;
export const getAllComponents = (state: RootState) => state.toppings.components;
export const getConstructorElements = (state: RootState) =>
  state.toppings.constructorElements;

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
