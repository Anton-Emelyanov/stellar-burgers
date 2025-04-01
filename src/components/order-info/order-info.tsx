import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { getAllComponents } from '../../slices/burger-constructor-slice';
import {
  getOrderByNumberAsync,
  getOrderNumber
} from '../../slices/orders-config-slice';

export const OrderInfo: FC<{ isModal?: boolean }> = ({ isModal }) => {
  const orderData = useSelector(getOrderNumber);
  const ingredients = useSelector(getAllComponents);
  const dispatch = useDispatch();
  const { number } = useParams();
  useEffect(() => {
    dispatch(getOrderByNumberAsync(Number(number)));
  }, []);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (!ingredient) return acc; // Если ингредиент не найден, пропускаем

        if (!acc[item]) {
          acc[item] = {
            ...ingredient,
            count: ingredient.type === 'bun' ? 2 : 1
          };
        } else {
          acc[item].count += ingredient.type === 'bun' ? 2 : 1;
        }
        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};
