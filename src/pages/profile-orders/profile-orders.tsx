import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  getOrdersAsync,
  getOrdersList,
  getOrdersLoadingState
} from '../../slices/orders-config-slice';

export const ProfileOrders: FC = () => {
  const orders = useSelector(getOrdersList);
  const ordersLoadingState = useSelector(getOrdersLoadingState);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersAsync());
  }, [dispatch]);

  return ordersLoadingState ? (
    <Preloader />
  ) : (
    <ProfileOrdersUI orders={orders} />
  );
};
