# Настройка переменных окружения в Vercel

## 1. Откройте проект в Vercel Dashboard
- Перейдите на https://vercel.com/dashboard
- Выберите ваш проект CleanDrive

## 2. Добавьте переменные окружения
- Перейдите в Settings → Environment Variables
- Добавьте следующие переменные:

### TELEGRAM_BOT_TOKEN
- Key: `TELEGRAM_BOT_TOKEN`
- Value: `ваш_токен_бота` (получите у @BotFather)
- Environments: Production, Preview, Development

### TELEGRAM_CHAT_ID
- Key: `TELEGRAM_CHAT_ID`
- Value: `ваш_chat_id` (получите у @userinfobot)
- Environments: Production, Preview, Development

## 3. Сохраните и сделайте redeploy
- Нажмите Save для каждой переменной
- Перейдите на вкладку Deployments
- Нажмите "Redeploy" для последнего деплоя

## 4. Проверьте работу
- Откройте сайт
- Заполните форму и отправьте
- Проверьте, что уведомление пришло в Telegram
