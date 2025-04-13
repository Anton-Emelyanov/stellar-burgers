describe('Тесты получения ингредиентов через API', () => {
  beforeEach(() => {
    // Загружаем моковые данные из файла fixtures
    cy.fixture('ingredients.json').then((mockData) => {
      cy.intercept('GET', '**/ingredients', {
        statusCode: 200,
        body: mockData // Моковые данные из файла
      }).as('getIngredients');
    });

    // Переходим на страницу
    cy.visit('/');
  });

  it('Проверяет отображение ингредиентов на странице', () => {
    // Ждём завершения запроса
    cy.wait('@getIngredients');

    // видимость элемента
    cy.fixture('ingredients.json').then((mockData) => {
      mockData.data.forEach((ingredient) => {
        cy.contains(ingredient.name).scrollIntoView().should('be.visible');
      });
    });
  });
});

describe('Тесты модального окна ингредиента', () => {
  beforeEach(() => {
    // Переход на страницу конструктора для начала тестов
    cy.visit('/');
  });

  it('Открытие модального окна ингредиента по клику', () => {
    // Найдем элемент ингредиента, например, по data-testid
    cy.get('[data-testid="ingredient"]').first().click();

    // Проверка: модальное окно должно открыться
    cy.get('[data-testid="modal-ingredient"]').should('be.visible');
  });

  it('Закрытие модального окна по клику на крестик', () => {
    // Открываем модальное окно
    cy.get('[data-testid="ingredient"]').first().click();

    // Нажимаем на крестик
    cy.get('[data-testid="modal-close"]').click();

    // Проверка: модальное окно должно исчезнуть
    cy.get('[data-testid="modal-ingredient"]').should('not.exist');
  });

  it('Закрытие модального окна по клику на оверлей', () => {
    // Открываем модальное окно
    cy.get('[data-testid="ingredient"]').first().click();

    // Нажимаем на область оверлея
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // Проверка: модальное окно должно исчезнуть
    cy.get('[data-testid="modal-ingredient"]').should('not.exist');
  });

});

describe('Создание заказа', () => {
  beforeEach(() => {
    // Подставляем моковые данные авторизации
    cy.fixture('user-data.json').then((userData) => {
      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: userData
      }).as('getUser');
    });

    // Мокируем запрос к эндпоинту создания заказа
    cy.fixture('order-data.json').then((orderData) => {
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: orderData
      }).as('createOrder');
    });

    // Мокируем запрос на ингредиенты
    cy.fixture('ingredients.json').then((ingredientsData) => {
      cy.intercept('GET', '**/ingredients', {
        statusCode: 200,
        body: ingredientsData
      }).as('getIngredients');
    });

    cy.visit('/');
  });

  it('Оформляем заказ', () => {
    // Нажимаем на кнопку добавления ингредиента
    cy.contains('button', 'Добавить').first().click();
    // Нажимаем кнопку оформления заказа
    cy.get('button').contains('Оформить заказ').click();
    // Ждём запрос на создание заказа
    cy.wait('@createOrder');
    // Проверяем модальное окно с номером заказа
    cy.get('[data-testid="modal-ingredient"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Ваш заказ начали готовить').should('be.visible');
        cy.contains('71788').should('be.visible');
      });
    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]').click();
    // Убедитесь, что модальное окно закрылось
    cy.get('[data-testid="modal-ingredient"]').should('not.exist');
    // Проверяем, что конструктор очищен
    cy.get('[data-testid="constructor"]')
      .should('contain.text', 'Выберите булки')
      .and('contain.text', 'Выберите начинку');
  });
});
