import { FC } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getAllComponents } from '../../slices/burger-constructor-slice';

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
    <IngredientDetailsUI
      isPrimary={isPrimary}
      ingredientData={ingredientData}
    />
  );
};
