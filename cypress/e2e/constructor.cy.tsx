const SELECTORS = {
  INGREDIENT: '[data-testid="ingredient"]',
  MODAL_INGREDIENT: '[data-testid="modal-ingredient"]',
  MODAL_CLOSE: '[data-testid="modal-close"]',
  MODAL_OVERLAY: '[data-testid="modal-overlay"]',
  CONSTRUCTOR: '[data-testid="constructor"]',
};

describe('Тесты получения ингредиентов через API', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').then((mockData) => {
      cy.intercept('GET', '**/ingredients', {
        statusCode: 200,
        body: mockData,
      }).as('getIngredients');
    });

    cy.visit('/');
  });

  it('Проверяет отображение ингредиентов на странице', () => {
    cy.wait('@getIngredients');

    cy.fixture('ingredients.json').then((mockData) => {
      mockData.data.forEach((ingredient) => {
        cy.contains(ingredient.name).as('ingredientItem'); // Используем alias
        cy.get('@ingredientItem').scrollIntoView().should('be.visible');
      });
    });
  });
});

describe('Тесты модального окна ингредиента', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Открытие модального окна ингредиента по клику', () => {
    // Создаем alias для первого ингредиента
    cy.get(SELECTORS.INGREDIENT).first().as('firstIngredient');

    // Кликаем по элементу через alias
    cy.get('@firstIngredient').click();

    // Проверяем модальное окно
    cy.get(SELECTORS.MODAL_INGREDIENT).should('be.visible');
  });

  it('Закрытие модального окна по клику на крестик', () => {
    cy.get(SELECTORS.INGREDIENT).first().as('firstIngredient');
    cy.get('@firstIngredient').click();

    cy.get(SELECTORS.MODAL_CLOSE).as('closeButton'); // Alias для кнопки закрытия
    cy.get('@closeButton').click();

    cy.get(SELECTORS.MODAL_INGREDIENT).should('not.exist');
  });

  it('Закрытие модального окна по клику на оверлей', () => {
    cy.get(SELECTORS.INGREDIENT).first().as('firstIngredient');
    cy.get('@firstIngredient').click();

    cy.get(SELECTORS.MODAL_OVERLAY).as('overlay'); // Alias для области оверлея
    cy.get('@overlay').click({ force: true });

    cy.get(SELECTORS.MODAL_INGREDIENT).should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.fixture('user-data.json').then((userData) => {
      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: userData,
      }).as('getUser');
    });

    cy.fixture('order-data.json').then((orderData) => {
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: orderData,
      }).as('createOrder');
    });

    cy.fixture('ingredients.json').then((ingredientsData) => {
      cy.intercept('GET', '**/ingredients', {
        statusCode: 200,
        body: ingredientsData,
      }).as('getIngredients');
    });

    cy.visit('/');
  });

  it('Оформляем заказ', () => {
    // Alias для кнопки добавления ингредиента и нажатие
    cy.contains('button', 'Добавить').first().as('addButton');
    cy.get('@addButton').click();

    // Alias для кнопки оформления заказа
    cy.get('button').contains('Оформить заказ').as('orderButton');
    cy.get('@orderButton').click();

    // Ждем запрос создания заказа
    cy.wait('@createOrder');

    // Alias для модального окна заказа
    cy.get(SELECTORS.MODAL_INGREDIENT).as('orderModal');

    cy.get('@orderModal')
      .should('be.visible')
      .within(() => {
        cy.contains('Ваш заказ начали готовить').should('be.visible');
        cy.contains('71788').should('be.visible');
      });

    // Alias для кнопки закрытия модального окна
    cy.get(SELECTORS.MODAL_CLOSE).as('closeButton');
    cy.get('@closeButton').click();

    cy.get('@orderModal').should('not.exist');

    // Проверяем конструктор через alias
    cy.get(SELECTORS.CONSTRUCTOR)
      .should('contain.text', 'Выберите булки')
      .and('contain.text', 'Выберите начинку');
  });
});
