import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { FC } from 'react';
import { Preloader } from '@ui';
import { ISecureRouteOptions } from './type';
import { RootState } from '../services/store';

export const ProtectedRoute: FC<ISecureRouteOptions> = ({
  children,
  anonymous = false
}) => {
  const { isAuthenticated, isFetching } = useSelector(
    (state: RootState) => state.user
  );

  const location = useLocation();
  const redirect = location.state?.from || '/';

  if (isFetching) {
    return <Preloader />;
  }

  if (anonymous && isAuthenticated) {
    return <Navigate to={redirect} />;
  }

  if (!anonymous && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
