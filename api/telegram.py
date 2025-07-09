import json
import os
import requests
from datetime import datetime

# Telegram bot configuration (можно вынести в переменные окружения Vercel)
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ')
CHAT_ID = os.getenv('TELEGRAM_CHAT_ID', '7099490320')

def handler(request):
    """Vercel serverless function for handling lead submissions"""
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }
    
    # Only allow POST for lead submissions
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({
                'success': False,
                'message': 'Method not allowed'
            })
        }
    
    try:
        # Parse request body (handle different Vercel request formats)
        if hasattr(request, 'get_json'):
            body = request.get_json()
        elif hasattr(request, 'body'):
            body = json.loads(request.body.decode('utf-8') if isinstance(request.body, bytes) else request.body)
        else:
            body = json.loads(request.data.decode('utf-8'))
        
        # Validate required fields
        name = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        
        if not name or not phone:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'Имя и телефон обязательны'
                })
            }
        
        # Prepare Telegram message
        current_time = datetime.now().strftime('%d.%m.%Y %H:%M:%S')
        message = f"""🚗 Новая заявка с сайта!

👤 Имя: {name}
📱 Телефон: {phone}
🕒 Время: {current_time}
🌐 Источник: Веб-сайт

#новая_заявка #vercel"""
        
        # Send message to Telegram
        telegram_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        telegram_payload = {
            'chat_id': CHAT_ID,
            'text': message,
            'parse_mode': 'HTML'
        }
        
        response = requests.post(telegram_url, json=telegram_payload, timeout=10)
        
        if response.status_code == 200:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Заявка успешно отправлена!'
                })
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Ошибка отправки в Telegram'
                })
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({
                'success': False,
                'error': f'Server error: {str(e)}'
            })
        }

# For Vercel
def main(request):
    return handler(request)
