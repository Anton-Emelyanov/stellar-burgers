import { FC } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getAllComponents } from '../../slices/ingredients-slice';
import styles from './ingredient-details.module.css';

export const IngredientDetails: FC<{ isPrimary?: boolean }> = ({
  isPrimary = false
}) => {
  const { id } = useParams();
  const components = useSelector(getAllComponents);
  const ingredientData = components.find((item) => item._id == id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <>
      {isPrimary && (
        <div className={`${styles.title} text text_type_main-large`}>
          Детали ингридиента
        </div>
      )}
      <IngredientDetailsUI
        isPrimary={isPrimary}
        ingredientData={ingredientData}
      />
    </>
  );
};
