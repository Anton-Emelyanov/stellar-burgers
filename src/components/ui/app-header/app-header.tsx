import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

const routes = [
  {
    path: '/',
    icon: BurgerIcon,
    text: 'Конструктор'
  },
  {
    path: '/feed',
    icon: ListIcon,
    text: 'Лента заказов'
  },
  {
    path: '/profile',
    icon: ProfileIcon,
    text: 'Личный кабинет'
  }
];

const MenuItem: FC<{
  path: string;
  icon: any;
  text: string;
  location?: any;
  userName?: string;
}> = ({ path, icon, text, location, userName }) => (
  <Link
    to={path}
    className={
      path === '/feed'
        ? location.pathname.startsWith(path)
          ? styles.link_active
          : styles.link
        : location.pathname === path
          ? styles.link_active
          : styles.link
    }
    state={{ from: location }}
  >
    {React.createElement(icon, {
      type:
        path === '/feed'
          ? location.pathname.startsWith(path)
            ? 'primary'
            : 'disabled'
          : location.pathname === path
            ? 'primary'
            : 'disabled'
    })}
    <p className='text text_type_main-default ml-2'>
      {path === '/profile' ? userName || text : text}
    </p>
  </Link>
);

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName, location }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {routes.slice(0, 2).map((route, index) => (
          <MenuItem
            key={index}
            path={route.path}
            icon={route.icon}
            text={route.text}
            location={location}
          />
        ))}
      </div>
      <div className={styles.logo}>
        <Link to='/' state={{ from: location }}>
          <Logo className={styles.link_active} />
        </Link>
      </div>

      <div className={styles.link_position_last}>
        <MenuItem
          path={routes[2].path}
          icon={routes[2].icon}
          text={routes[2].text}
          location={location}
          userName={userName}
        />
      </div>
    </nav>
  </header>
);
