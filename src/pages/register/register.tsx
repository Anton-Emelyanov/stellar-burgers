import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  registerAsync,
  getUser,
  getUserError,
  isUserLoading
} from '../../slices/user-auth-slice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(getUser);
  const loadingState = useSelector(isUserLoading);
  const errorMessage = useSelector(getUserError);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerAsync({ email: email, password: password, name: userName })
    );
  };

  if (loadingState) {
    return <Preloader />;
  } else if (!loadingState && user) {
    navigate('/');
  } else {
    return (
      <RegisterUI
        errorText={errorMessage}
        email={email}
        userName={userName}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
      />
    );
  }
};
