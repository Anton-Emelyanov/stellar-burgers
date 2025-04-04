import styles from './constructor-page.module.css';

import { BurgerIngredients } from '@components';
import { BurgerConstructor } from '@components';
import { FC } from 'react';

export const ConstructorPage: FC = () => (
  // Проверку статусу загрузки делаем в главном компоненте
  <main className={styles.containerMain}>
    <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
      Соберите бургер
    </h1>
    <div className={`${styles.main} pl-5 pr-5`}>
      <BurgerIngredients />
      <BurgerConstructor />
    </div>
  </main>
);
