import json
import os
import urllib.request
import urllib.parse
from datetime import datetime

def handler(request):
    """Main handler for Vercel"""
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Only allow POST requests
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Method not allowed'
            })
        }
    
    try:
        # Get environment variables
        bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        chat_id = os.getenv('TELEGRAM_CHAT_ID')
        
        # Fallback to hardcoded values if environment variables are not set
        if not bot_token:
            bot_token = "7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ"
        
        if not chat_id:
            chat_id = "7099490320"
        
        if not bot_token or not chat_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Telegram credentials not configured'
                })
            }
        
        # Parse request body
        body = request.get_body()
        if not body:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Empty request body'
                })
            }
        
        # Parse JSON data
        if isinstance(body, bytes):
            body = body.decode('utf-8')
        
        data = json.loads(body)
        
        # Validate required fields
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        
        if not name or not phone:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Name and phone are required'
                })
            }
        
        # Send to Telegram
        success = send_telegram_message(bot_token, chat_id, name, phone)
        
        if success:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Lead submitted successfully'
                })
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Failed to send message to Telegram'
                })
            }
            
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Invalid JSON'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Internal server error'
            })
        }

def send_telegram_message(bot_token, chat_id, name, phone):
    """Send message to Telegram using urllib"""
    try:
        message = f"🔥 Новая заявка CleanDrive!\n\n👤 Имя: {name}\n📱 Телефон: {phone}\n⏰ Время: {datetime.now().strftime('%d.%m.%Y %H:%M')}"
        
        telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        
        payload = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'HTML'
        }
        
        data = urllib.parse.urlencode(payload).encode('utf-8')
        req = urllib.request.Request(telegram_url, data=data, method='POST')
        req.add_header('Content-Type', 'application/x-www-form-urlencoded')
        
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.getcode() == 200
        
    except Exception as e:
        print(f"Telegram error: {e}")
        return False
