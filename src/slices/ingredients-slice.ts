import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../services/store';

export const getIngredientsAsync = createAsyncThunk(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);

interface IngredientsState {
  isFetching: boolean;
  components: TIngredient[];
  errorMessage: string | null;
}

const initialState: IngredientsState = {
  isFetching: false,
  components: [],
  errorMessage: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIngredientsAsync.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getIngredientsAsync.rejected, (state, action) => {
      state.isFetching = false;
      state.errorMessage = action.error?.message ?? 'Ошибка';
    });
    builder.addCase(getIngredientsAsync.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.components = payload;
    });
  }
});

export const getIngredientsLoadingState = (state: RootState) =>
  state.ingredients.isFetching;
export const getAllComponents = (state: RootState) =>
  state.ingredients.components;

export default ingredientsSlice.reducer;
