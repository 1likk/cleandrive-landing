# CleanDrive - Автопылесос для авто

Современный лендинг для автопылесоса CleanDrive с интеграцией Telegram-бота для получения заявок.

## 🚀 Возможности

- ✅ Красивый адаптивный лендинг
- ✅ Анимации и современный дизайн
- ✅ Интеграция с Telegram для получения заявок
- ✅ Python API сервер для обработки заявок
- ✅ Fallback отправка при недоступности сервера
- ✅ Локальное сохранение заявок
- ✅ Админ панель для просмотра заявок

## 📁 Структура проекта

```
web test/
├── test.html              # Основной лендинг
├── test.css               # Стили лендинга
├── script.js              # JavaScript функциональность
├── telegram_bot.py        # Python Telegram бот + API сервер
├── test_bot.html          # Тестовая страница для отладки
├── requirements.txt       # Python зависимости
└── README.md             # Документация
```

## 🛠️ Настройка

### 1. Python зависимости

```bash
pip install -r requirements.txt
```

### 2. Запуск бота

```bash
python3 telegram_bot.py
```

### 3. Открытие сайта

Откройте `test.html` в браузере

## 🔧 Конфигурация

### Telegram Bot
- **Username**: @Lickk_bot
- **Token**: 7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ
- **Admin Chat ID**: 7099490320

### API
- **Сервер**: http://localhost:3000
- **Endpoint**: /lead (POST)
- **Тест**: /test (GET)

## 📱 Как работает

1. Пользователь заполняет форму на сайте
2. JavaScript отправляет данные на Python сервер
3. Python сервер пересылает заявку в Telegram
4. При недоступности сервера - fallback на прямую отправку в Telegram API

## 🎯 Команды бота

- `/start` - Запуск бота и получение Chat ID
- `/help` - Справка по командам
- `/stats` - Статистика заявок

## 🔗 Ссылки

- **Основной сайт**: file:///Users/birlikzhumadil/Desktop/web%20test/test.html
- **Тестовая страница**: file:///Users/birlikzhumadil/Desktop/web%20test/test_bot.html
- **Telegram бот**: https://t.me/Lickk_bot

## 📊 Логи

Все заявки логируются в консоль Python сервера и сохраняются в localStorage браузера.

## 🏗️ Разработка

Код очищен от временных комментариев и готов к продакшену.
