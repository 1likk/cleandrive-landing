import json
import urllib.request
import urllib.parse
from datetime import datetime
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
    def do_POST(self):
        """Test endpoint with hardcoded credentials"""
        try:
            # Ваши данные (захардкожены для теста)
            bot_token = "7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ"
            chat_id = "7099490320"
            
            # Parse request body
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_error_response(400, "Empty request body")
                return
                
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            # Validate required fields
            name = data.get('name', '').strip()
            phone = data.get('phone', '').strip()
            
            if not name or not phone:
                self.send_error_response(400, "Name and phone are required")
                return
            
            # Send to Telegram
            success = self.send_telegram_message(bot_token, chat_id, name, phone)
            
            if success:
                self.send_success_response("✅ Тест успешен! Сообщение отправлено в Telegram")
            else:
                self.send_error_response(500, "❌ Не удалось отправить в Telegram")
                
        except json.JSONDecodeError as e:
            self.send_error_response(400, f"Invalid JSON: {str(e)}")
        except Exception as e:
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def send_telegram_message(self, bot_token, chat_id, name, phone):
        """Send message to Telegram using urllib"""
        try:
            message = f"🧪 ТЕСТ CleanDrive!\n\n👤 Имя: {name}\n📱 Телефон: {phone}\n⏰ Время: {datetime.now().strftime('%d.%m.%Y %H:%M')}\n\n💡 Это тестовое сообщение"
            
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
    
    def send_success_response(self, message):
        """Send success response"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            'success': True,
            'message': message
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def send_error_response(self, status_code, message):
        """Send error response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            'success': False,
            'error': message
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def do_GET(self):
        """Handle GET requests"""
        self.send_error_response(405, "Method not allowed")
