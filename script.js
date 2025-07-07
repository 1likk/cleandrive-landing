// Плавная анимация появления элементов при скролле
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Наблюдаем за всеми секциями
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.features, .testimonials, .cta');
  sections.forEach(section => {
    observer.observe(section);
  });
});

// Обработка формы
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.cta form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
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
  
  // Показываем кнопку для просмотра всех заявок
  showFormDataButton();
});

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

// Добавляем эффект параллакса для hero секции
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }
});

// Добавляем эффект печатания для заголовка
document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.hero h1');
  if (title) {
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid white';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Убираем курсор после завершения
        setTimeout(() => {
          title.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    // Запускаем печатание с задержкой
    setTimeout(typeWriter, 1000);
  }
});

// Добавляем счетчик для чисел
function animateNumbers() {
  const numbers = document.querySelectorAll('.number-animate');
  
  numbers.forEach(number => {
    const target = parseInt(number.textContent);
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      number.textContent = Math.floor(current);
      
      if (current >= target) {
        number.textContent = target;
        clearInterval(timer);
      }
    }, 20);
  });
}

// Добавляем кнопку "Наверх"
document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #1e88e5;
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(100px);
    z-index: 1000;
  `;
  
  document.body.appendChild(scrollToTopBtn);
  
  // Показываем кнопку при прокрутке
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.transform = 'translateY(0)';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.transform = 'translateY(100px)';
    }
  });
  
  // Плавная прокрутка наверх
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Эффект при наведении
  scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
    scrollToTopBtn.style.boxShadow = '0 8px 25px rgba(30, 136, 229, 0.4)';
  });
  
  scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
    scrollToTopBtn.style.boxShadow = '0 4px 15px rgba(30, 136, 229, 0.3)';
  });
});

// Добавляем эффект снега для зимнего настроения
function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.innerHTML = '❄';
  snowflake.style.cssText = `
    position: fixed;
    top: -10px;
    color: rgba(255, 255, 255, 0.8);
    font-size: ${Math.random() * 20 + 10}px;
    left: ${Math.random() * 100}vw;
    animation: fall ${Math.random() * 3 + 2}s linear infinite;
    z-index: -1;
    pointer-events: none;
  `;
  
  document.body.appendChild(snowflake);
  
  setTimeout(() => {
    snowflake.remove();
  }, 5000);
}

// Добавляем CSS для анимации снега
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Создаем снежинки каждые 300мс
  setInterval(createSnowflake, 300);
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
  
  // Отправляем в Telegram
  sendToTelegram(formData);
}

function sendToTelegram(formData) {
  // Конфигурация Telegram бота
  const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Замените на токен вашего бота
  const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';   // Замените на ID вашего чата
  
  const message = `🚗 Новая заявка CleanDrive!
  
👤 Имя: ${formData.name}
📱 Телефон: ${formData.phone}
🕒 Время: ${formData.date}

#новая_заявка #cleandrive`;

  // Если токен не настроен, показываем инструкцию
  if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN') {
    console.log('=== ИНСТРУКЦИЯ ПО НАСТРОЙКЕ TELEGRAM ===');
    console.log('1. Создайте бота через @BotFather');
    console.log('2. Получите токен бота');
    console.log('3. Замените YOUR_BOT_TOKEN в script.js');
    console.log('4. Замените YOUR_CHAT_ID на ваш ID чата');
    console.log('=====================================');
    return;
  }

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  fetch(telegramUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      console.log('✅ Сообщение отправлено в Telegram');
    } else {
      console.error('❌ Ошибка отправки в Telegram:', data);
    }
  })
  .catch(error => {
    console.error('❌ Ошибка при отправке в Telegram:', error);
  });
}

function showFormDataButton() {
  // Создаем кнопку для просмотра всех заявок
  const adminButton = document.createElement('button');
  adminButton.innerHTML = '📋 Посмотреть заявки';
  adminButton.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    padding: 10px 15px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(adminButton);
  
  adminButton.addEventListener('click', showAllFormData);
  
  // Эффект при наведении
  adminButton.addEventListener('mouseenter', () => {
    adminButton.style.transform = 'scale(1.1)';
    adminButton.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
  });
  
  adminButton.addEventListener('mouseleave', () => {
    adminButton.style.transform = 'scale(1)';
    adminButton.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
  });
}

function showAllFormData() {
  const savedData = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  
  if (savedData.length === 0) {
    alert('Пока нет заявок');
    return;
  }
  
  let dataText = '📋 Все заявки:\n\n';
  savedData.forEach((data, index) => {
    dataText += `${index + 1}. ${data.name} - ${data.phone}\n   ${data.date}\n\n`;
  });
  
  // Создаем модальное окно
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  `;
  
  modalContent.innerHTML = `
    <h3 style="margin-top: 0; color: #1e88e5;">📋 Все заявки (${savedData.length})</h3>
    <div style="font-family: monospace; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">
      ${dataText}
    </div>
    <div style="margin-top: 20px; text-align: center;">
      <button onclick="this.closest('.modal').remove()" style="
        background: #dc3545;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
      ">Закрыть</button>
      <button onclick="navigator.clipboard.writeText('${dataText.replace(/'/g, "\\'")}'); alert('Скопировано!')" style="
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      ">Копировать</button>
    </div>
  `;
  
  modal.className = 'modal';
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Закрытие по клику на фон
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
