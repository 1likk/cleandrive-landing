# 🔧 НАСТРОЙКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ НА VERCEL


- **TELEGRAM_BOT_TOKEN** = `7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ`
- **TELEGRAM_CHAT_ID** = `7099490320`



   **Name**: `TELEGRAM_BOT_TOKEN`
   **Value**: `7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ`
   **Environment**: `Production`

   **Name**: `TELEGRAM_CHAT_ID`
   **Value**: `7099490320`
   **Environment**: `Production`

5. Сохраните и сделайте **Redeploy**

## Способ 2: Через CLI (если установлен)

```bash
chmod +x setup-vercel-env.sh
./setup-vercel-env.sh
```

## Проверка после настройки:

1. Перейдите на ваш сайт
2. Откройте `/check-env` (или нажмите 🔧 в футере)
3. Нажмите "Проверить переменные"
4. Должно показать: ✅ Все переменные настроены

## Если не работает:

1. Убедитесь, что переменные добавлены в **Production**
2. Сделайте **Redeploy** проекта
3. Подождите 1-2 минуты после деплоя
4. Проверьте на `/check-env`



