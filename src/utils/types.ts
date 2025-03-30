import { TFeedsResponse } from '@api';

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export interface IAuthStatus {
  isInitialized: boolean;
  isFetching: boolean;
  user: TUser | null;
  errorMessage: string | null;
  isAuthenticated: boolean;
}

export interface IComponentsState {
  isFetching: boolean;
  components: TIngredient[];
  errorMessage: string | null;
  constructorElements: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

export interface IOrderState {
  isFetching: boolean;
  orderList: TOrder[];
  orderNumber: TOrder | null;
  feedsResponse: TFeedsResponse | null;
  errorMessage: string | null;
  successfulOrder: TOrder | null;
  isOrderSuccessful: true | false | null;
  isOrderProcessing: boolean;
}
