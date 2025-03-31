import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import {
  setBurgerBun,
  addTopping,
  setSauce
} from '../../slices/burger-constructor-slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setBurgerBun({ ingredient, id: nanoid() }));
      } else if (ingredient.type === 'main') {
        dispatch(addTopping({ ingredient, id: nanoid() }));
      } else {
        dispatch(setSauce({ ingredient, id: nanoid() }));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
