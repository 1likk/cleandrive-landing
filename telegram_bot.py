#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CleanDrive Telegram Bot
Бот для получения заявок с сайта автопылесоса
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, Any

from telegram import Update, Bot
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from aiohttp import web
import aiohttp_cors

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Конфигурация
BOT_TOKEN = "7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ"
WEBHOOK_PORT = 3001
WEB_PORT = 3000
ADMIN_CHAT_ID = None  # Будет установлен автоматически

class CleanDriveBot:
    def __init__(self):
        self.bot = Bot(token=BOT_TOKEN)
        self.app = Application.builder().token(BOT_TOKEN).build()
        self.admin_chat_id = ADMIN_CHAT_ID
        
        # Добавляем обработчики команд
        self.app.add_handler(CommandHandler("start", self.start_command))
        self.app.add_handler(CommandHandler("help", self.help_command))
        self.app.add_handler(CommandHandler("stats", self.stats_command))
        self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))

    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /start"""
        user = update.effective_user
        chat_id = update.effective_chat.id
        
        # Сохраняем ID администратора
        if self.admin_chat_id is None:
            self.admin_chat_id = chat_id
            logger.info(f"Admin chat ID установлен: {chat_id}")
        
        welcome_text = f"""
🚗 Добро пожаловать в CleanDrive Bot!

Привет, {user.first_name}! 👋

Этот бот будет отправлять вам уведомления о новых заявках с сайта автопылесоса CleanDrive.

🆔 Ваш Chat ID: `{chat_id}`
💡 Используйте этот ID в настройках сайта

Доступные команды:
/help - Помощь
/stats - Статистика заявок
        """
        
        await update.message.reply_text(welcome_text, parse_mode='Markdown')

    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /help"""
        help_text = """
🤖 Помощь по CleanDrive Bot

📋 Команды:
/start - Начать работу с ботом
/help - Показать эту справку
/stats - Статистика заявок

🔧 Настройка:
1. Скопируйте ваш Chat ID из сообщения /start
2. Вставьте его в код сайта (script.js)
3. Теперь вы будете получать уведомления о заявках!

📞 Формат уведомлений:
🚗 Новая заявка CleanDrive!
👤 Имя: [Имя клиента]
📱 Телефон: [Номер телефона]
🕒 Время: [Дата и время]

❓ Если есть проблемы, проверьте:
- Правильность Bot Token
- Правильность Chat ID
- Работу интернета
        """
        
        await update.message.reply_text(help_text)

    async def stats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /stats"""
        # Здесь можно добавить статистику из базы данных
        stats_text = f"""
📊 Статистика CleanDrive Bot

🤖 Бот: Активен
🆔 Chat ID: {update.effective_chat.id}
📅 Сегодня: {datetime.now().strftime('%d.%m.%Y %H:%M')}

📋 Функции:
✅ Получение заявок с сайта
✅ Мгновенные уведомления  
✅ Форматированные сообщения
✅ Обработка ошибок

💡 Для просмотра всех заявок используйте кнопку "📋 Посмотреть заявки" на сайте.
        """
        
        await update.message.reply_text(stats_text)

    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик обычных сообщений"""
        await update.message.reply_text(
            "👋 Я бот для уведомлений о заявках CleanDrive.\n\n"
            "Используйте /help для получения справки."
        )

    async def send_lead_notification(self, lead_data: Dict[str, Any]):
        """Отправка уведомления о новой заявке"""
        if not self.admin_chat_id:
            logger.error("Admin chat ID не установлен!")
            return False

        try:
            message = f"""🚗 Новая заявка CleanDrive!

👤 Имя: {lead_data.get('name', 'Не указано')}
📱 Телефон: {lead_data.get('phone', 'Не указан')}
🕒 Время: {lead_data.get('date', datetime.now().strftime('%d.%m.%Y %H:%M'))}
🌐 Источник: {lead_data.get('source', 'Сайт')}

🔗 <a href="tel:{lead_data.get('phone', '')}">Позвонить клиенту</a>

#новая_заявка #cleandrive"""

            await self.bot.send_message(
                chat_id=self.admin_chat_id,
                text=message,
                parse_mode='HTML'
            )
            
            logger.info(f"Уведомление отправлено: {lead_data}")
            return True
            
        except Exception as e:
            logger.error(f"Ошибка отправки уведомления: {e}")
            return False

# Веб-сервер для приема данных с сайта
async def handle_lead(request):
    """Обработчик POST запросов с данными заявок"""
    try:
        data = await request.json()
        
        # Валидация данных
        required_fields = ['name', 'phone']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return web.json_response(
                    {'error': f'Поле {field} обязательно'},
                    status=400
                )
        
        # Добавляем метаданные
        data['timestamp'] = datetime.now().isoformat()
        data['date'] = datetime.now().strftime('%d.%m.%Y %H:%M:%S')
        data['source'] = 'CleanDrive Website'
        
        # Отправляем уведомление в Telegram
        bot_instance = request.app['bot']
        success = await bot_instance.send_lead_notification(data)
        
        if success:
            return web.json_response({
                'success': True,
                'message': 'Заявка успешно отправлена'
            })
        else:
            return web.json_response({
                'success': False,
                'message': 'Ошибка отправки в Telegram'
            }, status=500)
            
    except json.JSONDecodeError:
        return web.json_response(
            {'error': 'Неверный формат JSON'},
            status=400
        )
    except Exception as e:
        logger.error(f"Ошибка обработки заявки: {e}")
        return web.json_response(
            {'error': 'Внутренняя ошибка сервера'},
            status=500
        )

async def handle_test(request):
    """Тестовый endpoint"""
    return web.json_response({
        'status': 'OK',
        'message': 'CleanDrive Bot Server работает!',
        'timestamp': datetime.now().isoformat()
    })

async def create_web_app(bot_instance):
    """Создание веб-приложения"""
    app = web.Application()
    
    # Сохраняем экземпляр бота в приложении
    app['bot'] = bot_instance
    
    # Добавляем маршруты
    app.router.add_post('/lead', handle_lead)
    app.router.add_get('/test', handle_test)
    app.router.add_get('/health', handle_test)
    
    # Настройка CORS
    cors = aiohttp_cors.setup(app, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
            allow_methods="*"
        )
    })
    
    # Добавляем CORS ко всем маршрутам
    for route in list(app.router.routes()):
        cors.add(route)
    
    return app

async def main():
    """Главная функция"""
    logger.info("Запуск CleanDrive Bot...")
    
    # Создаем экземпляр бота
    bot_instance = CleanDriveBot()
    
    # Создаем веб-приложение
    web_app = await create_web_app(bot_instance)
    
    # Запускаем веб-сервер
    runner = web.AppRunner(web_app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', WEB_PORT)
    await site.start()
    
    logger.info(f"Веб-сервер запущен на http://localhost:{WEB_PORT}")
    logger.info(f"API endpoint: http://localhost:{WEB_PORT}/lead")
    logger.info(f"Test endpoint: http://localhost:{WEB_PORT}/test")
    
    # Запускаем Telegram бота
    logger.info("Запуск Telegram бота...")
    await bot_instance.app.initialize()
    await bot_instance.app.start()
    
    logger.info("✅ CleanDrive Bot полностью запущен!")
    logger.info("📋 Для получения Chat ID отправьте /start боту в Telegram")
    
    try:
        # Ждем завершения
        await bot_instance.app.updater.start_polling()
        
    except KeyboardInterrupt:
        logger.info("Получен сигнал завершения...")
    finally:
        # Корректное завершение
        await bot_instance.app.stop()
        await runner.cleanup()
        logger.info("CleanDrive Bot остановлен")

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 CleanDrive Bot остановлен пользователем")
    except Exception as e:
        print(f"❌ Критическая ошибка: {e}")
        logger.error(f"Критическая ошибка: {e}")
