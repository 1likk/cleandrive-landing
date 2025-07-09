#!/usr/bin/env python3
"""CleanDrive dev-server"""

import os
import json
import asyncio
import logging
from datetime import datetime
from aiohttp import web, ClientSession
from aiohttp.web_fileresponse import FileResponse
from aiohttp_cors import setup as setup_cors
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv('.env.local')
load_dotenv('.env')

# Логирование
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Конфигурация
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')
PORT = int(os.getenv('DEV_PORT', 3000))

# Хранилище заявок в памяти
leads_storage = []

class DevServer:
    def __init__(self):
        self.app = web.Application()
        self.setup_routes()
        self.setup_cors()
        
    def setup_routes(self):
        """Настройка маршрутов"""
        # API маршруты
        self.app.router.add_post('/lead', self.handle_lead)
        self.app.router.add_get('/api/leads', self.get_leads)
        self.app.router.add_get('/api/stats', self.get_stats)
        
        # Статические файлы
        self.app.router.add_get('/', self.serve_index)
        self.app.router.add_get('/admin', self.serve_admin)
        self.app.router.add_get('/thank-you', self.serve_thank_you)
        self.app.router.add_static('/', path='.', show_index=False)
        
    def setup_cors(self):
        """Настройка CORS"""
        from aiohttp_cors import ResourceOptions
        
        cors = setup_cors(self.app, defaults={
            "*": ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
                allow_methods="*"
            )
        })
        
        # Добавляем CORS ко всем маршрутам
        for route in list(self.app.router.routes()):
            cors.add(route)
    
    async def serve_index(self, request):
        """Главная страница"""
        return FileResponse('index.html')
    
    async def serve_admin(self, request):
        """Админка"""
        return FileResponse('admin.html')
        
    async def serve_thank_you(self, request):
        """Страница благодарности (будет создана позже)"""
        return FileResponse('thank-you.html')
    
    async def handle_lead(self, request):
        """Обработка заявок"""
        try:
            data = await request.json()
            
            # Валидация данных
            name = data.get('name', '').strip()
            phone = data.get('phone', '').strip()
            
            if not name or not phone:
                return web.json_response({
                    'success': False,
                    'message': 'Имя и телефон обязательны'
                }, status=400)
            
            # Создаем заявку
            lead = {
                'id': len(leads_storage) + 1,
                'name': name,
                'phone': phone,
                'timestamp': datetime.now().isoformat(),
                'date': datetime.now().strftime('%d.%m.%Y %H:%M'),
                'ip': request.remote or 'unknown',
                'user_agent': request.headers.get('User-Agent', 'unknown')
            }
            
            # Сохраняем в памяти
            leads_storage.append(lead)
            
            # Отправляем в Telegram
            await self.send_to_telegram(lead)
            
            logger.info(f"✅ Новая заявка от {name} ({phone})")
            
            return web.json_response({
                'success': True,
                'message': 'Заявка отправлена',
                'lead_id': lead['id']
            })
            
        except Exception as e:
            logger.error(f"❌ Ошибка обработки заявки: {e}")
            return web.json_response({
                'success': False,
                'message': 'Внутренняя ошибка сервера'
            }, status=500)
    
    async def send_to_telegram(self, lead):
        """Отправка в Telegram"""
        if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
            logger.warning("⚠️  Telegram не настроен")
            return
            
        message = f"""🚗 Новая заявка #{lead['id']}

👤 Имя: {lead['name']}
📱 Телефон: {lead['phone']}
🕒 Время: {lead['date']}
🌐 IP: {lead['ip']}

#заявка #dev"""
        
        try:
            async with ClientSession() as session:
                url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
                payload = {
                    'chat_id': TELEGRAM_CHAT_ID,
                    'text': message,
                    'parse_mode': 'HTML'
                }
                
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        logger.info(f"📱 Заявка #{lead['id']} отправлена в Telegram")
                    else:
                        logger.error(f"❌ Ошибка Telegram API: {response.status}")
                        
        except Exception as e:
            logger.error(f"❌ Ошибка отправки в Telegram: {e}")
    
    async def get_leads(self, request):
        """Получение всех заявок"""
        return web.json_response({
            'success': True,
            'leads': leads_storage,
            'total': len(leads_storage)
        })
    
    async def get_stats(self, request):
        """Статистика"""
        today = datetime.now().date()
        today_leads = [
            lead for lead in leads_storage 
            if datetime.fromisoformat(lead['timestamp']).date() == today
        ]
        
        return web.json_response({
            'success': True,
            'stats': {
                'total_leads': len(leads_storage),
                'today_leads': len(today_leads),
                'last_lead': leads_storage[-1] if leads_storage else None
            }
        })

def print_banner():
    """Красивый баннер при запуске"""
    banner = f"""
╭────────────────────────────────────────╮
│        CleanDrive Dev Server           │
│                                        │
│  🌐 Сайт:     http://localhost:{PORT}     │
│  ⚙️  Админка:  http://localhost:{PORT}/admin │
│  📊 API:      http://localhost:{PORT}/api   │
│                                        │
│  💡 Режим разработки активен           │
╰────────────────────────────────────────╯
"""
    print(banner)

async def main():
    """Главная функция"""
    server = DevServer()
    
    print_banner()
    logger.info(f"🚀 Запуск dev-server на порту {PORT}")
    
    # Проверяем Telegram настройки
    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
        logger.info("📱 Telegram настроен")
    else:
        logger.warning("⚠️  Telegram не настроен (создайте .env файл)")
    
    # Запускаем сервер
    runner = web.AppRunner(server.app)
    await runner.setup()
    
    site = web.TCPSite(runner, 'localhost', PORT)
    await site.start()
    
    logger.info(f"✅ Сервер запущен: http://localhost:{PORT}")
    
    # Держим сервер запущенным
    try:
        await asyncio.Event().wait()
    except KeyboardInterrupt:
        logger.info("🛑 Остановка сервера...")
    finally:
        await runner.cleanup()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 До свидания!")
