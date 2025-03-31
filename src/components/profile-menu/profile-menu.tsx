import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutAsync } from '../../slices/user-auth-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
