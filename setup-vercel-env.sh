#!/bin/bash

# Скрипт для настройки переменных окружения на Vercel
# Запустите после установки Vercel CLI: npm i -g vercel

echo "🚀 Настройка переменных окружения для CleanDrive на Vercel..."

# Ваши данные
TELEGRAM_BOT_TOKEN="7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ"
TELEGRAM_CHAT_ID="7099490320"

echo "📝 Настраиваем TELEGRAM_BOT_TOKEN..."
vercel env add TELEGRAM_BOT_TOKEN "$TELEGRAM_BOT_TOKEN" production

echo "📝 Настраиваем TELEGRAM_CHAT_ID..."
vercel env add TELEGRAM_CHAT_ID "$TELEGRAM_CHAT_ID" production

echo "✅ Переменные окружения настроены!"
echo "🔄 Теперь нужно сделать редеплой..."
echo "💡 Или перейдите на https://vercel.com/dashboard и добавьте переменные вручную"

echo ""
echo "📋 Переменные для ручной настройки:"
echo "TELEGRAM_BOT_TOKEN = $TELEGRAM_BOT_TOKEN"
echo "TELEGRAM_CHAT_ID = $TELEGRAM_CHAT_ID"
