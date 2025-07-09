// CleanDrive - оптимизированная версия
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initForm();
  initScrollToTop();
  initTypewriter();
});

// Анимации при скролле
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.features, .testimonials, .cta').forEach(section => {
    observer.observe(section);
  });
}

// Форма заявки
function initForm() {
  const form = document.querySelector('.cta form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = form.querySelector('input[type="text"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    
    if (!name.trim() || !phone.trim()) {
      showNotification('Пожалуйста, заполните все поля!', 'error');
      return;
    }

    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    button.textContent = 'Отправляем...';
    button.disabled = true;

    try {
      const formData = {
        name: name,
        phone: phone,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('ru-RU')
      };

      // Сохраняем в localStorage
      saveToLocalStorage(formData);
      
      // Отправляем в Telegram
      await sendToTelegram(formData);
      
      // Перенаправляем на страницу благодарности
      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 1000);
      
      showNotification('Спасибо! Перенаправляем...', 'success');
      form.reset();
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      showNotification('Ошибка отправки. Попробуйте позже.', 'error');
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });
}

// Отправка в Telegram
async function sendToTelegram(formData) {
  // Определяем URL API в зависимости от окружения
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isProduction = window.location.hostname.includes('vercel.app') || window.location.hostname !== 'localhost';
  
  let apiUrl;
  if (isLocalhost) {
    apiUrl = 'http://localhost:3000/lead';
  } else {
    apiUrl = '/api/telegram';
  }
  
  console.log(`🌐 Окружение: ${isLocalhost ? 'разработка' : 'продакшен'}`);
  console.log(`📡 API URL: ${apiUrl}`);
  
  try {
    // Основной способ через API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    console.log(`📊 Ответ сервера: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    
    if (!result.success) {
      throw new Error(result.message || result.error || 'Неизвестная ошибка');
    }
    
    console.log('✅ Заявка отправлена через основной API');
    
  } catch (error) {
    console.log(`❌ Ошибка основного API: ${error.message}`);
    console.log('🔄 Пробуем запасной способ через прямой Telegram API...');
    
    // Запасной способ через прямой Telegram API (только если основной не сработал)
    try {
      const message = `🚗 Новая заявка с сайта!

👤 Имя: ${formData.name}
📱 Телефон: ${formData.phone}
🕒 Время: ${formData.date}
🌐 Источник: Сайт (fallback)

#заявка #fallback`;

      const telegramResponse = await fetch(`https://api.telegram.org/bot7954963884:AAFOLEMMTEAN6YCi-Gb1gs8JOCy8ZByloYQ/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '7099490320',
          text: message
        })
      });

      if (!telegramResponse.ok) {
        throw new Error(`Telegram API error: ${telegramResponse.status}`);
      }
      
      const telegramResult = await telegramResponse.json();
      if (!telegramResult.ok) {
        throw new Error(telegramResult.description || 'Telegram API error');
      }
      
      console.log('✅ Заявка отправлена через прямой Telegram API');
      
    } catch (fallbackError) {
      console.error('❌ Все способы отправки не сработали:', fallbackError);
      throw new Error('Не удалось отправить заявку. Попробуйте позже.');
    }
  }
}

// Сохранение в localStorage
function saveToLocalStorage(formData) {
  const saved = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  saved.push(formData);
  localStorage.setItem('formSubmissions', JSON.stringify(saved));
}

// Уведомления
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
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
    background: ${type === 'success' ? '#28a745' : '#dc3545'};
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 4000);
}

// Кнопка "Наверх"
function initScrollToTop() {
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color, #007bff);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(backToTopBtn);
  
  window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Эффект печатания заголовка
function initTypewriter() {
  const heroTitle = document.querySelector('.hero h1');
  if (!heroTitle) return;

  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  
  let i = 0;
  const typeInterval = setInterval(() => {
    heroTitle.textContent += text.charAt(i);
    i++;
    if (i > text.length) {
      clearInterval(typeInterval);
    }
  }, 100);
}

// Плавная прокрутка к якорям
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Админ-панель для просмотра заявок
function showAdminPanel() {
  const saved = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  
  if (saved.length === 0) {
    alert('Заявок пока нет');
    return;
  }
  
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    z-index: 2000;
    max-width: 500px;
    max-height: 400px;
    overflow-y: auto;
  `;
  
  panel.innerHTML = `
    <h3>📋 Заявки (${saved.length})</h3>
    <div style="max-height: 300px; overflow-y: auto;">
      ${saved.map((item, index) => `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 5px;">
          <strong>${index + 1}. ${item.name}</strong><br>
          📱 ${item.phone}<br>
          🕒 ${item.date}
        </div>
      `).join('')}
    </div>
    <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px;">Закрыть</button>
    <button onclick="localStorage.removeItem('formSubmissions'); this.parentElement.remove(); alert('Заявки очищены')" style="margin-top: 10px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px;">Очистить все</button>
  `;
  
  document.body.appendChild(panel);
}

// Горячие клавиши для админа
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    showAdminPanel();
  }
});

console.log('🚀 CleanDrive загружен успешно!');
console.log('💡 Ctrl+Shift+A для просмотра заявок');
