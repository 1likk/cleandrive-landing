import json
import requests
from datetime import datetime
from urllib.parse import parse_qs

# Telegram bot configuration
BOT_TOKEN = "7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ"
CHAT_ID = "7099490320"

def handler(request):
    """Vercel serverless function for handling Telegram messages"""
    
    # Handle CORS
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
    
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request body
        if hasattr(request, 'body'):
            body = json.loads(request.body)
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
                'body': json.dumps({'error': 'Name and phone are required'})
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
