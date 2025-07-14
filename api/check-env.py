import json
import os
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Check environment variables"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Check environment variables
        bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        chat_id = os.getenv('TELEGRAM_CHAT_ID')
        
        # Fallback values (same as in telegram.py)
        fallback_token = "7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ"
        fallback_chat_id = "7099490320"
        
        response = {
            'telegram_bot_token': {
                'present': bool(bot_token),
                'length': len(bot_token) if bot_token else 0,
                'preview': bot_token[:10] + '...' if bot_token and len(bot_token) > 10 else bot_token,
                'using_fallback': not bool(bot_token),
                'fallback_available': bool(fallback_token)
            },
            'telegram_chat_id': {
                'present': bool(chat_id),
                'value': chat_id,
                'type': type(chat_id).__name__,
                'using_fallback': not bool(chat_id),
                'fallback_available': bool(fallback_chat_id)
            },
            'all_env_vars': {
                key: '***' if 'TOKEN' in key.upper() or 'SECRET' in key.upper() else value
                for key, value in os.environ.items()
                if key.startswith('TELEGRAM_')
            }
        }
        
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
