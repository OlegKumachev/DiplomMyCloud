# Облачное хранилище My Cloud
Веб-приложение, работает как облачное хранилище. Приложение позволяет пользователям отображать, загружать, отправлять, скачивать и переименовывать файлы.   

## **Запуск**
## **Клонируем репозиторий.**
```bash
git clone git@github.com:OlegKumachev/DiplomMyCloud.git
```
## **Запуск Backend проекта DiplomMyCloud**
### **1. Установка зависимостей**
**Установите виртуальное окружение и активируйте его** (если еще не сделано):
```bash 
python -m venv venv

source venv/bin/activate
```
**Установите зависимости**:

```bash
pip install -r requirements.txt

```
**Создаем базу данных**

```bash
$ psql

# CREATE DATABASE your_db_name;
```

Создайте файл **.env** в корневой директории проекта с переменными:
```python
SECRET_KEY=your_secret_key
DEBUG=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
```
### **3. Миграции и запуск**
Выполните миграции для создания необходимых таблиц в базе данных:
```bash
python manage.py migrate
```
Создание суперпользователя (если необходимо):

```bash
python manage.py createsuperuser
```
Запустите сервер разработки:
```bash
python manage.py runserver
```
### **4. Использование API**
- **Создание файла**: POST запрос к `/api/files/`
- **Получение файлов пользователя**: GET запрос к `/api/files/`
- **Удаление файла**: DELETE запрос к `/api/files/{id}/`
- **Загрузка файла**: GET запрос к `/api/files/{id}/download/`
#### **Пользователи**
- **Регистрация**: POST запрос к `/api/register/`
- **Вход в систему**: POST запрос к `/api/login/`
- **Выход из системы**: POST запрос к `/api/logout/`
- **Просмотр текущего пользователя**: GET запрос к `/api/users/me/` (доступен только для авторизованных пользователей)
# **Запуск Frontend проекта DiplomMyCloud**

**1. Установка зависимостей**

Установите зависимости:
```bash
npm install
```

### **2. Запуск проекта**

Запуск в режиме разработки:
```bash
npm run dev
```
**Подключение к серверу**
**Создайте файл **.env** в корневой директории проекта с переменными**

```.evn
VITE_APP_API_URL=http://95.163.221.19
```
### **3.Структура проекта**

-`src/App.js`: Главный компонент приложения, определяющий маршрутизацию и основные компоненты.
-`src/components/LoginForm/LoginForm.js`: Компонент для логина.
-`src/components/LoginForm/RegisterPage.js`: Компонент для регистрации.
-`src/components/FilePage/FilesListPage.js`: Компонент для отображения списка файлов.
-`src/components/AdminPanel/AdminPage.js`: Компонент административной панели.
-`src/components/AdminPanel/AdminUsersList.js`: Компонент списка пользователей.
-`src/components/AdminPanel/AdminUserPage.js`: Компонент для просмотра данных конкретного пользователя.
-`src/components/AdminPanel/UserFilesPage.js`: Компонент для просмотра файлов пользователя.

### **4. Взаимодействие с Backend**

`/api/login/` — аутентификация пользователя.

`/api/register/` — регистрация нового пользователя.

`/api/files/` — работа с файлами пользователя.

`/api/users/` — управление пользователями (доступно только для администраторов).
