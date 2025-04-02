import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import { useSelector } from '../../services/store';
import { getAllComponents } from '../../slices/ingredients-slice';

export const BurgerIngredients: FC = () => {
  const [buns, setBurgerBuns] = useState<TIngredient[]>([]);
  const [mains, addMains] = useState<TIngredient[]>([]);
  const [sauces, setSauces] = useState<TIngredient[]>([]);
  const components = useSelector(getAllComponents);

  useEffect(() => {
    if (components) {
      setBurgerBuns(
        components.filter((ingredient) => ingredient.type === 'bun')
      );
      addMains(components.filter((ingredient) => ingredient.type === 'main'));
      setSauces(components.filter((ingredient) => ingredient.type === 'sauce'));
    }
  }, [components]);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun' && titleBunRef.current)
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main' && titleMainRef.current)
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce' && titleSaucesRef.current)
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
