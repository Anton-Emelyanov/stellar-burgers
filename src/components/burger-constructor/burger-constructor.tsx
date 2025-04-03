import { FC, useMemo, useEffect, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../slices/user-auth-slice';
import {
  clearConstructor,
  getConstructorElements
} from '../../slices/burger-constructor-slice';
import {
  resetOrderState,
  stopOrderLoading,
  orderBurgerAsync,
  getOrderLoadingStatus,
  getSuccessfulOrder,
  getIsOrderSuccessful
} from '../../slices/orders-config-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(getUser);
  const constructorItems = useSelector(getConstructorElements);
  const orderRequest = useSelector(getOrderLoadingStatus);
  const orderModalData = useSelector(getSuccessfulOrder);
  const isSuccessed = useSelector(getIsOrderSuccessful);

  const ingredientsId = useMemo(
    () =>
      [
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun?._id
      ].filter(Boolean) as string[],
    [constructorItems]
  );

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun || orderRequest || !ingredientsId.length) return;

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(orderBurgerAsync(ingredientsId));
  }, [constructorItems, orderRequest, user, ingredientsId]);

  useEffect(() => {
    if (isSuccessed) dispatch(clearConstructor());
  }, [isSuccessed]);

  useEffect(() => {
    if (isSuccessed) dispatch(clearConstructor());
  }, [isSuccessed]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetOrderState());
    dispatch(stopOrderLoading());
  }, []);

  const price = useMemo(
    () =>
      (constructorItems.bun?.price || 0) * 2 +
      constructorItems.ingredients.reduce(
        (acc: number, item: TConstructorIngredient) => acc + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
