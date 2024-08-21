## <a name="_jwmdz2nolkg4"></a>**Запуск**
## <a name="_2te2hmzg3ney"></a>**Клонируем репозиторий.**
## <a name="_z7iczfizi55m"></a>**Запуск Backend проекта DiplomMyCloud**
### <a name="_s6jw47pfmqjp"></a>**1. Установка зависимостей**
**Установите виртуальное окружение и активируйте его** (если еще не сделано):
```python 
python -m venv venv

source venv/bin/activate  # Для Unix
```
**Установите зависимости**:

```python
pip install -r requirements.txt

```
Создайте файл **.env** в корневой директории проекта с переменными:
```python
SECRET\_KEY=your\_secret\_key

DEBUG=True

DB\_NAME=your\_db\_name

DB\_USER=your\_db\_user

DB\_PASSWORD=your\_db\_password

DB\_HOST=your\_db\_host

DB\_PORT=your\_db\_port
```
### <a name="_m2seqbhudnol"></a>**3. Миграции и запуск**
Выполните миграции для создания необходимых таблиц в базе данных:
bash
Копировать код
python manage.py migrate

Запустите сервер разработки:
bash
Копировать код
python manage.py runserver
### <a name="_cmp2jzsxlu1m"></a>**4. Использование API**
- **Создание файла**: POST запрос к /api/files/
- **Получение файлов пользователя**: GET запрос к /api/files/
- **Удаление файла**: DELETE запрос к /api/files/{id}/
- **Загрузка файла**: GET запрос к /api/files/{id}/download/
#### <a name="_k7a486njme8p"></a>**Пользователи**
- **Регистрация**: POST запрос к /api/register/
- **Вход в систему**: POST запрос к /api/login/
- **Выход из системы**: POST запрос к /api/logout/
- **Просмотр текущего пользователя**: GET запрос к /api/users/me/ (доступен только для авторизованных пользователей)
## <a name="_z7iczfizi55m"></a>**Запуск Frontend проекта DiplomMyCloud**

### <a name="_m2seqbhudnol"></a>**1. Установка зависимостейк**

Установите зависимости:

bash

npm install

2\. Запуск проекта

Запуск в режиме разработки:

bash

Копировать код

npm run dev

Создание билда:

bash

Копировать код

npm run build

Предварительный просмотр билда:

bash

Копировать код

npm run preview

Деплой на GitHub Pages:

bash

Копировать код

npm run deploy

3\. Структура проекта

src/App.js: Главный компонент приложения, определяющий маршрутизацию и основные компоненты.

src/components/Header/Header.js: Компонент заголовка.

src/components/LoginForm/LoginForm.js: Компонент для логина.

src/components/LoginForm/RegisterPage.js: Компонент для регистрации.

src/components/FilePage/FilesListPage.js: Компонент для отображения списка файлов.

src/components/AdminPanel/AdminPage.js: Компонент административной панели.

src/components/AdminPanel/AdminUsersList.js: Компонент списка пользователей для админа.

src/components/AdminPanel/AdminUserPage.js: Компонент для просмотра данных конкретного пользователя.

src/components/AdminPanel/UserFilesPage.js: Компонент для просмотра файлов пользователя.

4\. Взаимодействие с Backend

API эндпоинты:

/api/login/ — аутентификация пользователя.

/api/register/ — регистрация нового пользователя.

/api/files/ — работа с файлами пользователя.

/api/users/ — управление пользователями (доступно только для администраторов).
