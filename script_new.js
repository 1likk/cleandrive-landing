// Обновленный script.js для работы с Python Telegram ботом

// Обработка формы
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.cta form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = form.querySelector('input[type="text"]').value;
      const phone = form.querySelector('input[type="tel"]').value;
      
      // Простая валидация
      if (!name.trim() || !phone.trim()) {
        showNotification('Пожалуйста, заполните все поля!', 'error');
        return;
      }
      
      // Сохраняем данные в localStorage
      saveFormData(name, phone);
      
      // Показываем данные в консоли (для разработки)
      console.log('=== НОВАЯ ЗАЯВКА ===');
      console.log('Имя:', name);
      console.log('Телефон:', phone);
      console.log('Время:', new Date().toLocaleString('ru-RU'));
      console.log('==================');
      
      // Имитация отправки
      const button = form.querySelector('button');
      const originalText = button.textContent;
      
      button.textContent = 'Отправляем...';
      button.disabled = true;
      
      setTimeout(() => {
        showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    });
  }
});

// Функции для работы с данными формы
function saveFormData(name, phone) {
  const formData = {
    name: name,
    phone: phone,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleString('ru-RU')
  };
  
  // Сохраняем в localStorage
  let savedData = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  savedData.push(formData);
  localStorage.setItem('formSubmissions', JSON.stringify(savedData));
  
  // Отправляем в Telegram через Python сервер
  sendToTelegram(formData);
}

function sendToTelegram(formData) {
  // Отправляем данные на Python сервер
  const pythonServerUrl = 'http://localhost:3000/lead';
  
  console.log('=== ОТПРАВКА НА PYTHON СЕРВЕР ===');
  console.log('URL:', pythonServerUrl);
  console.log('Данные:', formData);
  
  // Показываем пользователю, что пытаемся отправить
  showNotification('📤 Отправляем через Python сервер...', 'success');
  
  fetch(pythonServerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      date: formData.date,
      timestamp: formData.timestamp
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('=== ОТВЕТ PYTHON СЕРВЕРА ===');
    console.log('Ответ:', data);
    
    if (data.success) {
      showNotification('✅ Заявка отправлена в Telegram!', 'success');
      console.log('✅ Заявка успешно отправлена через Python бота');
    } else {
      showNotification('❌ Ошибка: ' + (data.message || 'Неизвестная ошибка'), 'error');
      console.error('❌ Ошибка Python сервера:', data.message);
    }
  })
  .catch(error => {
    console.error('❌ Ошибка подключения к Python серверу:', error);
    showNotification('❌ Python сервер недоступен. Запустите telegram_bot.py', 'error');
    
    // Fallback: пытаемся отправить напрямую в Telegram API (старый способ)
    console.log('🔄 Пробуем запасной способ...');
    sendToTelegramDirect(formData);
  });
}

// Запасной способ отправки напрямую в Telegram API  
function sendToTelegramDirect(formData) {
  const TELEGRAM_BOT_TOKEN = '7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ';
  const TELEGRAM_CHAT_ID = '7954963884';
  
  const message = `🚗 Новая заявка CleanDrive! (запасной канал)
  
👤 Имя: ${formData.name}
📱 Телефон: ${formData.phone}
🕒 Время: ${formData.date}

#новая_заявка #cleandrive #backup`;
  
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      showNotification('✅ Отправлено через запасной канал', 'success');
    } else {
      showNotification('❌ Все каналы недоступны', 'error');
    }
  })
  .catch(error => {
    showNotification('❌ Все каналы недоступны', 'error');
  });
}

// Функция для показа уведомлений
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Стили для уведомления
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
  `;
  
  document.body.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Удаление через 4 секунды
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}
