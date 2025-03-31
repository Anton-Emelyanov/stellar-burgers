import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedsAsync,
  getFeedResponse,
  getOrdersLoadingState
} from '../../slices/orders-config-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feeds = useSelector(getFeedResponse);
  const isLoading = useSelector(getOrdersLoadingState);

  useEffect(() => {
    dispatch(getFeedsAsync());
  }, []);

  const shouldShowPreloader = isLoading || !feeds?.orders;

  if (shouldShowPreloader) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feeds.orders}
      handleGetFeeds={() => {
        dispatch(getFeedsAsync());
      }}
    />
  );
};
