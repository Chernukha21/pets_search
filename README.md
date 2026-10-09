# Animals Fullstack

Учебное fullstack-приложение для поиска потерянных животных. Пользователь может добавить объявление, отфильтровать список, отметить животное как найденное и удалить запись.

## Возможности

- Создание объявления с данными животного и контактами владельца.
- Фильтрация по типам животных и статусу «найдено / пропало».
- Получение списка животных и отдельной записи через REST API.
- Изменение статуса `isFound` и удаление объявления.
- Валидация данных и обработка ошибок API.
- Запуск клиента, сервера и PostgreSQL через Docker Compose.
- Интеграционные тесты CRUD на отдельной тестовой базе.

## Технологии

| Часть проекта | Технологии |
| --- | --- |
| Клиент | React, Vite, Redux Toolkit, RTK Query, Formik, Yup, SCSS Modules |
| Сервер | Node.js, Express, Sequelize, Yup, http-errors |
| База данных | PostgreSQL |
| Тестирование | Mocha, Chai, Supertest, cross-env |
| Контейнеризация | Docker, Docker Compose |

## Структура проекта

| Путь | Назначение |
| --- | --- |
| `client/` | React-приложение |
| `server/app.js` | Express-приложение, которое также импортируют тесты |
| `server/index.js` | Запуск HTTP-сервера |
| `server/config/config.json` | Конфигурация подключения к PostgreSQL |
| `server/models/` | Модели Sequelize |
| `server/controllers/` | CRUD-контроллеры |
| `server/middleware/` | Валидация и обработка ошибок |
| `server/routes/` | API-маршруты |
| `server/migrations/` | Создание таблиц |
| `server/seeders/` | Начальные и демонстрационные данные |
| `server/tests/pets.test.js` | Интеграционные тесты Pets API |

## Запуск через Docker

Нужны установленный и запущенный Docker Desktop и Docker Compose.

Из корня проекта:

```bash
docker compose up --build -d
```

В текущей конфигурации Compose сервер выполняет миграции перед запуском приложения.

При первом запуске на новой пустой базе заполнить справочник типов животных и добавить демонстрационные объявления:

```bash
docker compose exec server npx sequelize-cli db:seed:all
```

Сиды запускаются один раз для первоначального заполнения базы. Повторный запуск может создать дубликаты.

| Сервис | Адрес |
| --- | --- |
| Клиент | http://localhost:5001 |
| API | http://localhost:5000/api |
| PostgreSQL внутри сети Compose | `db:5432` |

Исходники клиента и сервера подключены через bind mounts для работы над проектом. Данные PostgreSQL хранятся в именованном томе `pg_data`.

Проверить состояние и посмотреть логи:

```bash
docker compose ps
docker compose logs --tail=80 server
```

Остановить приложение и удалить контейнеры, сохранив именованный том с данными:

```bash
docker compose down
```

## Локальный запуск

Для локального запуска нужны Node.js, npm и работающий PostgreSQL. В Dockerfile проекта используется Node.js 22.19.0.

Установить зависимости из корня проекта:

```bash
npm --prefix client ci
npm --prefix server ci
```

Создать `server/.env` на основе `server/.env.example`:

```bash
cp server/.env.example server/.env
```

Порт сервера задаётся через `PORT`; для локального запуска используется `5000`.

Параметры подключения Sequelize берутся из `server/config/config.json`. Настроить секции `development` и `test` под свой PostgreSQL:

```json
{
  "development": {
    "username": "postgres",
    "password": "admin",
    "database": "animals",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "admin",
    "database": "animals_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  }
}
```

В примере используются учётные данные для локальной разработки. По умолчанию Sequelize подключается к PostgreSQL на порту `5432`; для другого порта добавить поле `port` в соответствующую секцию.

Подготовить базу разработки из папки `server`:

```bash
npx sequelize-cli db:create --env development
npx sequelize-cli db:migrate --env development
npx sequelize-cli db:seed:all --env development
```

Команда `db:create` нужна при первом создании базы. Сиды нужны при первоначальном заполнении новой базы.

Запустить сервер из папки `server`:

```bash
npm run dev
```

В другом терминале запустить клиент из папки `client`:

```bash
npm run dev
```

- Клиент: http://localhost:5173.
- API: http://localhost:5000/api.

## API

| Метод | Путь | Назначение | Успешный статус |
| --- | --- | --- | --- |
| GET | `/api/pet-types` | Получить типы животных | 200 |
| GET | `/api/pets` | Получить список животных | 200 |
| GET | `/api/pets/:id` | Получить животное по ID | 200 |
| POST | `/api/pets` | Создать объявление | 201 |
| PATCH | `/api/pets/:id` | Изменить `isFound` | 200 |
| DELETE | `/api/pets/:id` | Удалить объявление | 204 |

Фильтры передаются в query-параметрах:

```text
GET /api/pets?petTypeIds=1,2&isFound=false
```

`petTypeIds` — положительные целочисленные ID через запятую. `isFound` — строка `true` или `false`. Оба фильтра необязательны.

Пример тела запроса для создания объявления:

```json
{
  "name": "Murka",
  "owner": "Anna Kovalenko",
  "ownerContacts": "+380671112233",
  "description": "Grey cat with a red collar",
  "city": "Kyiv",
  "lostDate": "2020-01-01",
  "petTypeId": 1,
  "isFound": false
}
```

`petTypeId` должен соответствовать существующей записи из `/api/pet-types`. Допустимые города: `Kyiv`, `Dnipro`, `New York`. Контактный номер имеет формат `+` и 12 цифр.

Пример тела запроса для обновления статуса:

```json
{
  "isFound": true
}
```

Для некорректных данных API возвращает `400` или `422`, для отсутствующего животного — `404`. Успешное удаление возвращает `204` без тела ответа.

## Тестирование

Тесты запускаются в режиме `NODE_ENV=test` и используют отдельную базу `animals_test`. Для команд ниже PostgreSQL должен быть доступен по адресу из секции `test` в `server/config/config.json`.

При первом запуске подготовить тестовую базу из папки `server`:

```bash
npx sequelize-cli db:create --env test
npx sequelize-cli db:migrate --env test
```

Запустить тесты из папки `server`:

```bash
npm test
```

Тестовый скрипт использует `cross-env` для задания `NODE_ENV=test` на Windows, Linux и macOS.

В `server/tests/pets.test.js` предусмотрено 15 интеграционных тестов:

- POST: создание с корректными данными, отсутствие имени, неправильный формат контактов.
- GET списка: получение записей, фильтрация по `isFound`, неправильное значение фильтра.
- GET по ID: существующая запись, отсутствующая запись, некорректный ID.
- PATCH: сохранение нового статуса, неправильный тип `isFound`, отсутствующая запись.
- DELETE: удаление и проверка отсутствия записи в базе, отсутствующая запись, некорректный ID.

Перед началом тестов проверяются `NODE_ENV` и имя базы. Перед каждым тестом очищается таблица животных; каждый сценарий самостоятельно создаёт необходимые записи. Общий тип `Cat` создаётся при необходимости и используется как справочные данные. Соединение с базой закрывается после завершения тестов.

Демонстрационные сиды для тестов не требуются. Supertest импортирует `app.js`, поэтому отдельно запускать HTTP-сервер перед тестами не нужно.

## Документация инструментов

- [Миграции и сиды Sequelize](https://sequelize.org/docs/v6/other-topics/migrations/).
- [Команды Docker Compose](https://docs.docker.com/reference/cli/docker/compose/).

