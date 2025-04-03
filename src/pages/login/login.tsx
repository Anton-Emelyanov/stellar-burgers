import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  loginAsync,
  getUser,
  getUserError,
  isUserLoading
} from '../../slices/user-auth-slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const errorMessage = useSelector(getUserError);
  const user = useSelector(getUser);
  const loadingState = useSelector(isUserLoading);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.from || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginAsync({ email: email, password: password }));
  };
  if (loadingState) {
    return <Preloader />;
  } else if (!loadingState && user) {
    navigate(redirect, { replace: true });
  } else {
    return (
      <LoginUI
        errorText={errorMessage}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    );
  }
};
