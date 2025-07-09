# 🚗 CleanDrive - Лендинг автопылесоса

Современный лендинг для продажи автопылесоса с Telegram интеграцией.

## ✨ Особенности

- 🎨 **Современный дизайн** с анимациями
- 📱 **Адаптивная верстка** для всех устройств  
- 🤖 **Telegram бот** для получения заявок
- 🙏 **Страница благодарности** после отправки
- ⚙️ **Админка** для просмотра заявок
- 🔒 **Безопасность** - токены только в переменных окружения
- ☁️ **Готово к деплою** на Vercel

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Настройте токены в .env.local
cp .env .env.local
# Отредактируйте .env.local и добавьте реальные токены

# Установить зависимости
make install

# Запустить dev-server
make dev

# Открыть http://localhost:3000
```

### Деплой на Vercel

1. Откройте [vercel.com](https://vercel.com)
2. Импортируйте проект из GitHub
3. Добавьте переменные окружения:
   - `TELEGRAM_BOT_TOKEN` - токен от @BotFather
   - `TELEGRAM_CHAT_ID` - ваш chat_id
4. Нажмите Deploy

## 🔒 Безопасность

- ✅ Токены только в переменных окружения
- ✅ Нет секретов в клиентском коде
- ✅ .env.local исключен из git
- ✅ Fallback токены удалены

## 📁 Структура

```
├── index.html          # Главная страница
├── thank-you.html      # Страница благодарности
├── admin.html          # Админка
├── test.css           # Стили
├── script.js          # JavaScript (очищен)
├── api/
│   ├── telegram.py    # Serverless функция (безопасная)
│   └── requirements.txt
├── .env               # Шаблон конфигурации
├── .env.local         # Реальные токены (git ignore)
├── vercel.json        # Конфигурация Vercel
└── Makefile          # Команды разработки
```

## 🔧 Команды

| Команда | Описание |
|---------|----------|
| `make dev` | Запустить dev-server |
| `make test` | Проверить систему |
| `make clean` | Очистить временные файлы |

## 🌐 URL'ы

- **Главная**: `/`
- **Благодарность**: `/thank-you`
- **Админка**: `/admin`
- **API**: `/api/telegram`

## 🛠️ Технологии

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python + aiohttp
- **Deploy**: Vercel (serverless)
- **Security**: Environment variables only

## 📄 Лицензия

MIT
