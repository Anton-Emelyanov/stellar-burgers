import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import { ProtectedRoute } from '../../protected-route';
import { Preloader } from '@ui';

import { fetchUserAsync } from '../../slices/user-auth-slice';
import {
  getIngredientsAsync,
  getIngredientsLoadingState
} from '../../slices/ingredients-slice';
import { useSelector, useDispatch } from '../../services/store';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const position = location.state?.background;
  const loadingState = useSelector(getIngredientsLoadingState);

  useEffect(() => {
    dispatch(getIngredientsAsync());
    dispatch(fetchUserAsync());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {loadingState ? (
        <Preloader />
      ) : (
        <>
          <Routes location={position || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/feed/:number'
              element={<OrderInfo isModal={false} />}
            />
            <Route
              path='/ingredients/:id'
              element={<IngredientDetails isPrimary />}
            />
            <Route
              path='/login'
              element={
                <ProtectedRoute anonymous>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute anonymous>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute anonymous>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute anonymous>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo isModal={false} />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {position && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    onClose={() => {
                      navigate(-1);
                    }}
                  >
                    <OrderInfo isModal />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal
                    title='Детали ингредиента'
                    onClose={() => {
                      navigate(-1);
                    }}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal
                      onClose={() => {
                        navigate(-1);
                      }}
                    >
                      <OrderInfo isModal />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
